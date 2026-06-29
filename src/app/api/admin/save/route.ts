// LOCAL-ONLY (gitignored). Dev-server route that writes a Markdown post to
// content/. Never deployed — the static export build excludes this directory.
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const DIRS: Record<string, string> = {
  book: 'book-reviews',
  paper: 'paper-reviews',
  'try-tech': 'try-tech',
  memoir: 'memoir',
}

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function quote(s: string): string {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const category: string = data.category
    const title: string = (data.title || '').trim()
    const date: string = (data.date || new Date().toISOString().slice(0, 10)).trim()
    const description: string = (data.description || '').trim()
    const cover: string = (data.cover || '').trim()
    const body: string = data.body || ''
    const overwrite: boolean = !!data.overwrite

    const tags: string[] = Array.isArray(data.tags)
      ? data.tags
      : String(data.tags || '')
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)

    if (!DIRS[category]) {
      return NextResponse.json({ error: '알 수 없는 카테고리입니다.' }, { status: 400 })
    }
    if (!title) {
      return NextResponse.json({ error: '제목은 필수입니다.' }, { status: 400 })
    }

    let slug: string = (data.slug || '').trim() || slugify(title)
    if (!slug) slug = `post-${Date.now()}`

    const dir = path.join(process.cwd(), 'content', DIRS[category])
    fs.mkdirSync(dir, { recursive: true })
    const filename = `${date}-${slug}.md`
    const filePath = path.join(dir, filename)

    if (fs.existsSync(filePath) && !overwrite) {
      return NextResponse.json(
        { error: '같은 파일이 이미 있어요.', conflict: true, filename },
        { status: 409 }
      )
    }

    const fm = [
      '---',
      `title: ${quote(title)}`,
      `date: ${quote(date)}`,
      `description: ${quote(description)}`,
      `category: ${quote(category)}`,
      `tags: [${tags.map(quote).join(', ')}]`,
      ...(cover ? [`cover: ${quote(cover)}`] : []),
      '---',
      '',
    ].join('\n')

    fs.writeFileSync(filePath, `${fm}\n${body.replace(/\s*$/, '')}\n`, 'utf8')

    // refresh series.json / search-index.json
    let genOk = true
    let genMessage = ''
    try {
      execSync('npm run gen', { cwd: process.cwd(), stdio: 'pipe' })
    } catch (e: unknown) {
      genOk = false
      genMessage = e instanceof Error ? e.message : String(e)
    }

    return NextResponse.json({
      ok: true,
      path: `content/${DIRS[category]}/${filename}`,
      url: `/${category}/${slug}`,
      genOk,
      genMessage,
    })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
