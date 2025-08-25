// 전역 객체로 등록
window.projectLoader = {
    // 프로젝트 데이터
    projectData: [],
    
    // 프로젝트 데이터를 동적으로 로드
    async loadProjectData() {
        try {
            // data/projects.json에서 데이터 로드
            const response = await fetch('data/projects.json');
            if (response.ok) {
                const data = await response.json();
                this.projectData = data.projects || [];
                console.log('프로젝트 데이터 로드 성공:', this.projectData);
            } else {
                console.warn('프로젝트 데이터를 찾을 수 없어 샘플 데이터를 사용합니다.');
                await this.loadFromMarkdownFiles();
            }
        } catch (error) {
            console.error('프로젝트 데이터 로드 실패:', error);
            // 에러 발생 시에도 마크다운 파일들을 읽어서 데이터 생성
            await this.loadFromMarkdownFiles();
        }
    },
    
    // 마크다운 파일들에서 프로젝트 데이터 생성
    async loadFromMarkdownFiles() {
        try {
            // content/project 폴더의 마크다운 파일들을 읽기
            const response = await fetch('/api/projects');
            if (response.ok) {
                const files = await response.json();
                this.projectData = files.map((file, index) => ({
                    id: index + 1,
                    title: file.title || file.filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    description: file.description || `${file.title || file.filename} 프로젝트입니다.`,
                    period: file.period || "2024.01 - 2024.02",
                    teamSize: file.teamSize || "1명",
                    role: file.role || "풀스택 개발",
                    achievements: file.achievements || "프로젝트 완료",
                    image: file.image || null,
                    filename: file.filename
                }));
            } else {
                console.warn('프로젝트 데이터를 찾을 수 없습니다.');
                this.projectData = [];
            }
        } catch (error) {
            console.error('마크다운 파일 로드 실패:', error);
            this.projectData = [];
        }
    },
    
    // 페이지 초기화
    async initializePage() {
        console.log('프로젝트 로더 초기화 시작');
        try {
            await this.loadProjectData();
            console.log('프로젝트 데이터 로드 완료:', this.projectData);
            this.renderProjects();
            this.updateProjectCount();
            console.log('프로젝트 렌더링 완료');
        } catch (error) {
            console.error('프로젝트 초기화 중 에러:', error);
        }
    },
    
    // 프로젝트 렌더링
    renderProjects() {
        console.log('프로젝트 렌더링 시작');
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) {
            console.error('projectsGrid 엘리먼트를 찾을 수 없습니다');
            return;
        }
        
        // 최신순으로 정렬
        const sortedProjects = [...this.projectData].sort((a, b) => {
            // 날짜 필드 우선순위: date > period > lastUpdated
            const getDate = (project) => {
                if (project.date) return new Date(project.date);
                if (project.period) {
                    const periodDate = project.period.split(' - ')[1] || project.period;
                    return new Date(periodDate);
                }
                return new Date(); // 기본값으로 현재 날짜
            };
            
            const dateA = getDate(a);
            const dateB = getDate(b);
            return dateB - dateA;
        });
        
        if (sortedProjects.length === 0) {
            console.log('렌더링할 프로젝트가 없습니다');
            projectsGrid.innerHTML = '<p class="no-projects">프로젝트가 없습니다.</p>';
            return;
        }
        
        console.log('정렬된 프로젝트:', sortedProjects);
        
        try {
            const projectsHTML = sortedProjects.map(project => {
                // 안전한 값 추출
                const title = project.title || '제목 없음';
                const description = project.description || '설명 없음';
                const slug = project.slug || project.filename || 'unknown';
                const date = project.date || project.period || '날짜 미정';
                const teamSize = project.teamSize || '팀 규모 미정';
                
                return `
                <div class="project-card" onclick="window.location.href='project-detail.html?project=${slug}'" style="cursor: pointer;">
                    <div class="project-layout">
                        <div class="project-left">
                            ${project.image ? `<div class="project-image">
                                <img src="content/project/${project.image}" alt="${title}" onerror="this.style.display='none'">
                            </div>` : ''}
                            <div class="project-info">
                                <h3 class="project-title">${title}</h3>
                                <p class="project-description">${description}</p>
                                <div class="project-meta">
                                    <div class="project-period">📅 ${project.period || date}</div>
                                    <div class="project-team-role">👥 ${teamSize} - ${project.role || '역할 미정'}</div>
                                </div>
                                ${project.achievements ? `<div class="project-achievements">
                                    <strong>성과:</strong> ${project.achievements}
                                </div>` : ''}
                                ${project.tags ? `<div class="project-tags">
                                    ${Array.isArray(project.tags) ? 
                                        project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('') :
                                        (typeof project.tags === 'string' ? 
                                            project.tags.split(',').map(tag => `<span class="project-tag">${tag.trim()}</span>`).join('') :
                                            ''
                                        )
                                    }
                                </div>` : ''}
                            </div>
                        </div>
                    </div>
                </div>`;
            }).join('');
            
            projectsGrid.innerHTML = projectsHTML;
            console.log('프로젝트 HTML 렌더링 완료');
        } catch (error) {
            console.error('프로젝트 렌더링 중 에러:', error);
            projectsGrid.innerHTML = '<p class="error-message">프로젝트를 불러오는 중 오류가 발생했습니다.</p>';
        }
    },
    
    // 프로젝트 개수 업데이트
    updateProjectCount() {
        const projectCountElement = document.getElementById('projectCount');
        if (projectCountElement) {
            projectCountElement.textContent = this.projectData.length;
        }
    }
};
