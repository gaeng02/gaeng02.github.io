const fs = require('fs')
const path = require('path')
const { readPosts, excerpt: toExcerpt } = require('../lib/content.cjs')
const contentDirectory = path.join(process.cwd(), 'content')
const outputPath = path.join(process.cwd(), 'public', 'search-index.json')

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

  for (const post of readPosts()) {
    const { category, slug, title, description, date, tags, cover, content } = post
    items.push({ type: 'post', category, slug, title, description, date, tags, cover,
      url: `/${category}/${slug}`, excerpt: toExcerpt(content), series: seriesMap.get(`${category}/${slug}`) || null })
  }

  items.sort((a, b) => new Date(b.date) - new Date(a.date))
  const index = [...seriesList, ...items]

  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(index), 'utf8')
  console.log(`✅ search-index.json generated (${items.length} posts, ${seriesList.length} series)`)
}

generate()
