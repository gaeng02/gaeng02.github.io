const fs = require('fs');
const path = require('path');

// 카테고리 정보를 가져오는 함수
function getCategories(categoryType) {
    const basePath = path.join(__dirname, '..', 'content', categoryType);
    
    try {
        if (!fs.existsSync(basePath)) {
            return [];
        }

        const folders = fs.readdirSync(basePath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        if (categoryType === 'study') {
            return getStudyCategories(folders);
        } else if (categoryType === 'projects') {
            return getProjectCategories(folders);
        }

        return folders.map(folder => ({
            name: folder.charAt(0).toUpperCase() + folder.slice(1),
            slug: folder
        }));
    } catch (error) {
        console.error(`Error reading ${categoryType} categories:`, error);
        return [];
    }
}

// Study 카테고리 정보 생성
function getStudyCategories(folders) {
    const iconMap = {
        'frontend': '🎨',
        'backend': '⚙️',
        'database': '🗄️',
        'devops': '🔧',
        'algorithm': '⚡',
        'compiler': '🔍'
    };

    const nameMap = {
        'frontend': 'Frontend',
        'backend': 'Backend',
        'database': 'Database',
        'devops': 'DevOps',
        'algorithm': 'Algorithm',
        'compiler': 'Compiler'
    };

    const descriptionMap = {
        'frontend': 'HTML, CSS, JavaScript, React, Vue 등 프론트엔드 기술 학습',
        'backend': 'Node.js, Python, Java 등 백엔드 개발 기술 학습',
        'database': 'MySQL, PostgreSQL, MongoDB 등 데이터베이스 학습',
        'devops': 'Docker, Kubernetes, CI/CD 등 DevOps 도구 학습',
        'algorithm': '자료구조, 알고리즘, 문제 해결 능력 향상',
        'compiler': '컴파일러 이론과 실제 구현 방법 학습'
    };

    return folders.map(folder => ({
        name: nameMap[folder] || folder.charAt(0).toUpperCase() + folder.slice(1),
        slug: folder,
        icon: iconMap[folder] || '📚',
        description: descriptionMap[folder] || `${nameMap[folder] || folder} 관련 학습 자료`,
        tags: [nameMap[folder] || folder]
    }));
}

// Project 카테고리 정보 생성
function getProjectCategories(folders) {
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

    return folders.map(folder => ({
        name: nameMap[folder] || folder.charAt(0).toUpperCase() + folder.slice(1),
        slug: folder,
        description: descriptionMap[folder] || `${folder} 관련 프로젝트`,
        color: colorMap[folder] || '#64748b',
        tags: [nameMap[folder] || folder]
    }));
}

// Express 서버 설정 (선택사항)
if (typeof require !== 'undefined' && require.main === module) {
    const express = require('express');
    const app = express();
    const port = 3001;

    app.use(express.json());
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });

    app.get('/api/categories/:type', (req, res) => {
        const categoryType = req.params.type;
        const categories = getCategories(categoryType);
        res.json(categories);
    });

    app.listen(port, () => {
        console.log(`Category server running at http://localhost:${port}`);
    });
}

module.exports = { getCategories };
