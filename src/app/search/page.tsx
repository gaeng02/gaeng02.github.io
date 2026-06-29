import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchPageClient from '@/components/SearchPageClient'

export const metadata: Metadata = {
  title: 'Search',
  description: '제목 · 설명 · 태그 · 시리즈에서 글을 검색합니다.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <>
      <h1 className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        검색
      </h1>
      <Suspense fallback={null}>
        <SearchPageClient />
      </Suspense>
    </>
  )
}
