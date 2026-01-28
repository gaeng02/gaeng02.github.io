import { MetadataRoute } from 'next'

const baseUrl = 'https://gaeng02.github.io'

// 메인 사이트맵 (인덱스) - 메인 페이지만 포함
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]
}
