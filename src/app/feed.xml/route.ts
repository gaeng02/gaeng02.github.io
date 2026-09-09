import { getAllPosts } from '@/lib/content'
import { SITE, absoluteUrl } from '@/lib/site'
import { escapeXml as xml } from '@/lib/serialize'

export const dynamic = 'force-static'

export function GET() {
  const items = getAllPosts().map((post) => {
    const url = xml(absoluteUrl(`/${post.category}/${post.slug}`))
    return `<item><title>${xml(post.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.date).toUTCString()}</pubDate></item>`
  }).join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(SITE.name)}</title><link>${xml(SITE.url)}</link><description>${xml(SITE.description)}</description><language>ko</language><atom:link href="${xml(absoluteUrl('/feed.xml'))}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
