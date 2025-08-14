// Theme management for Gaeng02's Blog

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || this.getPreferredTheme();
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
    }

    getPreferredTheme() {
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
        this.updateMetaThemeColor();
    }

    updateThemeIcon() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const sunIcon = themeToggle.querySelector('.sun-icon');
        const moonIcon = themeToggle.querySelector('.moon-icon');

        if (this.currentTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }

        const colors = {
            light: '#ffffff',
            dark: '#0f172a'
        };

        metaThemeColor.content = colors[this.currentTheme] || colors.light;
    }

    setupEventListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.currentTheme = e.matches ? 'dark' : 'light';
                    this.applyTheme();
                }
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: this.currentTheme }
        }));
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    setTheme(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.currentTheme = theme;
            localStorage.setItem('theme', theme);
            this.applyTheme();
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} 