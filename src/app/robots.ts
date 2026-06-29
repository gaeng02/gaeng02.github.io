import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/admin/', '/api/', '/search'],
    },
    sitemap: [
      'https://www.gaeng02.com/sitemap.xml',
      'https://www.gaeng02.com/sitemap-posts.xml',
    ],
  }
}
