// 전역 객체로 등록
window.projectLoader = {
    // 프로젝트 데이터
    projectData: [],
    
    // 프로젝트 데이터를 동적으로 로드
    async loadProjectData() {
        try {
            // 실제 마크다운 파일들을 기반으로 데이터 로드
            const response = await fetch('/data/projects.json');
            if (response.ok) {
                const data = await response.json();
                this.projectData = data.projects || [];
            } else {
                // API가 없을 경우 실제 마크다운 파일들을 읽어서 데이터 생성
                console.warn('프로젝트 API를 찾을 수 없어 실제 마크다운 파일들을 읽습니다.');
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
                // API가 없을 경우 하드코딩된 샘플 데이터 사용
                console.warn('프로젝트 API를 찾을 수 없어 샘플 데이터를 사용합니다.');
                this.projectData = [
                    {
                        id: 1,
                        title: "웹 포트폴리오",
                        description: "개인 포트폴리오 웹사이트",
                        period: "2024.01 - 2024.02",
                        teamSize: "1명",
                        role: "풀스택 개발",
                        achievements: "반응형 디자인, SEO 최적화",
                        image: "image/portfolio-website.svg",
                        filename: "portfolio-website.md"
                    },
                    {
                        id: 2,
                        title: "AI 이미지 분류기",
                        description: "머신러닝을 활용한 이미지 분류 시스템",
                        period: "2023.11 - 2023.12",
                        teamSize: "3명",
                        role: "백엔드 개발",
                        achievements: "정확도 95% 달성, API 개발",
                        image: "image/deepfake-detection.svg",
                        filename: "ai-image-classifier.md"
                    },
                    {
                        id: 3,
                        title: "모바일 앱",
                        description: "React Native로 개발한 크로스 플랫폼 앱",
                        period: "2023.09 - 2023.10",
                        teamSize: "2명",
                        role: "프론트엔드 개발",
                        achievements: "iOS/Android 동시 지원",
                        image: "image/escape-room-app.svg",
                        filename: "mobile-app.md"
                    }
                ];
            }
        } catch (error) {
            console.error('마크다운 파일 로드 실패:', error);
            this.projectData = [];
        }
    },
    
    // 페이지 초기화
    async initializePage() {
        await this.loadProjectData();
        this.renderProjects();
        this.updateProjectCount();
    },
    
    // 프로젝트 렌더링
    renderProjects() {
        const projectsGrid = document.getElementById('projectsGrid');
        if (!projectsGrid) return;
        
        // 최신순으로 정렬
        const sortedProjects = [...this.projectData].sort((a, b) => {
            const dateA = new Date(a.period.split(' - ')[1] || a.period);
            const dateB = new Date(b.period.split(' - ')[1] || b.period);
            return dateB - dateA;
        });
        
        if (sortedProjects.length === 0) {
            projectsGrid.innerHTML = '<p class="no-projects">프로젝트가 없습니다.</p>';
            return;
        }
        
                            const projectsHTML = sortedProjects.map(project => `
                        <div class="project-card" onclick="window.location.href='./project-detail.html?project=${project.filename}'" style="cursor: pointer;">
                            ${project.image ? `<div class="project-image">
                                <img src="./content/project/${project.image}" alt="${project.title}" onerror="this.style.display='none'">
                            </div>` : ''}
                            <div class="project-header">
                                <div>
                                    <h3 class="project-title">${project.title}</h3>
                                    <div class="project-meta">
                                        <span class="project-period">${project.period}</span>
                                        <span class="project-team">${project.teamSize}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="project-content">
                                <p class="project-description">${project.description}</p>
                                <div class="project-details">
                                    <div class="project-role">
                                        <strong>역할:</strong> ${project.role}
                                    </div>
                                    <div class="project-achievements">
                                        <strong>성과:</strong> ${project.achievements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('');
        
        projectsGrid.innerHTML = projectsHTML;
    },
    
    // 프로젝트 개수 업데이트
    updateProjectCount() {
        const projectCountElement = document.getElementById('projectCount');
        if (projectCountElement) {
            projectCountElement.textContent = this.projectData.length;
        }
    }
};
