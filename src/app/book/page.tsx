import { getPostsByCategory } from '@/lib/content'
import CategoryPageClient from '@/components/CategoryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book',
  description: '도서 리뷰 모음',
  openGraph: {
    title: 'Book - Trace of Thought',
    description: '도서 리뷰 모음',
    url: 'https://www.gaeng02.com/book',
  },
}

export default function BookPage() {
  const posts = getPostsByCategory('book')

  return <CategoryPageClient category="book" posts={posts} />
}
