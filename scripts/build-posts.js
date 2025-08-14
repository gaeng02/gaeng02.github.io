#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// 마크다운 파일들을 JSON으로 변환하는 스크립트
class PostBuilder {
    constructor() {
        this.contentDir = path.join(__dirname, '../content');
        this.dataDir = path.join(__dirname, '../data');
    }

    async buildAll() {
        console.log('🚀 마크다운 파일들을 처리하는 중...');
        
        try {
            await Promise.all([
                this.buildPosts(),
                this.buildProjects(),
                this.buildStudy()
            ]);
            
            console.log('✅ 모든 파일이 성공적으로 처리되었습니다!');
        } catch (error) {
            console.error('❌ 빌드 중 오류가 발생했습니다:', error);
        }
    }

    async buildPosts() {
        const postsDir = path.join(this.contentDir, 'posts');
        const posts = await this.processDirectory(postsDir, 'post');
        
        await this.writeJsonFile('posts.json', posts);
        console.log(`📝 ${posts.length}개의 포스트가 처리되었습니다.`);
    }

    async buildProjects() {
        const projectsDir = path.join(this.contentDir, 'projects');
        const projects = await this.processDirectory(projectsDir, 'project');
        
        await this.writeJsonFile('projects.json', projects);
        console.log(`💻 ${projects.length}개의 프로젝트가 처리되었습니다.`);
    }

    async buildStudy() {
        const studyDir = path.join(this.contentDir, 'study');
        const studyData = {};
        
        if (fs.existsSync(studyDir)) {
            const categories = fs.readdirSync(studyDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);

            for (const category of categories) {
                const categoryDir = path.join(studyDir, category);
                const posts = await this.processDirectory(categoryDir, 'study');
                
                studyData[category] = {
                    title: this.formatCategoryTitle(category),
                    description: `${category} 관련 스터디 포스트들`,
                    posts: posts
                };
            }
        }
        
        await this.writeJsonFile('study.json', studyData);
        console.log(`📚 ${Object.keys(studyData).length}개의 스터디 카테고리가 처리되었습니다.`);
    }

    async processDirectory(dir, type) {
        if (!fs.existsSync(dir)) {
            return [];
        }

        const files = fs.readdirSync(dir)
            .filter(file => file.endsWith('.md'))
            .sort((a, b) => {
                // 날짜순으로 정렬 (최신순)
                const aPath = path.join(dir, a);
                const bPath = path.join(dir, b);
                const aStats = fs.statSync(aPath);
                const bStats = fs.statSync(bPath);
                return bStats.mtime.getTime() - aStats.mtime.getTime();
            });

        const items = [];

        for (const file of files) {
            const filePath = path.join(dir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            try {
                const { data: frontMatter, content: markdownContent } = matter(content);
                
                // 필수 필드 검증
                if (!frontMatter.title || !frontMatter.slug) {
                    console.warn(`⚠️  ${file}: title 또는 slug가 누락되었습니다.`);
                    continue;
                }

                const item = {
                    ...frontMatter,
                    type: type,
                    content: markdownContent,
                    excerpt: this.generateExcerpt(markdownContent),
                    readingTime: this.calculateReadingTime(markdownContent),
                    lastModified: fs.statSync(filePath).mtime.toISOString()
                };

                items.push(item);
            } catch (error) {
                console.error(`❌ ${file} 처리 중 오류:`, error.message);
            }
        }

        return items;
    }

    generateExcerpt(content, maxLength = 200) {
        // HTML 태그 제거
        const plainText = content.replace(/<[^>]*>/g, '');
        
        if (plainText.length <= maxLength) {
            return plainText;
        }
        
        const truncated = plainText.substring(0, maxLength);
        const lastSentence = truncated.lastIndexOf('.');
        
        if (lastSentence > maxLength * 0.7) {
            return truncated.substring(0, lastSentence + 1);
        }
        
        return truncated + '...';
    }

    calculateReadingTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / wordsPerMinute);
        return readingTime;
    }

    formatCategoryTitle(category) {
        return category
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    async writeJsonFile(filename, data) {
        const filePath = path.join(this.dataDir, filename);
        
        // 디렉토리가 없으면 생성
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    }

    // 태그 통계 생성
    generateTagStats() {
        const posts = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'posts.json'), 'utf8'));
        const projects = JSON.parse(fs.readFileSync(path.join(this.dataDir, 'projects.json'), 'utf8'));
        
        const allItems = [...posts, ...projects];
        const tagStats = {};
        
        allItems.forEach(item => {
            if (item.tags) {
                item.tags.forEach(tag => {
                    tagStats[tag] = (tagStats[tag] || 0) + 1;
                });
            }
        });
        
        return tagStats;
    }
}

// 스크립트 실행
if (require.main === module) {
    const builder = new PostBuilder();
    builder.buildAll();
}

module.exports = PostBuilder; 