import { getAllPosts } from '@/lib/content'
import { MetadataRoute } from 'next'

const baseUrl = 'https://www.gaeng02.com'

// 포스트 사이트맵 - 모든 포스트 포함
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  
  return posts.map((post) => ({
    url: `${baseUrl}/${post.category}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
}
