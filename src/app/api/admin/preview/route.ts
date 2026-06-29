// LOCAL-ONLY (gitignored). Dev-server route — never deployed (static export).
import { NextRequest, NextResponse } from 'next/server'
import { renderMarkdownHtml } from '@/lib/markdown'

export async function POST(req: NextRequest) {
  try {
    const { markdown = '' } = await req.json()
    const html = await renderMarkdownHtml(String(markdown))
    return NextResponse.json({ html })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
