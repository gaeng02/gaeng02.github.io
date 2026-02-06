import { getPostsByCategory } from '@/lib/content'
import CategoryPageClient from '@/components/CategoryPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Try Tech',
  description: '기술 학습 내용 모음',
  openGraph: {
    title: 'Try Tech - Trace of Thought',
    description: '기술 학습 내용 모음',
    url: 'https://www.gaeng02.com/try-tech',
  },
}

export default function TryTechPage() {
  const posts = getPostsByCategory('try-tech')

  return <CategoryPageClient category="try-tech" posts={posts} />
}
