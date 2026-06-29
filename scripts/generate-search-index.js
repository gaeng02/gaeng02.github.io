const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const contentDirectory = path.join(process.cwd(), 'content')
const outputPath = path.join(process.cwd(), 'public', 'search-index.json')

const categoryDirMap = {
  book: path.join(contentDirectory, 'book-reviews'),
  paper: path.join(contentDirectory, 'paper-reviews'),
  'try-tech': path.join(contentDirectory, 'try-tech'),
  memoir: path.join(contentDirectory, 'memoir'),
}

function getAllMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) getAllMarkdownFiles(filePath, fileList)
    else if (file.endsWith('.md')) fileList.push(filePath)
  }
  return fileList
}

function getSlugFromFilename(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function toExcerpt(markdown) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function loadSeriesMap() {
  // post "category/slug" -> { slug, title }
  const map = new Map()
  const seriesByCat = new Map()
  const seriesPath = path.join(contentDirectory, 'series.json')
  if (!fs.existsSync(seriesPath)) return { map, seriesList: [] }

  const { series = [] } = JSON.parse(fs.readFileSync(seriesPath, 'utf8'))
  series.forEach((s) => {
    s.posts.forEach((p) => {
      map.set(`${p.category}/${p.slug}`, { slug: s.slug, title: s.title })
      if (!seriesByCat.has(s.slug)) seriesByCat.set(s.slug, [])
      seriesByCat.get(s.slug).push(p.category)
    })
  })

  const seriesList = series.map((s) => ({
    type: 'series',
    slug: s.slug,
    title: s.title,
    description: s.description || '',
    tags: [],
    url: `/series/${s.slug}`,
    excerpt: s.note || '',
    categories: Array.from(new Set(seriesByCat.get(s.slug) || [])),
  }))

  return { map, seriesList }
}

function generate() {
  const { map: seriesMap, seriesList } = loadSeriesMap()
  const items = []

  for (const [category, dir] of Object.entries(categoryDirMap)) {
    for (const file of getAllMarkdownFiles(dir)) {
      try {
        const { data, content } = matter(fs.readFileSync(file, 'utf8'))
        if (data.category && data.category !== category) continue
        const slug = getSlugFromFilename(path.basename(file))
        items.push({
          type: 'post',
          category,
          slug,
          title: data.title || slug,
          description: data.description || '',
          date: data.date || '1970-01-01',
          tags: Array.isArray(data.tags) ? data.tags : [],
          cover: data.cover || undefined,
          url: `/${category}/${slug}`,
          excerpt: toExcerpt(content),
          series: seriesMap.get(`${category}/${slug}`) || null,
        })
      } catch (error) {
        console.error(`Error indexing ${file}:`, error)
      }
    }
  }

  items.sort((a, b) => new Date(b.date) - new Date(a.date))
  const index = [...seriesList, ...items]

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(index), 'utf8')
  console.log(`✅ search-index.json generated (${items.length} posts, ${seriesList.length} series)`)
}

generate()
