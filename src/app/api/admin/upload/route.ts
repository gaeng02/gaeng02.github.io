// LOCAL-ONLY (gitignored). Dev-server route that saves an uploaded image into
// public/assets/images/. Never deployed (excluded from static export).
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const IMAGES_DIR = path.join(process.cwd(), 'public', 'assets', 'images')

const EXT_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/svg+xml': 'svg',
  'image/avif': 'avif',
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

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 })
    }

    const f = file as File
    if (!f.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드할 수 있어요.' }, { status: 400 })
    }

    const orig = f.name || 'image'
    const rawExt = path.extname(orig).toLowerCase().replace(/^\./, '')
    const ext = rawExt || EXT_BY_MIME[f.type] || 'png'
    const base = slugify(path.basename(orig, path.extname(orig))) || 'image'

    fs.mkdirSync(IMAGES_DIR, { recursive: true })

    let filename = `${base}.${ext}`
    if (fs.existsSync(path.join(IMAGES_DIR, filename))) {
      filename = `${base}-${Date.now()}.${ext}`
    }

    const buffer = Buffer.from(await f.arrayBuffer())
    fs.writeFileSync(path.join(IMAGES_DIR, filename), buffer)

    return NextResponse.json({ ok: true, path: `/assets/images/${filename}`, filename })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
