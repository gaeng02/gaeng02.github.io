const fs = require('fs')
const path = require('path')

const contentDirectory = path.join(process.cwd(), 'content')
const baseUrl = 'https://gaeng02.github.io'

// 모든 MD 파일 읽기
function getAllMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList)
    } else if (file.endsWith('.md')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// 날짜 prefix 제거하여 slug 생성
function getSlugFromFilename(filename) {
  const datePattern = /^\d{4}-\d{2}-\d{2}-/
  return filename.replace(/\.md$/, '').replace(datePattern, '')
}

// 카테고리별 포스트 가져오기
function getPostsByCategory(category) {
  const categoryDirMap = {
    book: path.join(contentDirectory, 'book-reviews'),
    paper: path.join(contentDirectory, 'paper-reviews'),
    'try-tech': path.join(contentDirectory, 'try-tech'),
    memoir: path.join(contentDirectory, 'memoir'),
  }
  
  const categoryDir = categoryDirMap[category]
  
  if (!fs.existsSync(categoryDir)) {
    return []
  }
  
  const files = getAllMarkdownFiles(categoryDir)
  const posts = []
  
  files.forEach((file) => {
    try {
      const filename = path.basename(file)
      const slug = getSlugFromFilename(filename)
      const content = fs.readFileSync(file, 'utf8')
      const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
      
      if (frontMatterMatch) {
        const frontMatter = frontMatterMatch[1]
        const dateMatch = frontMatter.match(/date:\s*"([^"]+)"/)
        
        if (dateMatch) {
          posts.push({
            category,
            slug,
            date: dateMatch[1],
          })
        }
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error)
    }
  })
  
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 모든 포스트 가져오기
function getAllPosts() {
  const categories = ['book', 'paper', 'try-tech', 'memoir']
  const allPosts = []
  
  categories.forEach((category) => {
    const posts = getPostsByCategory(category)
    allPosts.push(...posts)
  })
  
  return allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// 사이트맵 생성
function generateSitemap() {
  const posts = getAllPosts()
  
  const postUrls = posts.map((post) => {
    const lastMod = new Date(post.date).toISOString()
    return `  <url>
    <loc>${baseUrl}/${post.category}/${post.slug}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${postUrls}
</urlset>`

  const outputPath = path.join(process.cwd(), 'out', 'sitemap-posts.xml')
  fs.writeFileSync(outputPath, sitemap, 'utf8')
  console.log(`✅ sitemap-posts.xml generated with ${posts.length} posts`)
}

generateSitemap()
