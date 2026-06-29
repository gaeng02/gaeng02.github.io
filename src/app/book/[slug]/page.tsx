import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { buildArticleMetadata } from '@/lib/articleMeta'
import ArticleScreen from '@/components/ArticleScreen'

export function generateStaticParams() {
  return getAllPosts()
    .filter((p) => p.category === 'book')
    .map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return buildArticleMetadata('book', params.slug)
}

export default function BookPostPage({ params }: { params: { slug: string } }) {
  return <ArticleScreen category="book" slug={params.slug} />
}
