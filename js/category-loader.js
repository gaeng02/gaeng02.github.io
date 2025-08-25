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
            // API 대신 JSON 파일을 직접 읽기
            const response = await fetch(`data/${categoryType}.json`);
            if (response.ok) {
                const data = await response.json();
                return data.categories || data;
            } else {
                // JSON 파일이 없을 경우 폴더 구조 기반으로 동적 생성
                return this.getDynamicCategories(categoryType);
            }
        } catch (error) {
            console.warn('JSON 파일 로드 실패, 동적 카테고리 생성:', error);
            return this.getDynamicCategories(categoryType);
        }
    }

    // 폴더 구조를 기반으로 동적으로 카테고리 생성
    async getDynamicCategories(categoryType) {
        if (categoryType === 'study') {
            return await this.getStudyCategoriesFromStructure();
        } else if (categoryType === 'projects') {
            return await this.getProjectCategoriesFromStructure();
        }
        return this.getDefaultCategories(categoryType);
    }

    // Study 폴더 구조를 기반으로 카테고리 생성 (계층적 구조)
    async getStudyCategoriesFromStructure() {
        try {
            // JSON 파일에서 카테고리 정보 읽어오기
            const response = await fetch('data/study-categories.json');
            if (response.ok) {
                const data = await response.json();
                console.log('Study 카테고리 로드됨:', data);
                return data.categories;
            }
        } catch (error) {
            console.warn('Study 카테고리 JSON 파일 로드 실패, 하드코딩된 구조 사용:', error);
        }

        // 폴백: 하드코딩된 구조 사용
        const categoryStructure = {
            'computer-science': {
                name: 'Computer Science',
                subcategories: {
                    'database': { name: 'Database' },
                    'operating-system': { name: 'Operating System' },
                    'algorithm': { name: 'Algorithm' },
                    'compiler': { name: 'Compiler' },
                    'network': { name: 'Network' },
                    'data-structure': { name: 'Data Structure' }
                }
            },
            'ai': {
                name: 'AI',
                subcategories: {
                    'machine-learning': { name: 'Machine Learning' },
                    'deep-learning': { name: 'Deep Learning' },
                    'computer-vision': { name: 'Computer Vision' },
                    'nlp': { name: 'NLP' },
                    'reinforcement-learning': { name: 'Reinforcement Learning' }
                }
            },
            'web-development': {
                name: 'Web Development',
                subcategories: {
                    'frontend': { name: 'Frontend' },
                    'backend': { name: 'Backend' },
                    'fullstack': { name: 'Fullstack' },
                    'devops': { name: 'DevOps' }
                }
            }
        };

        // 대분류 카테고리만 반환 (메인 페이지용)
        return Object.keys(categoryStructure).map(key => {
            const category = categoryStructure[key];
            return {
                name: category.name,
                slug: key,
                tags: [category.name],
                hasSubcategories: true
            };
        });
    }

    // 서브카테고리를 가져오는 함수 (동기 버전)
    getSubcategories(mainCategory) {
        // JSON 파일에서 카테고리 정보를 가져와서 서브카테고리 반환
        return new Promise(async (resolve) => {
            try {
                const response = await fetch('/data/study-categories.json');
                if (response.ok) {
                    const data = await response.json();
                    const category = data.categories.find(cat => cat.slug === mainCategory);
                    if (category && category.subcategories) {
                        const subcategories = category.subcategories.map(sub => ({
                            name: sub.name,
                            slug: sub.slug,
                            tags: [sub.name],
                            postCount: sub.postCount || 0
                        }));
                        resolve(subcategories);
                    } else {
                        resolve([]);
                    }
                } else {
                    resolve([]);
                }
            } catch (error) {
                console.warn('서브카테고리 로드 실패, 하드코딩된 구조 사용:', error);
                // 폴백: 하드코딩된 구조 사용
                const categoryStructure = {
                    'computer-science': [
                        { name: 'Database', slug: 'database', tags: ['Database'], postCount: 0 },
                        { name: 'Operating System', slug: 'operating-system', tags: ['Operating System'], postCount: 0 },
                        { name: 'Algorithm', slug: 'algorithm', tags: ['Algorithm'], postCount: 0 },
                        { name: 'Compiler', slug: 'compiler', tags: ['Compiler'], postCount: 0 },
                        { name: 'Network', slug: 'network', tags: ['Network'], postCount: 0 },
                        { name: 'Data Structure', slug: 'data-structure', tags: ['Data Structure'], postCount: 0 }
                    ],
                    'ai': [
                        { name: 'Machine Learning', slug: 'machine-learning', tags: ['Machine Learning'], postCount: 0 },
                        { name: 'Deep Learning', slug: 'deep-learning', tags: ['Deep Learning'], postCount: 0 },
                        { name: 'Computer Vision', slug: 'computer-vision', tags: ['Computer Vision'], postCount: 2 },
                        { name: 'NLP', slug: 'nlp', tags: ['NLP'], postCount: 0 },
                        { name: 'Reinforcement Learning', slug: 'reinforcement-learning', tags: ['Reinforcement Learning'], postCount: 0 }
                    ],
                    'web-development': [
                        { name: 'Frontend', slug: 'frontend', tags: ['Frontend'], postCount: 1 },
                        { name: 'Backend', slug: 'backend', tags: ['Backend'], postCount: 0 },
                        { name: 'Fullstack', slug: 'fullstack', tags: ['Fullstack'], postCount: 0 },
                        { name: 'DevOps', slug: 'devops', tags: ['DevOps'], postCount: 0 }
                    ]
                };
                resolve(categoryStructure[mainCategory] || []);
            }
        });
    }

    // Project 폴더 구조를 기반으로 카테고리 생성
    async getProjectCategoriesFromStructure() {
        try {
            // JSON 파일에서 프로젝트 카테고리 정보 읽어오기
            const response = await fetch('/data/project-categories.json');
            if (response.ok) {
                const data = await response.json();
                console.log('Project 카테고리 로드됨:', data);
                return data.categories;
            }
        } catch (error) {
            console.warn('Project 카테고리 JSON 파일 로드 실패, 하드코딩된 구조 사용:', error);
        }

        // 폴백: 하드코딩된 구조 사용
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

    // Study 카테고리를 비동기적으로 렌더링하는 함수
    async renderStudyCategoriesAsync(categories, container) {
        const sectionsHTML = await Promise.all(categories.map(async category => {
            const subcategories = await this.getSubcategories(category.slug);
            const subcategoriesHTML = subcategories.map(sub => `
                <a href="/study-dynamic.html?category=${category.slug}&subcategory=${sub.slug}" class="study-category-item">
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
        }));

        container.innerHTML = sectionsHTML.join('');
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

            // 모든 카테고리와 서브카테고리를 포함한 HTML 생성 (비동기 처리)
            this.renderStudyCategoriesAsync(categories, container);
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
    async updateDropdownMenu(categories, dropdownSelector) {
        const dropdown = document.querySelector(dropdownSelector);
        if (!dropdown) return;

        // Study 드롭다운인지 확인
        const isStudyDropdown = dropdownSelector === '#studyDropdownMenu';
        
        if (isStudyDropdown) {
            // Study 드롭다운: 상위 카테고리들을 가로로 나열하고 하위 카테고리들을 열별로 표시
            const mainCategoriesHTML = categories.map(category => 
                `<div class="dropdown-main-category">${category.name}</div>`
            ).join('');
            
            // 각 카테고리의 하위 카테고리들을 별도 컬럼으로 생성 (비동기 처리)
            const subcategoriesColumnsHTML = await Promise.all(categories.map(async category => {
                const subcategories = await this.getSubcategories(category.slug);
                const subcategoriesHTML = subcategories.map(sub => 
                    `<a href="/study-dynamic.html?category=${category.slug}&subcategory=${sub.slug}" class="dropdown-item dropdown-subitem">${sub.name}</a>`
                ).join('');
                
                return `<div class="dropdown-subcategory-column">${subcategoriesHTML}</div>`;
            }));
            
            dropdown.innerHTML = `
                <div class="dropdown-categories-container">
                    <div class="dropdown-main-categories">
                        ${mainCategoriesHTML}
                    </div>
                    <div class="dropdown-subcategories">
                        ${subcategoriesColumnsHTML.join('')}
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

    // 서브카테고리 파일들을 가져오는 함수 (동적 라우팅용)
    async getSubcategoryFiles(category, subcategory) {
        try {
            // API 대신 하드코딩된 파일 목록 사용 (현재는 API가 없으므로)
            return this.getHardcodedFiles(category, subcategory);
        } catch (error) {
            console.warn('파일 목록 로드 실패:', error);
            return [];
        }
    }

    // 하드코딩된 파일 목록 (API가 없을 때 사용)
    getHardcodedFiles(category, subcategory) {
        const fileMap = {
            'ai': {
                'computer-vision': [
                    { 
                        name: 'opencv-basics.md', 
                        title: 'OpenCV 기초 학습', 
                        date: '2024-01-15',
                        keywords: ['OpenCV', 'Computer Vision', 'Python', 'Image Processing']
                    },
                    { 
                        name: 'tensorflow-basics.md', 
                        title: 'TensorFlow 기초 학습', 
                        date: '2024-01-20',
                        keywords: ['TensorFlow', 'Deep Learning', 'Neural Networks', 'Python']
                    }
                ]
            },
            'web-development': {
                'frontend': [
                    { 
                        name: 'react-hooks-guide.md', 
                        title: 'React Hooks 완벽 가이드', 
                        date: '2024-02-01',
                        keywords: ['React', 'Hooks', 'JavaScript', 'Frontend']
                    }
                ]
            }
        };

        return fileMap[category]?.[subcategory] || [];
    }

    // 파일 카드들을 렌더링하는 함수
    renderFileCards(files, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (files.length === 0) {
            container.innerHTML = '<p class="loading">이 서브카테고리에 파일이 없습니다.</p>';
            return;
        }

        // URL에서 현재 카테고리와 서브카테고리 정보 추출
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        const subcategory = urlParams.get('subcategory');

        const cardsHTML = files.map(file => `
            <div class="project-card" onclick="window.location.href='/study-detail.html?category=${category}&subcategory=${subcategory}&file=${file.name}'" style="cursor: pointer;">
                <div class="project-header">
                    <h3 class="project-title">${file.title || file.name}</h3>
                    <div class="project-meta">${file.date || '작성일자 없음'}</div>
                </div>
                ${file.keywords ? `
                <div class="project-tags">
                    ${file.keywords.map(keyword => `<span class="project-tag">${keyword}</span>`).join('')}
                </div>
                ` : ''}
            </div>
        `).join('');

        container.innerHTML = cardsHTML;
    }

    // 페이지 초기화
    async initializePage(categoryType, containerId, dropdownSelector) {
        console.log('initializePage 호출:', categoryType, containerId, dropdownSelector);
        
        const categories = await this.getCategories(categoryType);
        console.log('로드된 카테고리:', categories);
        
        if (containerId) {
            this.renderCategoryCards(categories, containerId);
        }
        
        if (dropdownSelector) {
            await this.updateDropdownMenu(categories, dropdownSelector);
        }
    }
}

// 전역 인스턴스 생성
window.categoryLoader = new CategoryLoader();
