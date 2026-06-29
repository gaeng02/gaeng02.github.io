import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { buildArticleMetadata } from '@/lib/articleMeta'
import ArticleScreen from '@/components/ArticleScreen'

export function generateStaticParams() {
  return getAllPosts()
    .filter((p) => p.category === 'try-tech')
    .map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return buildArticleMetadata('try-tech', params.slug)
}

export default function TryTechPostPage({ params }: { params: { slug: string } }) {
  return <ArticleScreen category="try-tech" slug={params.slug} />
}
