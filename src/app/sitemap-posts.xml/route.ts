import { getAllPosts } from '@/lib/content'
import { absoluteUrl } from '@/lib/site'
import { escapeXml } from '@/lib/serialize'

export const dynamic = 'force-static'

// Preserve the previously submitted sitemap URL during migration.
export function GET() {
  const items = getAllPosts().map((post) => `<url><loc>${escapeXml(absoluteUrl(`/${post.category}/${post.slug}`))}</loc><lastmod>${escapeXml(post.updatedAt || post.date)}</lastmod></url>`).join('\n')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
