import { getPostsByCategory } from '@/lib/content'
import CategoryPageClient from '@/components/CategoryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Paper',
  description: '논문 정리 모음',
  openGraph: {
    title: 'Paper - Trace of Thought',
    description: '논문 정리 모음',
    url: 'https://www.gaeng02.com/paper',
  },
}

export default function PaperPage() {
  const posts = getPostsByCategory('paper')

  return <CategoryPageClient category="paper" posts={posts} />
}
