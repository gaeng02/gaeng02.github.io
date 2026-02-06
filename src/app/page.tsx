import { getAllSeriesWithPosts } from '@/lib/series'
import HomePageClient from '@/components/HomePageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trace of Thought',
  description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
  openGraph: {
    title: 'Trace of Thought',
    description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
    url: 'https://www.gaeng02.com',
  },
}

export default function HomePage() {
  // Series 데이터 로드
  const allSeries = getAllSeriesWithPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Trace of Thought',
    description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
    url: 'https://www.gaeng02.com',
    author: {
      '@type': 'Person',
      name: 'gaeng02',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomePageClient allSeries={allSeries} />
    </>
  )
}
