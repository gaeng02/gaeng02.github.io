// Search functionality for Gaeng02's Blog

class SearchManager {
    constructor() {
        this.searchData = [];
        this.searchIndex = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        await this.loadSearchData();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    async loadSearchData() {
        try {
            const [projectsResponse, postsResponse, studyResponse] = await Promise.all([
                fetch('data/projects.json').catch(() => ({ json: () => [] })),
                fetch('data/posts.json').catch(() => ({ json: () => [] })),
                fetch('data/study.json').catch(() => ({ json: () => ({}) }))
            ]);
            
            const projectsData = await projectsResponse.json();
            const postsData = await postsResponse.json();
            const studyData = await studyResponse.json();
            
            // Flatten study data
            const studyPosts = [];
            if (studyData.categories) {
                studyData.categories.forEach(category => {
                    if (category.posts) {
                        category.posts.forEach(post => {
                            studyPosts.push({
                                ...post,
                                type: 'study',
                                category: category.slug,
                                categoryTitle: category.name
                            });
                        });
                    }
                });
            }
            
            this.searchData = [
                ...(projectsData.projects || []).map(item => ({ ...item, type: 'project' })),
                ...(postsData.posts || []).map(item => ({ ...item, type: 'post' })),
                ...studyPosts
            ];
            
            this.buildSearchIndex();
        } catch (error) {
            console.error('Failed to load search data:', error);
        }
    }

    buildSearchIndex() {
        // Simple search index - in a real app, you might want to use a proper search library
        this.searchIndex = this.searchData.map(item => ({
            ...item,
            searchText: this.getSearchableText(item)
        }));
    }

    getSearchableText(item) {
        const text = [
            item.title || '',
            item.description || '',
            item.excerpt || '',
            item.content || '',
            (item.tags || []).join(' '),
            item.category || '',
            item.categoryTitle || ''
        ].join(' ').toLowerCase();
        
        return text;
    }

    setupEventListeners() {
        const searchToggle = document.getElementById('searchToggle');
        const searchOverlay = document.getElementById('searchOverlay');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');
        
        if (searchToggle) {
            searchToggle.addEventListener('click', () => this.openSearch());
        }
        
        if (searchClose) {
            searchClose.addEventListener('click', () => this.closeSearch());
        }
        
        if (searchOverlay) {
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay) {
                    this.closeSearch();
                }
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e));
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeSearch();
                }
            });
        }

        // Keyboard shortcut for search (Ctrl/Cmd + K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearch();
            }
        });
    }

    openSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (searchOverlay && searchInput) {
            searchOverlay.classList.add('active');
            searchInput.focus();
            searchInput.select();
        }
    }

    closeSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        const searchInput = document.getElementById('searchInput');
        
        if (searchOverlay && searchInput) {
            searchOverlay.classList.remove('active');
            searchInput.value = '';
            this.clearSearchResults();
        }
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        const resultsContainer = document.getElementById('searchResults');
        
        if (!resultsContainer) return;
        
        if (!query) {
            this.showSearchPlaceholder(resultsContainer);
            return;
        }
        
        const results = this.search(query);
        this.displaySearchResults(results, resultsContainer);
    }

    search(query) {
        if (!this.searchIndex) return [];
        
        const searchTerms = query.split(' ').filter(term => term.length > 0);
        
        return this.searchIndex
            .map(item => {
                const score = this.calculateSearchScore(item, searchTerms);
                return { ...item, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    calculateSearchScore(item, searchTerms) {
        let score = 0;
        const searchText = item.searchText;
        
        searchTerms.forEach(term => {
            // Exact matches get higher scores
            if (searchText.includes(term)) {
                score += 10;
                
                // Title matches get bonus points
                if (item.title && item.title.toLowerCase().includes(term)) {
                    score += 5;
                }
                
                // Tag matches get bonus points
                if (item.tags && item.tags.some(tag => tag.toLowerCase().includes(term))) {
                    score += 3;
                }
            }
            
            // Partial matches
            if (searchText.includes(term.substring(0, Math.min(term.length, 3)))) {
                score += 2;
            }
        });
        
        return score;
    }

    showSearchPlaceholder(container) {
        container.innerHTML = `
            <div class="search-placeholder">
                <div class="search-placeholder-icon">🔍</div>
                <p>검색어를 입력하세요...</p>
                <div class="search-shortcuts">
                    <span class="search-shortcut">Ctrl+K</span>로 빠른 검색
                </div>
            </div>
        `;
    }

    displaySearchResults(results, container) {
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-no-results">
                    <div class="search-no-results-icon">😕</div>
                    <p>검색 결과가 없습니다.</p>
                    <p class="search-no-results-suggestion">다른 키워드로 검색해보세요.</p>
                </div>
            `;
            return;
        }
        
        const resultsHTML = results.map(item => this.createSearchResultHTML(item)).join('');
        container.innerHTML = resultsHTML;
    }

    createSearchResultHTML(item) {
        const typeLabel = this.getTypeLabel(item.type);
        const url = this.getItemUrl(item);
        
        return `
            <div class="search-result-item" data-url="${url}">
                <div class="search-result-header">
                    <div class="search-result-type">
                        <span class="search-result-type-label">${typeLabel}</span>
                    </div>
                    <h4 class="search-result-title">
                        <a href="${url}">${this.highlightSearchTerms(item.title)}</a>
                    </h4>
                </div>
                <p class="search-result-description">
                    ${this.highlightSearchTerms(item.description || item.excerpt || '')}
                </p>
                ${item.tags ? `
                    <div class="search-result-tags">
                        ${item.tags.slice(0, 3).map(tag => 
                            `<span class="tag tag-sm">${tag}</span>`
                        ).join('')}
                        ${item.tags.length > 3 ? `<span class="tag tag-sm">+${item.tags.length - 3}</span>` : ''}
                    </div>
                ` : ''}
                <div class="search-result-meta">
                    <span class="search-result-date">${this.formatDate(item.date)}</span>
                    ${item.categoryTitle ? `<span class="search-result-category">${item.categoryTitle}</span>` : ''}
                </div>
            </div>
        `;
    }

    highlightSearchTerms(text) {
        if (!text) return '';
        
        const searchInput = document.getElementById('searchInput');
        if (!searchInput || !searchInput.value) return text;
        
        const query = searchInput.value.toLowerCase();
        const regex = new RegExp(`(${query})`, 'gi');
        
        return text.replace(regex, '<mark>$1</mark>');
    }

    getTypeLabel(type) {
        const labels = {
            project: '프로젝트',
            post: '포스트',
            study: '스터디'
        };
        return labels[type] || type;
    }



    getItemUrl(item) {
        switch (item.type) {
            case 'project': return `/projects/${item.slug}/`;
            case 'post': return `/posts/${item.slug}/`;
            case 'study': return `/study/${item.category}/${item.slug}/`;
            default: return '#';
        }
    }

    formatDate(dateString) {
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

    clearSearchResults() {
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    isSearchOpen() {
        const searchOverlay = document.getElementById('searchOverlay');
        return searchOverlay && searchOverlay.classList.contains('active');
    }
}

// Initialize search manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchManager = new SearchManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SearchManager;
} 