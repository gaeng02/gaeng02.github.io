import type { Metadata } from 'next'
import { getPostBySlug, type Category } from './content'
import { SITE, absoluteUrl } from './site'

const DEFAULT_OG_IMAGE = { url: '/og-default.png', width: 1200, height: 630, alt: `${SITE.name} — 책 · 논문 · 시도 · 회고` }

/** Shared metadata builder for article detail routes. */
export function buildArticleMetadata(category: Category, slug: string): Metadata {
  const post = getPostBySlug(category, slug)
  if (!post) return { title: 'Not Found', robots: { index: false, follow: false } }

  const url = `/${category}/${slug}`
  // Posts without a cover still get a branded preview card on social platforms.
  const images = post.cover ? [{ url: absoluteUrl(post.cover), alt: post.title }] : [DEFAULT_OG_IMAGE]

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updatedAt || post.date,
      authors: [SITE.author],
      siteName: SITE.name,
      locale: 'ko_KR',
      tags: post.tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: images.map((i) => i.url),
    },
  }
}
