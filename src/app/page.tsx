import { getPostsByCategory } from '@/lib/content'
import { getAboutData, getAboutDetailContent } from '@/lib/about'
import HomePageClient from '@/components/HomePageClient'
import type { Metadata } from 'next'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir'

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
  // 서버에서 모든 카테고리의 데이터를 미리 가져오기
  const bookPosts = getPostsByCategory('book')
  const paperPosts = getPostsByCategory('paper')
  const tryTechPosts = getPostsByCategory('try-tech')
  const memoirPosts = getPostsByCategory('memoir')

  const postsByCategory: Record<MenuItem, typeof bookPosts> = {
    book: bookPosts,
    paper: paperPosts,
    'try-tech': tryTechPosts,
    memoir: memoirPosts,
  }

  // About 데이터 로드
  const aboutData = getAboutData()
  const detailContents: Record<string, string> = {}
  
  aboutData.projects.forEach((project) => {
    if (project.detailFile) {
      detailContents[project.detailFile] = getAboutDetailContent(project.detailFile)
    }
  })
  
  aboutData.activities.forEach((activity) => {
    if (activity.detailFile) {
      detailContents[activity.detailFile] = getAboutDetailContent(activity.detailFile)
    }
  })

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

  // SEO를 위해 최근 포스트 목록을 서버 사이드에서 렌더링
  const allPosts = [
    ...bookPosts,
    ...paperPosts,
    ...tryTechPosts,
    ...memoirPosts,
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const recentPosts = allPosts.slice(0, 10)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SEO를 위한 최근 포스트 목록 (검색 엔진이 볼 수 있도록 서버 사이드 렌더링) */}
      <div className="sr-only" aria-hidden="true">
        <h2>최근 포스트</h2>
        <ul>
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <a href={`/${post.category}/${post.slug}`}>
                {post.title} - {post.description}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <HomePageClient 
        postsByCategory={postsByCategory}
        aboutData={aboutData}
        aboutDetailContents={detailContents}
      />
    </>
  )
}
