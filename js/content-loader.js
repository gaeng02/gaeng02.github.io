/**
 * 마크다운 파일들을 파싱하고 메인 페이지에 동적으로 로드하는 시스템
 */
class ContentLoader {
    constructor() {
        this.contentCache = {};
    }

    /**
     * 마크다운 파일의 frontmatter를 파싱
     */
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);
        
        if (!match) {
            return { metadata: {}, content: content };
        }

        const frontmatter = match[1];
        const markdownContent = match[2];
        
        const metadata = {};
        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // 따옴표 제거
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // 배열 파싱
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, ''));
                }
                
                metadata[key] = value;
            }
        });

        return { metadata, content: markdownContent };
    }

    /**
     * 특정 카테고리의 최신 콘텐츠를 가져오기
     */
    async getLatestContent(category, limit = 3) {
        try {
            if (category === 'post') {
                // Post 데이터는 JSON 파일에서 가져오기
                const response = await fetch('data/posts.json');
                if (response.ok) {
                    const data = await response.json();
                    return (data.posts || []).slice(0, limit);
                }
            } else if (category === 'study') {
                // Study 데이터는 JSON 파일에서 가져오기
                const response = await fetch('data/study-categories.json');
                if (response.ok) {
                    const data = await response.json();
                    const allStudies = [];
                    Object.values(data.categories || {}).forEach(category => {
                        if (category.subcategories) {
                            Object.values(category.subcategories).forEach(subcategory => {
                                if (subcategory.posts) {
                                    allStudies.push(...subcategory.posts);
                                }
                            });
                        }
                    });
                    return allStudies.slice(0, limit);
                }
            } else if (category === 'retrospect') {
                // Retrospect 데이터는 posts.json에서 "회고" 태그가 있는 포스트만 가져오기
                const response = await fetch('data/posts.json');
                if (response.ok) {
                    const data = await response.json();
                    const retrospectPosts = (data.posts || []).filter(post => {
                        if (post.tags) {
                            try {
                                const tags = Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags);
                                return tags.includes('회고');
                            } catch (e) {
                                return post.tags.includes('회고');
                            }
                        }
                        return false;
                    });
                    return retrospectPosts.slice(0, limit);
                }
            }

            return [];
        } catch (error) {
            console.error(`Error loading ${category} content:`, error);
            return [];
        }
    }

    /**
     * 프로젝트 목록을 가져오기
     */
    async getProject() {
        try {
            // 프로젝트 데이터는 JSON 파일에서 가져오기
            const response = await fetch('data/projects.json');
            if (response.ok) {
                const data = await response.json();
                return data.projects || [];
            }
            return [];
        } catch (error) {
            console.error('Error loading projects:', error);
            return [];
        }
    }

    /**
     * 최신 활동 섹션 렌더링
     */
    renderLatestActivities(content, containerId, category) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }

        if (!content || content.length === 0) {
            container.innerHTML = `<div class="error-message">${category}를 불러오는데 실패했습니다.</div>`;
            return;
        }

        const isPostCategory = category === 'post';
        
        const html = content.map(item => `
            <div class="activity-item ${isPostCategory ? 'post-item' : ''}">
                <div class="activity-content">
                    <h4>${item.title}</h4>
                    ${!isPostCategory ? `<p>${item.description}</p>` : ''}
                    <span class="activity-date">${item.date}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * 프로젝트 섹션 렌더링
     */
    renderProject(project, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = project.map(project => `
            <div class="project-card">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}">
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * 통계 데이터를 가져오는 함수
     */
    async getStats() {
        try {
            const response = await fetch('./data/stats.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const stats = await response.json();
            console.log('Stats loaded:', stats);
            return stats;
        } catch (error) {
            console.error('Error loading stats:', error);
            return {
                post: 0,
                project: 0,
                study: 0,
                retrospect: 0
            };
        }
    }

    /**
     * 메인 페이지 초기화
     */
    async initializeMainPage() {
        try {
            console.log('Initializing main page...');
            
            // 통계 데이터 로드
            const stats = await this.getStats();

            console.log('Stats loaded:', stats);

            // 통계 업데이트
            this.updateStats(stats);

            console.log('Main page initialization completed');

        } catch (error) {
            console.error('Error initializing main page:', error);
        }
    }

    /**
     * 통계 업데이트
     */
    updateStats(stats) {
        Object.keys(stats).forEach(key => {
            const element = document.getElementById(`${key}Count`);
            if (element) {
                element.textContent = stats[key];
            }
        });
    }


}

// 전역 객체로 등록
window.contentLoader = new ContentLoader();
