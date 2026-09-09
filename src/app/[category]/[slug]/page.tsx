import { notFound } from 'next/navigation'
import { getAllPosts, type Category } from '@/lib/content'
import { CATEGORIES } from '@/lib/categories'
import { buildArticleMetadata } from '@/lib/articleMeta'
import ArticleScreen from '@/components/ArticleScreen'

export const dynamicParams = false
type Params = { category: string; slug: string }

export function generateStaticParams() {
  return getAllPosts().map(({ category, slug }) => ({ category, slug }))
}

function category(value: string): Category {
  if (!CATEGORIES.includes(value as Category)) notFound()
  return value as Category
}

export function generateMetadata({ params }: { params: Params }) {
  return buildArticleMetadata(category(params.category), params.slug)
}

export default function PostPage({ params }: { params: Params }) {
  return <ArticleScreen category={category(params.category)} slug={params.slug} />
}
