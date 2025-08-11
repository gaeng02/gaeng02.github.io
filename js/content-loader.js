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
            // 실제 구현에서는 서버에서 파일 목록을 가져와야 하지만,
            // 현재는 하드코딩된 예시 데이터를 사용
            const contentMap = {
                'posts': [
                    {
                        title: "웹 개발자의 성장 여정",
                        date: "2024-01-15",
                        description: "주니어 개발자에서 시니어 개발자로 성장하는 방법",
                        slug: "web-developer-journey",
                        icon: "✍️"
                    },
                    {
                        title: "프로젝트 관리 팁",
                        date: "2024-01-10",
                        description: "효율적인 프로젝트 관리와 협업 방법",
                        slug: "project-management-tips",
                        icon: "🚀"
                    },
                    {
                        title: "코드 리뷰의 중요성",
                        date: "2024-01-08",
                        description: "좋은 코드 리뷰 문화를 만드는 방법",
                        slug: "code-review-importance",
                        icon: "🎯"
                    }
                ],
                'study': [
                    {
                        title: "React Hooks 완벽 가이드",
                        date: "2024-01-15",
                        description: "React Hooks의 모든 것을 알아보는 심화 학습",
                        slug: "react-hooks-guide",
                        icon: "📚"
                    },
                    {
                        title: "TypeScript 기초부터 고급까지",
                        date: "2024-01-10",
                        description: "TypeScript의 타입 시스템과 고급 기능들",
                        slug: "typescript-guide",
                        icon: "💻"
                    },
                    {
                        title: "Docker 컨테이너화",
                        date: "2024-01-05",
                        description: "Docker를 활용한 애플리케이션 배포 방법",
                        slug: "docker-containerization",
                        icon: "🔧"
                    }
                ],
                'retrospect': [
                    {
                        title: "2023년 개발 회고",
                        date: "2024-01-01",
                        description: "2023년 한 해 동안의 개발 경험과 배움",
                        slug: "2023-development-retrospect",
                        icon: "📝"
                    },
                    {
                        title: "UI/UX 개선 프로젝트 회고",
                        date: "2023-12-28",
                        description: "사용자 경험 개선을 위한 디자인 시스템 구축",
                        slug: "ui-ux-improvement-retrospect",
                        icon: "🎨"
                    },
                    {
                        title: "성능 최적화 경험담",
                        date: "2023-12-20",
                        description: "웹 애플리케이션 성능 개선을 위한 노력들",
                        slug: "performance-optimization-retrospect",
                        icon: "🔍"
                    }
                ]
            };

            return contentMap[category] || [];
        } catch (error) {
            console.error(`Error loading ${category} content:`, error);
            return [];
        }
    }

    /**
     * 프로젝트 목록을 가져오기
     */
    async getProjects() {
        try {
            // 실제 구현에서는 서버에서 프로젝트 데이터를 가져와야 하지만,
            // 현재는 하드코딩된 예시 데이터를 사용
            return [
                {
                    title: "웹 포트폴리오",
                    description: "React와 TypeScript를 사용한 개인 포트폴리오 웹사이트",
                    image: "https://via.placeholder.com/300x200/3b82f6/ffffff?text=Project+1",
                    tags: ["React", "TypeScript", "CSS3"],
                    slug: "web-portfolio"
                },
                {
                    title: "모바일 앱",
                    description: "React Native로 개발한 크로스 플랫폼 모바일 애플리케이션",
                    image: "https://via.placeholder.com/300x200/10b981/ffffff?text=Project+2",
                    tags: ["React Native", "JavaScript", "Firebase"],
                    slug: "mobile-app"
                },
                {
                    title: "AI 챗봇",
                    description: "Python과 TensorFlow를 활용한 자연어 처리 챗봇",
                    image: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=Project+3",
                    tags: ["Python", "TensorFlow", "NLP"],
                    slug: "ai-chatbot"
                },
                {
                    title: "게임 개발",
                    description: "Unity를 사용한 2D 플랫폼 게임",
                    image: "https://via.placeholder.com/300x200/ef4444/ffffff?text=Project+4",
                    tags: ["Unity", "C#", "Game Dev"],
                    slug: "game-development"
                },
                {
                    title: "데스크톱 앱",
                    description: "Electron을 활용한 크로스 플랫폼 데스크톱 애플리케이션",
                    image: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Project+5",
                    tags: ["Electron", "Node.js", "HTML/CSS"],
                    slug: "desktop-app"
                },
                {
                    title: "데이터 분석",
                    description: "Python과 Pandas를 사용한 데이터 분석 및 시각화 프로젝트",
                    image: "https://via.placeholder.com/300x200/06b6d4/ffffff?text=Project+6",
                    tags: ["Python", "Pandas", "Matplotlib"],
                    slug: "data-analysis"
                }
            ];
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

        const isPostCategory = category === 'posts';
        
        const html = content.map(item => `
            <div class="activity-item ${isPostCategory ? 'post-item' : ''}">
                <div class="activity-icon">${item.icon}</div>
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
    renderProjects(projects, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const html = projects.map(project => `
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
     * 메인 페이지 초기화
     */
    async initializeMainPage() {
        try {
            console.log('Initializing main page...');
            
            // 프로젝트 로드 및 렌더링
            const projects = await this.getProjects();
            console.log('Projects loaded:', projects);
            this.renderProjects(projects, 'projectsGrid');

            // 최신 활동 로드 및 렌더링
            const [posts, study, retrospect] = await Promise.all([
                this.getLatestContent('posts'),
                this.getLatestContent('study'),
                this.getLatestContent('retrospect')
            ]);

            console.log('Posts loaded:', posts);
            console.log('Study loaded:', study);
            console.log('Retrospect loaded:', retrospect);

            this.renderLatestActivities(posts, 'recentPosts', 'posts');
            this.renderLatestActivities(study, 'recentStudies', 'study');
            this.renderLatestActivities(retrospect, 'recentRetrospects', 'retrospect');

            // 통계 업데이트
            this.updateStats({
                projects: projects.length,
                posts: posts.length,
                study: study.length,
                retrospect: retrospect.length,
                tags: this.countUniqueTags(projects)
            });

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

    /**
     * 고유 태그 수 계산
     */
    countUniqueTags(projects) {
        const allTags = projects.flatMap(project => project.tags);
        return new Set(allTags).size;
    }
}

// 전역 객체로 등록
window.contentLoader = new ContentLoader();
