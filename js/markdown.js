// Markdown processing for Gaeng02's Blog

class MarkdownProcessor {
    constructor() {
        this.markdownIt = null;
        this.init();
    }

    async init() {
        // Load marked.js for markdown parsing
        await this.loadMarkedJS();
        this.setupMarked();
    }

    async loadMarkedJS() {
        if (typeof marked === 'undefined') {
            // Load marked.js from CDN if not already loaded
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
            script.onload = () => this.setupMarked();
            document.head.appendChild(script);
        } else {
            this.setupMarked();
        }
    }

    setupMarked() {
        if (typeof marked === 'undefined') return;

        // Configure marked.js
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });

        // Custom renderer for better styling
        const renderer = new marked.Renderer();
        
        // Custom heading renderer
        renderer.heading = (text, level) => {
            const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
            return `<h${level} id="${escapedText}" class="markdown-heading">${text}</h${level}>`;
        };

        // Custom code block renderer
        renderer.code = (code, language) => {
            if (typeof hljs !== 'undefined' && hljs.getLanguage) {
                const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
                const highlighted = hljs.highlight(code, { language: validLanguage }).value;
                return `<pre class="hljs"><code class="language-${validLanguage}">${highlighted}</code></pre>`;
            } else {
                // Fallback when highlight.js is not available
                const validLanguage = language || 'plaintext';
                return `<pre><code class="language-${validLanguage}">${code}</code></pre>`;
            }
        };

        // Custom link renderer
        renderer.link = (href, title, text) => {
            const isExternal = href.startsWith('http');
            const target = isExternal ? ' target="_blank" rel="noopener"' : '';
            return `<a href="${href}"${target} class="markdown-link">${text}</a>`;
        };

        marked.use({ renderer });
    }

    // Parse front matter from markdown content
    parseFrontMatter(content) {
        const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontMatterRegex);
        
        if (match) {
            const frontMatter = match[1];
            const markdownContent = match[2];
            
            try {
                const metadata = this.parseYAML(frontMatter);
                return { metadata, content: markdownContent };
            } catch (error) {
                console.error('Error parsing front matter:', error);
                return { metadata: {}, content };
            }
        }
        
        return { metadata: {}, content };
    }

    // Simple YAML parser for front matter
    parseYAML(yaml) {
        const metadata = {};
        const lines = yaml.split('\n');
        
        lines.forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                
                // Remove quotes if present
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Handle arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(item => item.trim());
                }
                
                metadata[key] = value;
            }
        });
        
        return metadata;
    }

    // Convert markdown to HTML
    markdownToHTML(markdown) {
        if (typeof marked === 'undefined') {
            return markdown; // Fallback if marked.js is not loaded
        }
        
        return marked.parse(markdown);
    }

    // Process a markdown file
    async processMarkdownFile(filePath) {
        try {
            const response = await fetch(filePath);
            const markdownContent = await response.text();
            
            const { metadata, content } = this.parseFrontMatter(markdownContent);
            const htmlContent = this.markdownToHTML(content);
            
            return {
                ...metadata,
                content: htmlContent,
                rawContent: content
            };
        } catch (error) {
            console.error('Error processing markdown file:', error);
            return null;
        }
    }

    // Generate table of contents from markdown content
    generateTOC(htmlContent) {
        const headings = htmlContent.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/g);
        if (!headings) return [];

        return headings.map(heading => {
            const level = parseInt(heading.match(/<h([1-6])/)[1]);
            const text = heading.replace(/<[^>]*>/g, '');
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            
            return { level, text, id };
        });
    }

    // Extract excerpt from markdown content
    extractExcerpt(content, maxLength = 200) {
        // Remove HTML tags and get plain text
        const plainText = content.replace(/<[^>]*>/g, '');
        
        if (plainText.length <= maxLength) {
            return plainText;
        }
        
        // Find the last complete sentence within the limit
        const truncated = plainText.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');
        
        if (lastSentence > maxLength * 0.7) {
            return truncated.substring(0, lastSentence + 1);
        }
        
        return truncated + '...';
    }
}

// Post loader for managing markdown posts
class PostLoader {
    constructor() {
        this.processor = new MarkdownProcessor();
        this.posts = new Map();
        this.projects = new Map();
        this.studyPosts = new Map();
    }

    // Load all posts from markdown files
    async loadAllPosts() {
        await Promise.all([
            this.loadPosts(),
            this.loadProjects(),
            this.loadStudyPosts()
        ]);
    }

    // Load regular posts
    async loadPosts() {
        try {
            // 실제 content/post 디렉토리에서 파일들을 스캔
            const postFiles = [
                '/content/post/sample.md'
            ];

            for (const filePath of postFiles) {
                const post = await this.processor.processMarkdownFile(filePath);
                if (post) {
                    this.posts.set(post.slug, post);
                }
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        }
    }

    // Load project posts
    async loadProjects() {
        try {
            const projectFiles = [
                '/content/project/portfolio-website.md',
                '/content/project/click-clean.md',
                '/content/project/escape-room-app.md',
                '/content/project/deepfake-detection.md'
            ];

            for (const filePath of projectFiles) {
                const project = await this.processor.processMarkdownFile(filePath);
                if (project) {
                    this.projects.set(project.slug, project);
                }
            }
        } catch (error) {
            console.error('Error loading projects:', error);
        }
    }

    // Load study posts
    async loadStudyPosts() {
        try {
            const studyFiles = [
                '/content/study/ai/computer-vision/sample.md'
            ];

            for (const filePath of studyFiles) {
                const studyPost = await this.processor.processMarkdownFile(filePath);
                if (studyPost) {
                    this.studyPosts.set(studyPost.slug, studyPost);
                }
            }
        } catch (error) {
            console.error('Error loading study posts:', error);
        }
    }

    // Get a specific post
    getPost(slug) {
        return this.posts.get(slug);
    }

    // Get a specific project
    getProject(slug) {
        return this.projects.get(slug);
    }

    // Get a specific study post
    getStudyPost(slug) {
        return this.studyPosts.get(slug);
    }

    // Get all posts
    getAllPosts() {
        return Array.from(this.posts.values());
    }

    // Get all projects
    getAllProjects() {
        return Array.from(this.projects.values());
    }

    // Get all study posts
    getAllStudyPosts() {
        return Array.from(this.studyPosts.values());
    }

    // Search posts
    searchPosts(query) {
        const allPosts = [
            ...this.getAllPosts().map(p => ({ ...p, type: 'post' })),
            ...this.getAllProjects().map(p => ({ ...p, type: 'project' })),
            ...this.getAllStudyPosts().map(p => ({ ...p, type: 'study' }))
        ];

        return allPosts.filter(post => 
            post.title?.toLowerCase().includes(query.toLowerCase()) ||
            post.content?.toLowerCase().includes(query.toLowerCase()) ||
            post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }
}

// Initialize markdown processor and post loader
let markdownProcessor, postLoader;

document.addEventListener('DOMContentLoaded', async () => {
    markdownProcessor = new MarkdownProcessor();
    postLoader = new PostLoader();
    
    // Load all posts
    await postLoader.loadAllPosts();
    
    // Make them available globally
    window.markdownProcessor = markdownProcessor;
    window.postLoader = postLoader;
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MarkdownProcessor, PostLoader };
} 

// 간단한 마크다운 렌더러
window.markdownRenderer = {
    render: function(markdown) {
        let html = markdown;
        
        // 제목 처리
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // 강조 처리
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/`(.*?)`/g, '<code>$1</code>');
        
        // 링크 처리
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
        
        // 코드 블록 처리
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
            return `<pre><code class="${lang || ''}">${code.trim()}</code></pre>`;
        });
        
        // 인라인 코드 처리
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // 목록 처리 - 순서가 있는 목록
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
        
        // 목록 처리 - 순서가 없는 목록
        html = html.replace(/^[\*\-] (.*$)/gim, '<li>$1</li>');
        
        // 목록 그룹화 - 연속된 li 태그들을 ul로 감싸기
        html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/gs, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        // 단락 처리 - 제목, 목록, 코드 블록이 아닌 연속된 텍스트를 p 태그로 감싸기
        html = html.replace(/^(?!<[hou][1-6l]|<\/?[uo]l|<\/?li|<\/?pre|<\/?code)(.+)$/gm, '<p>$1</p>');
        
        // 빈 단락 제거
        html = html.replace(/<p><\/p>/g, '');
        
        // 줄바꿈 처리
        html = html.replace(/\n/g, '<br>');
        
        return html;
    }
}; 