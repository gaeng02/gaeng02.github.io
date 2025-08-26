// Main JavaScript for Gaeng02's Blog

// Global variables
let currentTheme = localStorage.getItem('theme') || 'light';
let searchData = [];

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    initializeSearch();
    loadFeaturedContent();
    updateStats();
    initializeNavigation();
});

// Theme management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    
    if (searchInput && searchClose) {
        searchClose.addEventListener('click', () => {
            searchInput.value = '';
            searchInput.focus();
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
            } else if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    // Google에서 "gaeng02 {검색어}"로 검색
                    const googleSearchUrl = `https://www.google.com/search?q=gaeng02+${encodeURIComponent(query)}`;
                    window.open(googleSearchUrl, '_blank');
                }
            }
        });

        searchInput.addEventListener('input', handleSearch);
    }
    
    // Load search data
    loadSearchData();
}

async function loadSearchData() {
    try {
        const [projectsResponse, postsResponse, studyResponse] = await Promise.all([
            fetch('/data/projects.json').catch(() => ({ json: () => [] })),
            fetch('/data/posts.json').catch(() => ({ json: () => [] })),
            fetch('/data/study.json').catch(() => ({ json: () => [] }))
        ]);
        
        const projectsData = await projectsResponse.json();
        const postsData = await postsResponse.json();
        const studyData = await studyResponse.json();
        
        searchData = [
            ...(projectsData.projects || []).map(item => ({ ...item, type: 'project' })),
            ...(postsData.posts || []).map(item => ({ ...item, type: 'post' })),
            ...(studyData.study || []).map(item => ({ ...item, type: 'study' }))
        ];
    } catch (error) {
        console.error('Failed to load search data:', error);
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!query.trim()) {
        resultsContainer.innerHTML = '<div class="search-placeholder">검색어를 입력하세요...</div>';
        return;
    }
    
    const results = searchData.filter(item => 
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
    ).slice(0, 10);
    
    displaySearchResults(results, resultsContainer);
}

function displaySearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>';
        return;
    }
    
    const resultsHTML = results.map(item => `
        <div class="search-result-item">
            <div class="search-result-header">
                <h4 class="search-result-title">
                    <a href="${getItemUrl(item)}">${item.title}</a>
                </h4>
                <span class="search-result-type">${getTypeLabel(item.type)}</span>
            </div>
            <p class="search-result-description">${item.description || ''}</p>
            ${item.tags ? `<div class="search-result-tags">${item.tags.map(tag => `<span class="tag tag-sm">${tag}</span>`).join('')}</div>` : ''}
        </div>
    `).join('');
    
    container.innerHTML = resultsHTML;
}

function getItemUrl(item) {
    switch (item.type) {
        case 'project': return `/projects/${item.slug}/`;
        case 'post': return `/posts/${item.slug}/`;
        case 'study': return `/study/${item.category}/${item.slug}/`;
        default: return '#';
    }
}

function getTypeLabel(type) {
    const labels = {
        project: '프로젝트',
        post: '포스트',
        study: '스터디'
    };
    return labels[type] || type;
}

// Load featured content
async function loadFeaturedContent() {
    try {
        await Promise.all([
            loadRecentProjects(),
            loadRecentPosts(),
            loadStudyCategories()
        ]);
    } catch (error) {
        console.error('Failed to load featured content:', error);
    }
}

async function loadRecentProjects() {
    const container = document.getElementById('recentProjects');
    if (!container) return;
    
    try {
        const response = await fetch('/data/projects.json');
        const projectsData = await response.json();
        const recentProjects = (projectsData.projects || []).slice(0, 3);
        
        if (recentProjects.length === 0) {
            container.innerHTML = '<div class="no-content">아직 프로젝트가 없습니다.</div>';
            return;
        }
        
        const projectsHTML = recentProjects.map(project => `
            <div class="featured-item">
                <h4 class="featured-item-title">
                    <a href="/projects/${project.slug}/">${project.title}</a>
                </h4>
                <p class="featured-item-description">${project.description}</p>
                <div class="featured-item-meta">
                    <span class="featured-item-date">${formatDate(project.date)}</span>
                    ${project.tags ? `<div class="featured-item-tags">${project.tags.slice(0, 2).map(tag => `<span class="tag tag-sm">${tag}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = projectsHTML;
    } catch (error) {
        container.innerHTML = '<div class="error">프로젝트를 불러오는데 실패했습니다.</div>';
    }
}

async function loadRecentPosts() {
    const container = document.getElementById('recentPosts');
    if (!container) return;
    
    try {
        const response = await fetch('/data/posts.json');
        const posts = await response.json();
        const recentPosts = posts.slice(0, 3);
        
        if (recentPosts.length === 0) {
            container.innerHTML = '<div class="no-content">아직 포스트가 없습니다.</div>';
            return;
        }
        
        const postsHTML = recentPosts.map(post => `
            <div class="featured-item">
                <h4 class="featured-item-title">
                    <a href="/posts/${post.slug}/">${post.title}</a>
                </h4>
                <p class="featured-item-description">${post.excerpt || post.description}</p>
                <div class="featured-item-meta">
                    <span class="featured-item-date">${formatDate(post.date)}</span>
                    ${post.tags ? `<div class="featured-item-tags">${post.tags.slice(0, 2).map(tag => `<span class="tag tag-sm">${tag}</span>`).join('')}</div>` : ''}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = postsHTML;
    } catch (error) {
        container.innerHTML = '<div class="error">포스트를 불러오는데 실패했습니다.</div>';
    }
}

async function loadStudyCategories() {
    const container = document.getElementById('studyCategories');
    if (!container) return;
    
    try {
        const response = await fetch('/data/study.json');
        const studyData = await response.json();
        const categories = Object.keys(studyData).slice(0, 3);
        
        if (categories.length === 0) {
            container.innerHTML = '<div class="no-content">아직 스터디 카테고리가 없습니다.</div>';
            return;
        }
        
        const categoriesHTML = categories.map(category => {
            const categoryData = studyData[category];
            return `
                <div class="featured-item">
                    <h4 class="featured-item-title">
                        <a href="/study/${category}/">${categoryData.title || category}</a>
                    </h4>
                    <p class="featured-item-description">${categoryData.description || ''}</p>
                    <div class="featured-item-meta">
                        <span class="featured-item-count">${categoryData.posts?.length || 0}개 포스트</span>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = categoriesHTML;
    } catch (error) {
        container.innerHTML = '<div class="error">스터디 카테고리를 불러오는데 실패했습니다.</div>';
    }
}

// Update statistics
async function updateStats() {
    try {
        const [projectsResponse, postsResponse, studyResponse] = await Promise.all([
            fetch('/data/projects.json').catch(() => ({ json: () => [] })),
            fetch('/data/posts.json').catch(() => ({ json: () => [] })),
            fetch('/data/study.json').catch(() => ({ json: () => ({}) }))
        ]);
        
        const projectsData = await projectsResponse.json();
        const postsData = await postsResponse.json();
        const studyData = await studyResponse.json();
        
        const projectCount = (projectsData.projects || []).length;
        const postCount = (postsData.posts || []).length;
        const studyCount = (studyData.categories || []).length;
        
        // Count unique tags
        const allTags = new Set();
        
        // Process project tags
        (projectsData.projects || []).forEach(project => {
            if (project.tags) {
                try {
                    const tags = Array.isArray(project.tags) ? project.tags : JSON.parse(project.tags);
                    tags.forEach(tag => allTags.add(tag));
                } catch (e) {
                    // If JSON parsing fails, treat as comma-separated string
                    if (typeof project.tags === 'string') {
                        project.tags.split(',').forEach(tag => allTags.add(tag.trim()));
                    }
                }
            }
        });
        
        // Process post tags and count retrospect posts
        let retrospectCount = 0;
        (postsData.posts || []).forEach(post => {
            if (post.tags) {
                try {
                    const tags = Array.isArray(post.tags) ? post.tags : JSON.parse(post.tags);
                    tags.forEach(tag => allTags.add(tag));
                    
                    // Count posts with "회고" tag
                    if (tags.includes('회고')) {
                        retrospectCount++;
                    }
                } catch (e) {
                    // If JSON parsing fails, treat as comma-separated string
                    if (typeof post.tags === 'string') {
                        post.tags.split(',').forEach(tag => allTags.add(tag.trim()));
                        
                        // Count posts with "회고" tag
                        if (post.tags.includes('회고')) {
                            retrospectCount++;
                        }
                    }
                }
            }
        });
        
        const tagCount = allTags.size;
        
        // Update DOM
        updateStatElement('projectCount', projectCount);
        updateStatElement('postCount', postCount);
        updateStatElement('studyCount', studyCount);
        updateStatElement('retrospectCount', retrospectCount);
        
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}

function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        // Animate the number
        animateNumber(element, 0, value, 1000);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const difference = end - start;
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (difference * progress));
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath || 
            (currentPath === '/' && link.getAttribute('href') === '/')) {
            link.classList.add('active');
        }
    });
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return '오늘';
    } else if (diffDays <= 7) {
        return `${diffDays}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

// Page focus/blur effects
window.addEventListener('blur', function() {
    document.title = "Gaeng02's Blog - Waiting...";
});

window.addEventListener('focus', function() {
    document.title = "Gaeng02's Blog";
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.featured-card, .stat-item, .floating-card');
    animatedElements.forEach(el => observer.observe(el));
});
