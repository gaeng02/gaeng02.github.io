// Notion → Markdown sync. Posts are written in a Notion database; pages whose status is
// "released" become content/<dir>/<date>-<slug>.md. Files created here carry `notion: <page id>`
// in their frontmatter, and only those files are ever rewritten or removed, so posts
// written by hand stay untouched.
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')
const { NotionToMarkdown } = require('notion-to-md')
const { CATEGORY_DIRS } = require('./content.cjs')

const PUBLISHED = new Set(['released', '발행', 'published'])
const CATEGORY_NAMES = {
  memoir: 'memoir', 회고: 'memoir',
  'try tech': 'try-tech', 'try-tech': 'try-tech', 기술: 'try-tech',
  paper: 'paper', 논문: 'paper',
  book: 'book', 책: 'book',
}
// Property names in the Notion database; English names work too.
const PROPS = {
  slug: ['url', 'slug', '주소'],
  category: ['category', '카테고리'],
  tags: ['tags', '태그'],
  date: ['date', '발행일'],
  description: ['summary', 'description', '설명'],
  cover: ['thumbnail', 'cover', '표지'],
  status: ['status', '상태'],
}
const SITE_ORIGIN = 'https://www.gaeng02.com'
const SERIES_PROPS = {
  slug: ['url', 'slug', '주소'],
  description: ['summary', 'description', '설명'],
  order: ['order', '순서'],
  status: ['status', '상태'],
}
const IMAGE_TYPES = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif', 'image/webp': 'webp', 'image/svg+xml': 'svg' }

function prop(page, key, props = PROPS) {
  const names = props[key]
  const entry = Object.entries(page.properties).find(([name]) => names.includes(name.trim().toLowerCase()))
  return entry ? entry[1] : undefined
}

function plain(richText = []) {
  return richText.map((part) => part.plain_text).join('').trim()
}

function propText(value) {
  if (!value) return ''
  if (value.type === 'title' || value.type === 'rich_text') return plain(value[value.type])
  if (value.type === 'select' || value.type === 'status') return value[value.type]?.name?.trim() || ''
  if (value.type === 'url') return value.url || ''
  return ''
}

/** A date in Korea, as the blog shows dates (YYYY-MM-DD). */
function kstDate(iso) {
  return new Date(Date.parse(iso) + 9 * 3600 * 1000).toISOString().slice(0, 10)
}

/** URL slug from free text. Case is kept: blog URLs are case-sensitive (/memoir/2025-03-SWMaestro). */
function slugify(text) {
  return text
    .trim()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+/, '')
}

function isPublished(page) {
  return PUBLISHED.has(propText(prop(page, 'status')).toLowerCase())
}

/** Frontmatter and target path for a page, or an error message when it cannot be published. */
function describe(page, series = []) {
  const titleProp = Object.values(page.properties).find((value) => value.type === 'title')
  const title = titleProp ? plain(titleProp.title) : ''
  const categoryName = propText(prop(page, 'category')).toLowerCase()
  const category = CATEGORY_NAMES[categoryName]
  if (!title) return { error: '제목이 비어 있습니다' }
  if (!category) return { error: `카테고리를 알 수 없습니다: "${categoryName}" (Memoir, Try Tech, Paper, Book 중 하나)` }
  const slug = propText(prop(page, 'slug')) ? slugify(propText(prop(page, 'slug'))) : slugify(title).toLowerCase()
  if (!/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug)) return { error: `주소로 쓸 수 없는 값입니다: "${slug}"` }
  const dateValue = prop(page, 'date')
  const date = dateValue?.type === 'date' && dateValue.date?.start ? dateValue.date.start.slice(0, 10) : kstDate(page.created_time)
  const tagsValue = prop(page, 'tags')
  const tags = tagsValue?.type === 'multi_select' ? tagsValue.multi_select.map((tag) => tag.name) : []
  // The post's "series" select names a released series by its title (or its url).
  const seriesName = propText(page.properties.series).toLowerCase()
  const inSeries = seriesName ? series.find((item) => [item.title.toLowerCase(), item.slug.toLowerCase()].includes(seriesName)) : null
  const warning = seriesName && !inSeries ? `시리즈 "${seriesName}"를 Series DB에서 찾지 못해 시리즈 없이 올립니다` : undefined
  const data = {
    title,
    date,
    description: propText(prop(page, 'description')),
    category,
    tags,
    ...(inSeries ? { series: inSeries.slug } : {}),
    notion: page.id,
    notionEditedAt: page.last_edited_time,
  }
  if (!data.description) delete data.description
  return { data, slug, warning, file: path.join('content', CATEGORY_DIRS[category], `${date}-${slug}.md`) }
}

/** Released series from the Series database, in display order. */
async function readSeries(notion, databaseId) {
  const pages = (await queryAll(notion, await resolveDataSource(notion, databaseId))).filter(
    (page) => PUBLISHED.has(propText(prop(page, 'status', SERIES_PROPS)).toLowerCase())
  )
  const series = []
  const errors = []
  for (const page of pages) {
    const titleProp = Object.values(page.properties).find((value) => value.type === 'title')
    const title = titleProp ? plain(titleProp.title) : ''
    const slug = slugify(propText(prop(page, 'slug', SERIES_PROPS)) || title).toLowerCase()
    if (!title || !/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(slug)) {
      errors.push(`${page.url}: 시리즈 제목이나 주소가 비어 있거나 쓸 수 없는 값입니다`)
      continue
    }
    const order = prop(page, 'order', SERIES_PROPS)
    series.push({
      slug,
      title,
      description: propText(prop(page, 'description', SERIES_PROPS)),
      order: order?.type === 'number' && order.number !== null ? order.number : Infinity,
    })
  }
  series.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
  return { series, errors }
}

/** content/series.config.json, which scripts/generate-series.js turns into series.json. */
function writeSeriesConfig(root, series) {
  const file = path.join(root, 'content', 'series.config.json')
  const config = {
    seriesOrder: series.map((item) => item.slug),
    series: series.map(({ slug, title, description }) => ({ slug, title, description })),
  }
  const text = `${JSON.stringify(config, null, 2)}\n`
  if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === text) return false
  fs.writeFileSync(file, text)
  return true
}

function configuredSeries(root) {
  const file = path.join(root, 'content', 'series.config.json')
  if (!fs.existsSync(file)) return []
  return JSON.parse(fs.readFileSync(file, 'utf8')).series || []
}

function markdownFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return markdownFiles(file)
    return entry.name.endsWith('.md') ? [file] : []
  })
}

/** Files this sync owns, by Notion page id. */
function syncedFiles(root) {
  const owned = new Map()
  for (const file of markdownFiles(path.join(root, 'content'))) {
    const { data } = matter(fs.readFileSync(file, 'utf8'))
    if (typeof data.notion === 'string') owned.set(data.notion, { file: path.relative(root, file), data })
  }
  return owned
}

/** Notion-hosted file URLs expire after an hour, so images are copied into the repository. */
async function saveImage(url, root, fetchImpl) {
  const response = await fetchImpl(url)
  if (!response.ok) throw new Error(`이미지를 내려받지 못했습니다 (HTTP ${response.status})`)
  const bytes = Buffer.from(await response.arrayBuffer())
  const type = (response.headers.get('content-type') || '').split(';')[0].trim()
  const extension = IMAGE_TYPES[type] || path.extname(new URL(url).pathname).slice(1).toLowerCase() || 'png'
  const name = `${crypto.createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.${extension}`
  const target = path.join(root, 'public', 'assets', 'images', name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (!fs.existsSync(target)) fs.writeFileSync(target, bytes)
  return `/assets/images/${name}`
}

function fileUrl(file) {
  if (!file) return ''
  return file.type === 'external' ? file.external.url : file.type === 'file' ? file.file.url : ''
}

function converter(notion, root, fetchImpl) {
  const n2m = new NotionToMarkdown({ notionClient: notion, config: { parseChildPages: false } })
  const inline = (richText) =>
    richText
      .map((part) => {
        const text = n2m.annotatePlainText(part.plain_text, part.annotations)
        return part.href ? `[${text}](${part.href})` : text
      })
      .join('')
  // The page title is the article's <h1>; Notion's headings become the blog's sections
  // (H1 → ##, H2 → ###, H3 → ####), which is also what the table of contents lists.
  for (const level of [1, 2, 3]) {
    n2m.setCustomTransformer(`heading_${level}`, async (block) => {
      const heading = block[`heading_${level}`]
      if (heading.is_toggleable) return false
      return `${'#'.repeat(level + 1)} ${inline(heading.rich_text)}`
    })
  }
  // A line break inside a Notion paragraph (Shift+Enter) stays a line break on the blog.
  n2m.setCustomTransformer('paragraph', async (block) => inline(block.paragraph.rich_text).replace(/\n/g, '\\\n'))
  n2m.setCustomTransformer('image', async (block) => {
    const url = fileUrl(block.image)
    if (!url) return ''
    const src =
      block.image.type === 'file'
        ? await saveImage(url, root, fetchImpl)
        : url.startsWith(`${SITE_ORIGIN}/assets/`)
          ? url.slice(SITE_ORIGIN.length)
          : url
    const alt = plain(block.image.caption).replace(/[[\]]/g, '')
    return `![${alt}](${src})`
  })
  return n2m
}

async function queryAll(notion, dataSourceId) {
  const pages = []
  let cursor
  do {
    const result = await notion.dataSources.query({ data_source_id: dataSourceId, start_cursor: cursor, page_size: 100 })
    pages.push(...result.results.filter((page) => page.object === 'page' && !page.in_trash && !page.archived))
    cursor = result.has_more ? result.next_cursor : undefined
  } while (cursor)
  return pages
}

async function resolveDataSource(notion, databaseId) {
  const database = await notion.databases.retrieve({ database_id: databaseId })
  const source = database.data_sources?.[0]
  if (!source) throw new Error('Notion 데이터베이스에서 데이터 소스를 찾지 못했습니다.')
  return source.id
}

/**
 * Bring content/ in line with the Notion database. Returns what changed; throws only on
 * problems that must stop the sync (a path owned by a hand-written post, network errors).
 */
async function syncNotion({ notion, databaseId, seriesDatabaseId, root, fetchImpl = fetch, log = console.log }) {
  const result = { written: [], removed: [], skipped: [], errors: [], seriesChanged: false }
  let series = configuredSeries(root)
  if (seriesDatabaseId) {
    const read = await readSeries(notion, seriesDatabaseId)
    series = read.series
    result.errors.push(...read.errors)
    result.seriesChanged = writeSeriesConfig(root, series)
  }
  const dataSourceId = await resolveDataSource(notion, databaseId)
  const pages = await queryAll(notion, dataSourceId)
  const owned = syncedFiles(root)
  const n2m = converter(notion, root, fetchImpl)
  const keep = new Set()

  for (const page of pages.filter(isPublished)) {
    const target = describe(page, series)
    const current = owned.get(page.id)
    if (target.warning) result.errors.push(`${page.url}: ${target.warning}`)
    if (target.error) {
      // Leave the last published version in place rather than taking the post down.
      if (current) keep.add(page.id)
      result.errors.push(`${page.url}: ${target.error}`)
      continue
    }
    keep.add(page.id)
    const absolute = path.join(root, target.file)
    const sameSeries = current?.data.series === target.data.series
    if (current && current.file === target.file && current.data.notionEditedAt === page.last_edited_time && sameSeries) {
      result.skipped.push(target.file)
      continue
    }
    if (fs.existsSync(absolute) && current?.file !== target.file) {
      throw new Error(`${target.file}: 직접 작성한 글과 주소가 겹칩니다. Notion 글의 주소를 바꿔 주세요.`)
    }
    const blocks = await n2m.pageToMarkdown(page.id)
    const body = (n2m.toMarkdownString(blocks).parent || '').trim()
    const data = { ...target.data }
    // Only a change to the title or text of a post already on the blog counts as an update;
    // publishing it, or changing tags or series, does not.
    const previous = current ? matter(fs.readFileSync(path.join(root, current.file), 'utf8')) : null
    const rewritten = previous && (previous.data.title !== data.title || previous.content.trim() !== body)
    if (rewritten && kstDate(page.last_edited_time) > data.date) data.updatedAt = page.last_edited_time
    else if (previous?.data.updatedAt) data.updatedAt = previous.data.updatedAt
    const cover = prop(page, 'cover')
    const coverFile = (cover?.type === 'files' && cover.files[0]) || page.cover
    if (coverFile) data.cover = coverFile.type === 'file' ? await saveImage(fileUrl(coverFile), root, fetchImpl) : fileUrl(coverFile)
    fs.mkdirSync(path.dirname(absolute), { recursive: true })
    fs.writeFileSync(absolute, matter.stringify(`\n${body}\n`, data))
    if (current && current.file !== target.file) {
      fs.rmSync(path.join(root, current.file))
      log(`주소 또는 발행일이 바뀌어 ${current.file} → ${target.file} 로 옮겼습니다. 이전 링크는 더 이상 열리지 않습니다.`)
    }
    result.written.push(target.file)
  }

  for (const [id, { file }] of owned) {
    if (keep.has(id)) continue
    fs.rmSync(path.join(root, file))
    result.removed.push(file)
  }
  return result
}

module.exports = { syncNotion, describe, slugify, kstDate, isPublished }
