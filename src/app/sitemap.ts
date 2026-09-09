import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content'
import { getAllSeries } from '@/lib/series'
import { absoluteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/book', '/paper', '/try-tech', '/memoir', '/series', '/archives', '/about']
  return [
    ...pages.map((url) => ({ url: absoluteUrl(url) })),
    ...getAllSeries().filter((series) => series.posts.length).map((series) => ({ url: absoluteUrl(`/series/${series.slug}`) })),
    ...getAllPosts().map((post) => ({ url: absoluteUrl(`/${post.category}/${post.slug}`), lastModified: post.updatedAt || post.date })),
  ]
}
