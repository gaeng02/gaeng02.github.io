window.retrospectLoader = {
    currentPage: 1,
    itemsPerPage: 9,
    currentFilter: 'all',
    retrospectData: [], // 동적으로 로드될 데이터
    
    // 회고 데이터를 동적으로 로드
    async loadRetrospectData() {
        try {
            // 실제 마크다운 파일들을 기반으로 데이터 로드
            const response = await fetch('/data/retrospects.json');
            if (response.ok) {
                const data = await response.json();
                this.retrospectData = data.retrospects || [];
            } else {
                // API가 없을 경우 하드코딩된 샘플 데이터 사용
                console.warn('회고 API를 찾을 수 없어 샘플 데이터를 사용합니다.');
                this.retrospectData = [
                {
                    id: 1,
                    title: "2023년 개발 회고",
                    description: "2023년 한 해 동안의 개발 경험과 배움을 정리한 회고",
                    image: "https://via.placeholder.com/300x200/3b82f6/ffffff?text=2023+회고",
                    tags: ["성장회고", "개발회고"],
                    date: "2024-01-01T00:00:00",
                    filename: "2023-dev-retrospect.md"
                },
                {
                    id: 2,
                    title: "React 학습 회고",
                    description: "React를 배우면서 겪은 어려움과 해결 방법",
                    image: "https://via.placeholder.com/300x200/10b981/ffffff?text=React+학습",
                    tags: ["학습회고", "React"],
                    date: "2023-12-15T00:00:00",
                    filename: "react-learning-retrospect.md"
                },
                {
                    id: 3,
                    title: "TypeScript 도입 회고",
                    description: "JavaScript 프로젝트에 TypeScript를 도입한 경험",
                    image: "https://via.placeholder.com/300x200/f59e0b/ffffff?text=TypeScript",
                    tags: ["기술회고", "TypeScript"],
                    date: "2023-12-10T00:00:00",
                    filename: "typescript-adoption-retrospect.md"
                },
                {
                    id: 4,
                    title: "Docker 학습 회고",
                    description: "컨테이너 기술을 배우면서 얻은 인사이트",
                    image: "https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Docker",
                    tags: ["학습회고", "Docker"],
                    date: "2023-12-05T00:00:00",
                    filename: "docker-learning-retrospect.md"
                },
                {
                    id: 5,
                    title: "UI/UX 개선 프로젝트 회고",
                    description: "사용자 경험 개선을 위한 디자인 시스템 구축",
                    image: "https://via.placeholder.com/300x200/ef4444/ffffff?text=UI+UX",
                    tags: ["프로젝트회고", "UI/UX"],
                    date: "2023-12-28T00:00:00",
                    filename: "uiux-improvement-retrospect.md"
                },
                {
                    id: 6,
                    title: "성능 최적화 경험담",
                    description: "웹 애플리케이션 성능 개선을 위한 노력들",
                    image: "https://via.placeholder.com/300x200/06b6d4/ffffff?text=성능최적화",
                    tags: ["기술회고", "성능최적화"],
                    date: "2023-12-20T00:00:00",
                    filename: "performance-optimization-retrospect.md"
                },
                {
                    id: 7,
                    title: "주니어 개발자 성장기",
                    description: "주니어 개발자로서 겪은 성장 과정과 배움",
                    image: "https://via.placeholder.com/300x200/84cc16/ffffff?text=성장기",
                    tags: ["성장회고", "개발자"],
                    date: "2023-11-30T00:00:00",
                    filename: "junior-dev-growth-retrospect.md"
                },
                {
                    id: 8,
                    title: "목표 설정과 달성",
                    description: "연간 목표를 설정하고 달성한 과정",
                    image: "https://via.placeholder.com/300x200/f97316/ffffff?text=목표달성",
                    tags: ["성장회고", "목표설정"],
                    date: "2023-11-25T00:00:00",
                    filename: "goal-setting-retrospect.md"
                },
                {
                    id: 9,
                    title: "습관 형성의 중요성",
                    description: "개발자로서 좋은 습관을 만드는 방법",
                    image: "https://via.placeholder.com/300x200/ec4899/ffffff?text=습관형성",
                    tags: ["성장회고", "습관"],
                    date: "2023-11-20T00:00:00",
                    filename: "habit-formation-retrospect.md"
                },
                {
                    id: 10,
                    title: "Git 워크플로우 개선",
                    description: "팀 프로젝트에서 Git 워크플로우를 개선한 경험",
                    image: "https://via.placeholder.com/300x200/6366f1/ffffff?text=Git",
                    tags: ["기술회고", "Git"],
                    date: "2023-11-15T00:00:00",
                    filename: "git-workflow-retrospect.md"
                },
                {
                    id: 11,
                    title: "코드 리뷰 문화 정착",
                    description: "팀 내 코드 리뷰 문화를 정착시킨 과정",
                    image: "https://via.placeholder.com/300x200/14b8a6/ffffff?text=코드리뷰",
                    tags: ["프로젝트회고", "코드리뷰"],
                    date: "2023-11-10T00:00:00",
                    filename: "code-review-culture-retrospect.md"
                },
                {
                    id: 12,
                    title: "테스트 코드 작성 경험",
                    description: "테스트 주도 개발을 적용한 프로젝트 경험",
                    image: "https://via.placeholder.com/300x200/a855f7/ffffff?text=테스트",
                    tags: ["기술회고", "테스트"],
                    date: "2023-11-05T00:00:00",
                    filename: "test-driven-dev-retrospect.md"
                }
            ];
            
            // 실제 구현 시에는 다음과 같이 마크다운 파일들을 파싱할 수 있습니다:
            // const response = await fetch('/api/retrospects');
            // this.retrospectData = await response.json();
            
        } catch (error) {
            console.error('회고 데이터 로드 실패:', error);
            this.retrospectData = [];
        }
    },

    // 페이지 초기화
    async initializePage() {
        await this.loadRetrospectData();
        this.setupEventListeners();
        this.renderRetrospects();
        this.renderPagination();
    },

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 태그 필터 버튼들 생성
        this.createTagFilters();
        
        // 태그 필터 이벤트
        document.querySelectorAll('.tag-filter').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleTagFilter(e.target);
            });
        });
    },

    // 태그 필터 버튼들을 동적으로 생성
    createTagFilters() {
        const tagFiltersContainer = document.querySelector('.tag-filters');
        if (!tagFiltersContainer) return;

        // 모든 고유한 태그 수집
        const allTags = new Set();
        this.retrospectData.forEach(item => {
            if (Array.isArray(item.tags)) {
                item.tags.forEach(tag => allTags.add(tag));
            }
        });

        // 기존 필터 버튼들 제거 (전체 버튼 제외)
        const existingFilters = tagFiltersContainer.querySelectorAll('.tag-filter:not([data-tag="all"])');
        existingFilters.forEach(filter => filter.remove());

        // 새로운 태그 필터 버튼들 생성
        Array.from(allTags).sort().forEach(tag => {
            const button = document.createElement('button');
            button.className = 'tag-filter';
            button.setAttribute('data-tag', tag);
            button.textContent = tag;
            tagFiltersContainer.appendChild(button);
        });
    },

    // 태그 필터 처리
    handleTagFilter(clickedButton) {
        // 활성 버튼 변경
        document.querySelectorAll('.tag-filter').forEach(btn => {
            btn.classList.remove('active');
        });
        clickedButton.classList.add('active');

        // 필터 적용
        this.currentFilter = clickedButton.dataset.tag;
        this.currentPage = 1;
        this.renderRetrospects();
        this.renderPagination();
    },

    // 필터링된 데이터 가져오기
    getFilteredData() {
        if (this.currentFilter === 'all') {
            return this.retrospectData;
        }
        return this.retrospectData.filter(item => 
            item.tags.some(tag => tag === this.currentFilter)
        );
    },

    // 현재 페이지 데이터 가져오기
    getCurrentPageData() {
        const filteredData = this.getFilteredData();
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    },

    // 회고 카드 렌더링
    renderRetrospects() {
        const grid = document.getElementById('retrospectGrid');
        const currentData = this.getCurrentPageData();

        if (currentData.length === 0) {
            grid.innerHTML = '<p class="no-results">해당 태그의 회고가 없습니다.</p>';
            return;
        }

        const cardsHTML = currentData.map(item => `
            <div class="retrospect-card">
                <div class="retrospect-image">
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                </div>
                <div class="retrospect-content">
                    <h3 class="retrospect-title">${item.title}</h3>
                    <div class="retrospect-tags">
                        ${item.tags.map(tag => `<span class="retrospect-tag">#${tag}</span>`).join('')}
                    </div>
                    <p class="retrospect-description">${item.description}</p>
                    <div class="retrospect-date">${this.formatDate(item.date)}</div>
                </div>
            </div>
        `).join('');

        grid.innerHTML = cardsHTML;
    },

    // 페이지네이션 렌더링
    renderPagination() {
        const pagination = document.getElementById('pagination');
        const filteredData = this.getFilteredData();
        const totalPages = Math.ceil(filteredData.length / this.itemsPerPage);

        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        
        // 이전 버튼
        if (this.currentPage > 1) {
            paginationHTML += `<button class="pagination-btn" onclick="window.retrospectLoader.goToPage(${this.currentPage - 1})">이전</button>`;
        }

        // 페이지 번호들
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                paginationHTML += `<button class="pagination-btn active">${i}</button>`;
            } else {
                paginationHTML += `<button class="pagination-btn" onclick="window.retrospectLoader.goToPage(${i})">${i}</button>`;
            }
        }

        // 다음 버튼
        if (this.currentPage < totalPages) {
            paginationHTML += `<button class="pagination-btn" onclick="window.retrospectLoader.goToPage(${this.currentPage + 1})">다음</button>`;
        }

        pagination.innerHTML = paginationHTML;
    },

    // 페이지 이동
    goToPage(page) {
        this.currentPage = page;
        this.renderRetrospects();
        this.renderPagination();
        
        // 페이지 상단으로 스크롤
        document.querySelector('.retrospect-content').scrollIntoView({ 
            behavior: 'smooth' 
        });
    },

    // 날짜 포맷팅
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }
};
