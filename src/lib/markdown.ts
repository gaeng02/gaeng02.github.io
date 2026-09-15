import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

export interface TocItem {
  depth: number
  text: string
  id: string
}

export interface RenderedMarkdown {
  html: string
  toc: TocItem[]
}

/**
 * GitHub-style content policy: Markdown plus inline HTML such as <img>, <details>,
 * <table> and <br> is allowed, while scripts, iframes, event handlers, inline styles
 * and unknown protocols are stripped. The same schema drives the BlogStudio preview.
 */
export const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    img: [...(defaultSchema.attributes?.img ?? []), 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  },
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

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] }

/** Images inside articles load lazily; runs after sanitize so the attributes survive. */
function rehypeLazyImages() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (node.type === 'element' && node.tagName === 'img') {
        node.properties = { loading: 'lazy', decoding: 'async', ...(node.properties ?? {}) }
      }
      node.children?.forEach(visit)
    }
    visit(tree)
  }
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeSanitize, sanitizeSchema)
  .use(rehypeLazyImages)
  .use(rehypeStringify)

/**
 * Render markdown to HTML, inject stable ids on headings, and extract a TOC.
 * Ids are injected by sequential heading match, which is safe because the
 * renderer emits headings in the same document order.
 */
export async function renderMarkdown(markdown: string): Promise<RenderedMarkdown> {
  const headings = parseHeadings(markdown)

  let html = String(await processor.process(markdown))

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
