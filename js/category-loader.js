// 카테고리 로더
class CategoryLoader {
    constructor() {
        this.categories = {};
    }

    // 카테고리 정보를 파싱하는 함수
    parseCategoryInfo(content) {
        const lines = content.split('\n');
        const info = {};
        
        for (const line of lines) {
            if (line.includes('**이름**:')) {
                info.name = line.split('**이름**:')[1].trim();
            } else if (line.includes('**설명**:')) {
                info.description = line.split('**설명**:')[1].trim();
            } else if (line.includes('**태그**:')) {
                info.tags = line.split('**태그**:')[1].trim().split(', ');
            } else if (line.includes('**색상**:')) {
                info.color = line.split('**색상**:')[1].trim();
            }
        }
        
        return info;
    }

    // 카테고리 폴더 목록을 가져오는 함수
    async getCategories(categoryType) {
        try {
            const response = await fetch(`/api/categories/${categoryType}`);
            if (response.ok) {
                const categories = await response.json();
                return categories;
            } else {
                // API가 없을 경우 폴더 구조 기반으로 동적 생성
                return this.getDynamicCategories(categoryType);
            }
        } catch (error) {
            console.warn('API 호출 실패, 동적 카테고리 생성:', error);
            return this.getDynamicCategories(categoryType);
        }
    }

    // 폴더 구조를 기반으로 동적으로 카테고리 생성
    getDynamicCategories(categoryType) {
        if (categoryType === 'study') {
            return this.getStudyCategoriesFromStructure();
        } else if (categoryType === 'projects') {
            return this.getProjectCategoriesFromStructure();
        }
        return this.getDefaultCategories(categoryType);
    }

    // Study 폴더 구조를 기반으로 카테고리 생성 (계층적 구조)
    getStudyCategoriesFromStructure() {
        // 대분류 카테고리 구조
        const categoryStructure = {
            'computer-science': {
                name: 'Computer Science',
                icon: '💻',
                description: '컴퓨터 과학의 기초 이론과 원리 학습',
                subcategories: {
                    'database': { name: 'Database', icon: '🗄️', description: '데이터베이스 시스템과 SQL 학습' },
                    'operating-system': { name: 'Operating System', icon: '🖥️', description: '운영체제 원리와 구현' },
                    'algorithm': { name: 'Algorithm', icon: '⚡', description: '알고리즘과 자료구조 학습' },
                    'compiler': { name: 'Compiler', icon: '🔍', description: '컴파일러 이론과 구현' },
                    'network': { name: 'Network', icon: '🌐', description: '네트워크 프로토콜과 통신' },
                    'data-structure': { name: 'Data Structure', icon: '📊', description: '자료구조와 메모리 관리' }
                }
            },
            'ai': {
                name: 'AI',
                icon: '🤖',
                description: '인공지능과 머신러닝 기술 학습',
                subcategories: {
                    'machine-learning': { name: 'Machine Learning', icon: '🧠', description: '머신러닝 알고리즘과 모델' },
                    'deep-learning': { name: 'Deep Learning', icon: '🕸️', description: '딥러닝과 신경망' },
                    'computer-vision': { name: 'Computer Vision', icon: '👁️', description: '컴퓨터 비전과 이미지 처리' },
                    'nlp': { name: 'NLP', icon: '💬', description: '자연어 처리와 언어 모델' },
                    'reinforcement-learning': { name: 'Reinforcement Learning', icon: '🎮', description: '강화학습과 에이전트' }
                }
            },
            'web-development': {
                name: 'Web Development',
                icon: '🌍',
                description: '웹 개발 기술과 프레임워크 학습',
                subcategories: {
                    'frontend': { name: 'Frontend', icon: '🎨', description: 'HTML, CSS, JavaScript, React, Vue 등' },
                    'backend': { name: 'Backend', icon: '⚙️', description: 'Node.js, Python, Java 등 서버 개발' },
                    'fullstack': { name: 'Fullstack', icon: '🔗', description: '전체 스택 개발 기술' },
                    'devops': { name: 'DevOps', icon: '🔧', description: 'Docker, Kubernetes, CI/CD 등' }
                }
            }
        };

        // 대분류 카테고리만 반환 (메인 페이지용)
        return Object.keys(categoryStructure).map(key => {
            const category = categoryStructure[key];
            return {
                name: category.name,
                slug: key,
                icon: category.icon,
                description: category.description,
                tags: [category.name],
                hasSubcategories: true
            };
        });
    }

    // 서브카테고리를 가져오는 함수
    getSubcategories(mainCategory) {
        const categoryStructure = {
            'computer-science': {
                'database': { name: 'Database', icon: '🗄️', description: '데이터베이스 시스템과 SQL 학습' },
                'operating-system': { name: 'Operating System', icon: '🖥️', description: '운영체제 원리와 구현' },
                'algorithm': { name: 'Algorithm', icon: '⚡', description: '알고리즘과 자료구조 학습' },
                'compiler': { name: 'Compiler', icon: '🔍', description: '컴파일러 이론과 구현' },
                'network': { name: 'Network', icon: '🌐', description: '네트워크 프로토콜과 통신' },
                'data-structure': { name: 'Data Structure', icon: '📊', description: '자료구조와 메모리 관리' }
            },
            'ai': {
                'machine-learning': { name: 'Machine Learning', icon: '🧠', description: '머신러닝 알고리즘과 모델' },
                'deep-learning': { name: 'Deep Learning', icon: '🕸️', description: '딥러닝과 신경망' },
                'computer-vision': { name: 'Computer Vision', icon: '👁️', description: '컴퓨터 비전과 이미지 처리' },
                'nlp': { name: 'NLP', icon: '💬', description: '자연어 처리와 언어 모델' },
                'reinforcement-learning': { name: 'Reinforcement Learning', icon: '🎮', description: '강화학습과 에이전트' }
            },
            'web-development': {
                'frontend': { name: 'Frontend', icon: '🎨', description: 'HTML, CSS, JavaScript, React, Vue 등' },
                'backend': { name: 'Backend', icon: '⚙️', description: 'Node.js, Python, Java 등 서버 개발' },
                'fullstack': { name: 'Fullstack', icon: '🔗', description: '전체 스택 개발 기술' },
                'devops': { name: 'DevOps', icon: '🔧', description: 'Docker, Kubernetes, CI/CD 등' }
            }
        };

        const subcategories = categoryStructure[mainCategory];
        if (!subcategories) return [];

        return Object.keys(subcategories).map(key => {
            const subcategory = subcategories[key];
            return {
                name: subcategory.name,
                slug: key,
                icon: subcategory.icon,
                description: subcategory.description,
                tags: [subcategory.name]
            };
        });
    }

    // Project 폴더 구조를 기반으로 카테고리 생성
    getProjectCategoriesFromStructure() {
        const folderStructure = [
            'web', 'mobile', 'desktop', 'ai', 'game', 'other'
        ];
        
        const nameMap = {
            'web': 'Web Development',
            'mobile': 'Mobile Apps',
            'desktop': 'Desktop Apps',
            'ai': 'AI/ML Projects',
            'game': 'Game Development',
            'other': 'Other Projects'
        };

        const descriptionMap = {
            'web': 'React, Vue, Angular 등을 활용한 웹 애플리케이션 개발',
            'mobile': 'React Native, Flutter를 활용한 크로스 플랫폼 모바일 앱',
            'desktop': 'Electron, Tauri를 활용한 데스크톱 애플리케이션',
            'ai': '머신러닝과 인공지능을 활용한 프로젝트',
            'game': 'Unity, Unreal Engine을 활용한 게임 개발',
            'other': '기타 다양한 기술을 활용한 프로젝트들'
        };

        const colorMap = {
            'web': '#3b82f6',
            'mobile': '#10b981',
            'desktop': '#f59e0b',
            'ai': '#ef4444',
            'game': '#8b5cf6',
            'other': '#06b6d4'
        };

        return folderStructure.map(folder => ({
            name: nameMap[folder] || folder,
            slug: folder,
            description: descriptionMap[folder] || `${folder} 관련 프로젝트`,
            color: colorMap[folder] || '#64748b',
            tags: [nameMap[folder] || folder]
        }));
    }

    // 기본 카테고리 반환
    getDefaultCategories(categoryType) {
        if (categoryType === 'study') {
            return [
                {
                    name: 'Frontend',
                    description: 'HTML, CSS, JavaScript, React, Vue 등 프론트엔드 기술 학습',
                    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue', 'Angular'],
                    color: '#3b82f6',
                    slug: 'frontend'
                },
                {
                    name: 'Backend',
                    description: 'Node.js, Python, Java 등 백엔드 개발 기술 학습',
                    tags: ['Node.js', 'Python', 'Java', 'Spring', 'Express'],
                    color: '#10b981',
                    slug: 'backend'
                },
                {
                    name: 'Database',
                    description: 'MySQL, PostgreSQL, MongoDB 등 데이터베이스 학습',
                    tags: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis'],
                    color: '#f59e0b',
                    slug: 'database'
                },
                {
                    name: 'DevOps',
                    description: 'Docker, Kubernetes, CI/CD 등 DevOps 도구 학습',
                    tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
                    color: '#ef4444',
                    slug: 'devops'
                },
                {
                    name: 'Algorithm',
                    description: '자료구조, 알고리즘, 문제 해결 능력 향상',
                    tags: ['Data Structure', 'Algorithm', 'Problem Solving'],
                    color: '#8b5cf6',
                    slug: 'algorithm'
                },
                {
                    name: 'Compiler',
                    description: '컴파일러 이론과 실제 구현 방법 학습',
                    tags: ['Compiler', 'Lexer', 'Parser', 'AST'],
                    color: '#06b6d4',
                    slug: 'compiler'
                }
            ];
        } else if (categoryType === 'projects') {
            return [
                {
                    name: 'Web Development',
                    description: 'React, Vue, Angular 등을 활용한 웹 애플리케이션 개발',
                    tags: ['React', 'Vue', 'Angular', 'JavaScript'],
                    color: '#3b82f6',
                    slug: 'web'
                },
                {
                    name: 'Mobile Apps',
                    description: 'React Native, Flutter를 활용한 크로스 플랫폼 모바일 앱',
                    tags: ['React Native', 'Flutter', 'iOS', 'Android'],
                    color: '#10b981',
                    slug: 'mobile'
                },
                {
                    name: 'Desktop Apps',
                    description: 'Electron, Tauri를 활용한 데스크톱 애플리케이션',
                    tags: ['Electron', 'Tauri', 'Node.js'],
                    color: '#f59e0b',
                    slug: 'desktop'
                },
                {
                    name: 'AI/ML Projects',
                    description: '머신러닝과 인공지능을 활용한 프로젝트',
                    tags: ['Python', 'TensorFlow', 'PyTorch'],
                    color: '#ef4444',
                    slug: 'ai'
                },
                {
                    name: 'Game Development',
                    description: 'Unity, Unreal Engine을 활용한 게임 개발',
                    tags: ['Unity', 'C#', 'Game Dev'],
                    color: '#8b5cf6',
                    slug: 'game'
                },
                {
                    name: 'Other Projects',
                    description: '기타 다양한 기술을 활용한 프로젝트들',
                    tags: ['IoT', 'Blockchain', 'DevOps'],
                    color: '#06b6d4',
                    slug: 'other'
                }
            ];
        }
        return [];
    }

    // 카테고리 카드를 렌더링하는 함수
    renderCategoryCards(categories, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        // Study 페이지인지 확인 (containerId가 studyCategoriesGrid인 경우)
        const isStudyPage = containerId === 'studyCategoriesGrid';
        
        if (isStudyPage) {
            // Study 페이지는 상위 카테고리와 서브카테고리를 모두 표시
            const getCategoryIcon = (categoryName) => {
                const iconMap = {
                    'Frontend': '🎨',
                    'Backend': '⚙️',
                    'Database': '🗄️',
                    'DevOps': '🔧',
                    'Algorithm': '⚡',
                    'Compiler': '🔍',
                    'Operating System': '🖥️',
                    'Network': '🌐',
                    'Data Structure': '📊',
                    'Machine Learning': '🧠',
                    'Deep Learning': '🕸️',
                    'Computer Vision': '👁️',
                    'NLP': '💬',
                    'Reinforcement Learning': '🎮',
                    'Fullstack': '🔗'
                };
                return iconMap[categoryName] || '📚';
            };

            // 모든 카테고리와 서브카테고리를 포함한 HTML 생성
            const sectionsHTML = categories.map(category => {
                const subcategories = this.getSubcategories(category.slug);
                const subcategoriesHTML = subcategories.map(sub => `
                    <a href="/study/${category.slug}/${sub.slug}/" class="study-category-item">
                        <div class="study-category-name">${sub.name}</div>
                    </a>
                `).join('');

                return `
                    <div class="study-category-section">
                        <h3 class="study-category-header">${category.name}</h3>
                        <div class="study-subcategories">
                            ${subcategoriesHTML}
                        </div>
                    </div>
                `;
            }).join('');

            container.innerHTML = sectionsHTML;
        } else {
            // Project 페이지는 기존 카드 형태로 렌더링
            const cardsHTML = categories.map(category => `
                <div class="project-card">
                    <div class="project-image">
                        <img src="../images/${category.slug}.jpg" alt="${category.name}" 
                             onerror="this.src='https://via.placeholder.com/300x200/${category.color.replace('#', '')}/ffffff?text=${encodeURIComponent(category.name)}'">
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${category.name}</h3>
                        <p class="project-description">${category.description}</p>
                        <div class="project-tags">
                            ${category.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');

            container.innerHTML = cardsHTML;
        }
    }

    // 드롭다운 메뉴를 업데이트하는 함수
    updateDropdownMenu(categories, dropdownSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        // Study 드롭다운인지 확인
        const isStudyDropdown = dropdownSelector === '#studyDropdownMenu';
        
        if (isStudyDropdown) {
            // Study 드롭다운: 상위 카테고리들을 가로로 나열하고 하위 카테고리들을 열별로 표시
            const mainCategoriesHTML = categories.map(category => 
                `<div class="dropdown-main-category">${category.name}</div>`
            ).join('');
            
            // 각 카테고리의 하위 카테고리들을 별도 컬럼으로 생성
            const subcategoriesColumnsHTML = categories.map(category => {
                const subcategories = this.getSubcategories(category.slug);
                const subcategoriesHTML = subcategories.map(sub => 
                    `<a href="/study/${category.slug}/${sub.slug}/" class="dropdown-item dropdown-subitem">${sub.name}</a>`
                ).join('');
                
                return `<div class="dropdown-subcategory-column">${subcategoriesHTML}</div>`;
            }).join('');
            
            dropdown.innerHTML = `
                <div class="dropdown-categories-container">
                    <div class="dropdown-main-categories">
                        ${mainCategoriesHTML}
                    </div>
                    <div class="dropdown-subcategories">
                        ${subcategoriesColumnsHTML}
                    </div>
                </div>
            `;
        } else {
            // Project 드롭다운: 기존 방식 유지
            const menuItemsHTML = categories.map(category => 
                `<a href="/${category.slug}/" class="dropdown-item">${category.name}</a>`
            ).join('');
            
            dropdown.innerHTML = menuItemsHTML;
        }
    }

    // 페이지 초기화
    async initializePage(categoryType, containerId, dropdownSelector) {
        const categories = await this.getCategories(categoryType);
        this.renderCategoryCards(categories, containerId);
        
        if (dropdownSelector) {
            this.updateDropdownMenu(categories, dropdownSelector);
        }
    }
}

// 전역 인스턴스 생성
window.categoryLoader = new CategoryLoader();
