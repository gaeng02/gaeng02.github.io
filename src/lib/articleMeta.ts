import type { Metadata } from 'next'
import { getPostBySlug, type Category } from './content'
import { absoluteUrl } from './site'

/** Shared metadata builder for article detail routes. */
export function buildArticleMetadata(category: Category, slug: string): Metadata {
  const post = getPostBySlug(category, slug)
  if (!post) return { title: 'Not Found', robots: { index: false, follow: false } }

  const url = `/${category}/${slug}`
  const images = post.cover ? [{ url: absoluteUrl(post.cover), alt: post.title }] : undefined

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
      tags: post.tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: images?.map((i) => i.url),
    },
  }
}
