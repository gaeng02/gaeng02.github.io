import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

export interface TocItem {
  depth: number
  text: string
  id: string
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

/** Strip inline markdown / html so heading text reads cleanly. */
function cleanInline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/#+\s*$/, '')
    .trim()
}

/** GitHub-style slug: keeps unicode letters (Korean), drops punctuation. */
function baseSlug(text: string): string {
  return cleanInline(text)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

interface RawHeading {
  depth: number
  text: string
  id: string
}

/** Parse ATX headings (#..######) in document order, skipping fenced code. */
function parseHeadings(markdown: string): RawHeading[] {
  const lines = markdown.split('\n')
  const out: RawHeading[] = []
  const seen = new Map<string, number>()
  let inFence = false
  let fence = ''

  for (const line of lines) {
    const trimmed = line.trim()
    const fenceMatch = /^(```+|~~~+)/.exec(trimmed)
    if (fenceMatch) {
      if (!inFence) {
        inFence = true
        fence = fenceMatch[1][0]
      } else if (trimmed.startsWith(fence)) {
        inFence = false
      }
      continue
    }
    if (inFence) continue

    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line)
    if (!m) continue

    const depth = m[1].length
    const text = cleanInline(m[2])
    if (!text) continue

    let slug = baseSlug(m[2]) || 'section'
    const count = seen.get(slug) ?? 0
    seen.set(slug, count + 1)
    if (count > 0) slug = `${slug}-${count}`

    out.push({ depth, text, id: slug })
  }
  return out
}

/**
 * Render markdown to HTML, inject stable ids on headings, and extract a TOC.
 * No external rehype deps — ids are injected by sequential heading match,
 * which is safe because remark emits headings in the same document order.
 */
export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const headings = parseHeadings(markdown)

  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown)

  let html = processed.toString()

  let i = 0
  html = html.replace(/<h([1-6])>/g, (match, lvl: string) => {
    const h = headings[i]
    if (!h || Number(lvl) !== h.depth) return match
    i += 1
    return `<h${lvl} id="${h.id}">`
  })

  const toc = headings.filter((h) => h.depth === 2 || h.depth === 3)

  return { html, toc }
}

/** Convenience: HTML only (used by the local admin preview). */
export async function renderMarkdownHtml(markdown: string): Promise<string> {
  return (await renderMarkdown(markdown)).html
}
