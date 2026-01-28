import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: [
      'https://gaeng02.github.io/sitemap.xml',
      'https://gaeng02.github.io/sitemap-posts.xml',
    ],
  }
}
