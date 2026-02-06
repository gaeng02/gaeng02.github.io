import { getPostsByCategory } from '@/lib/content'
import CategoryPageClient from '@/components/CategoryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Memoir',
  description: '회고 모음',
  openGraph: {
    title: 'Memoir - Trace of Thought',
    description: '회고 모음',
    url: 'https://www.gaeng02.com/memoir',
  },
}

export default function MemoirPage() {
  const posts = getPostsByCategory('memoir')

  return <CategoryPageClient category="memoir" posts={posts} />
}
