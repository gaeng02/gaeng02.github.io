const fs = require('fs')
const path = require('path')

const contentDirectory = path.join(process.cwd(), 'content')
const configPath = path.join(contentDirectory, 'series.config.json')
const outputPath = path.join(contentDirectory, 'series.json')

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

function getSlugFromFilename(filename) {
  const datePattern = /^\d{4}-\d{2}-\d{2}-/
  return filename.replace(/\.md$/, '').replace(datePattern, '')
}

function getAllPosts() {
  const categoryDirMap = {
    book: path.join(contentDirectory, 'book-reviews'),
    paper: path.join(contentDirectory, 'paper-reviews'),
    'try-tech': path.join(contentDirectory, 'try-tech'),
    memoir: path.join(contentDirectory, 'memoir'),
  }

  const posts = []

  Object.entries(categoryDirMap).forEach(([category, categoryDir]) => {
    if (!fs.existsSync(categoryDir)) return

    const files = getAllMarkdownFiles(categoryDir)
    files.forEach((filePath) => {
      try {
        const fileContents = fs.readFileSync(filePath, 'utf8')
        const frontMatterMatch = fileContents.match(/^---\n([\s\S]*?)\n---/)
        const frontMatter = frontMatterMatch ? frontMatterMatch[1] : ''
        const dateMatch = frontMatter.match(/date:\s*"([^"]+)"/)
        const tagsMatch = frontMatter.match(/tags:\s*\[([^\]]*)\]/)
        const tags =
          tagsMatch && tagsMatch[1].trim().length > 0
            ? tagsMatch[1]
                .split(',')
                .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''))
                .filter(Boolean)
            : []
        const slug = getSlugFromFilename(path.basename(filePath))
        posts.push({
          category,
          slug,
          tags,
          date: dateMatch ? dateMatch[1] : '1970-01-01',
        })
      } catch (error) {
        console.error(`Error reading post ${filePath}:`, error)
      }
    })
  })

  return posts
}

function sortSeriesPosts(posts, postSort) {
  if (postSort === 'date-asc') {
    return posts.sort((a, b) => new Date(a.date) - new Date(b.date))
  }
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

function generateSeries() {
  if (!fs.existsSync(configPath)) {
    console.error(`Missing config: ${configPath}`)
    process.exit(1)
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  const allPosts = getAllPosts()
  const seriesConfigList = Array.isArray(config.series) ? config.series : []
  const seriesOrder = Array.isArray(config.seriesOrder) ? config.seriesOrder : []

  const generated = seriesConfigList.map((seriesConfig) => {
    const tag = seriesConfig.tag
    const matched = allPosts.filter((post) => post.tags.includes(tag))
    const sorted = sortSeriesPosts(matched, seriesConfig.postSort)

    const entry = {
      slug: seriesConfig.slug,
      title: seriesConfig.title,
      description: seriesConfig.description || '',
    }
    if (seriesConfig.note) entry.note = seriesConfig.note
    if (seriesConfig.cover) entry.cover = seriesConfig.cover
    entry.posts = sorted.map((post) => ({
      category: post.category,
      slug: post.slug,
    }))
    return entry
  })

  const orderMap = new Map(seriesOrder.map((slug, index) => [slug, index]))
  generated.sort((a, b) => {
    const aOrder = orderMap.has(a.slug) ? orderMap.get(a.slug) : Number.MAX_SAFE_INTEGER
    const bOrder = orderMap.has(b.slug) ? orderMap.get(b.slug) : Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.title.localeCompare(b.title)
  })

  fs.writeFileSync(outputPath, `${JSON.stringify({ series: generated }, null, 2)}\n`, 'utf8')
  console.log(`✅ series.json generated with ${generated.length} series`)
}

generateSeries()
