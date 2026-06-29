import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { buildArticleMetadata } from '@/lib/articleMeta'
import ArticleScreen from '@/components/ArticleScreen'

export function generateStaticParams() {
  return getAllPosts()
    .filter((p) => p.category === 'memoir')
    .map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return buildArticleMetadata('memoir', params.slug)
}

export default function MemoirPostPage({ params }: { params: { slug: string } }) {
  return <ArticleScreen category="memoir" slug={params.slug} />
}
