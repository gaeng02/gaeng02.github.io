const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')

const CATEGORY_DIRS = Object.freeze({ book: 'book-reviews', paper: 'paper-reviews', 'try-tech': 'try-tech', memoir: 'memoir' })

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return markdownFiles(file)
    return entry.isFile() && entry.name.endsWith('.md') ? [file] : []
  })
}

// Existing URLs, including 2025-03-SWMaestro, must remain unchanged.
function slugFromFilename(filename) {
  return path.basename(filename).replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function normalizeDate(value, field, file) {
  const text = value instanceof Date ? (field === 'date' ? value.toISOString().slice(0, 10) : value.toISOString()) : String(value || '')
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(text) || !Number.isFinite(Date.parse(text)) || new Date(`${text.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) !== text.slice(0, 10)) throw new Error(`${file}: invalid ${field}`)
  return text
}

function readPosts(root = path.join(process.cwd(), 'content')) {
  const seen = new Set()
  const posts = []
  for (const [category, dir] of Object.entries(CATEGORY_DIRS)) {
    for (const filePath of markdownFiles(path.join(root, dir))) {
      const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
      if (data.draft === true) continue
      if (data.category !== category) throw new Error(`${filePath}: category must be ${category}`)
      if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${filePath}: missing title`)
      if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string'))) throw new Error(`${filePath}: invalid tags`)
      const slug = slugFromFilename(filePath)
      if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug)) throw new Error(`${filePath}: unsafe slug`)
      const key = `${category}/${slug}`
      if (seen.has(key)) throw new Error(`${filePath}: duplicate post URL ${key}`)
      seen.add(key)
      const date = normalizeDate(data.date, 'date', filePath)
      const updatedAt = data.updatedAt ? normalizeDate(data.updatedAt, 'updatedAt', filePath) : undefined
      const published = date.length === 10 ? `${date}T00:00:00+09:00` : date
      if (updatedAt && Date.parse(updatedAt) < Date.parse(published)) throw new Error(`${filePath}: updatedAt precedes date`)
      posts.push({
        title: data.title.trim(), category, date, updatedAt,
        description: typeof data.description === 'string' && data.description.trim() ? data.description.trim() : excerpt(content),
        tags: data.tags || [], cover: typeof data.cover === 'string' ? data.cover : undefined,
        slug, content, filePath,
      })
    }
  }
  return posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug))
}

function excerpt(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ').replace(/!\[[^\]]*\]\([^)]*\)/g, ' ').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_~|`]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180)
}

module.exports = { CATEGORY_DIRS, readPosts, slugFromFilename, excerpt }
