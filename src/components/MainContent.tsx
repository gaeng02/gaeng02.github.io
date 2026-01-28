'use client'

import { useState, useEffect } from 'react'
import { Post } from '@/lib/content'
import Link from 'next/link'
import { withBasePath } from '@/lib/utils'
import Image from 'next/image'
import type { AboutData } from '@/lib/about'
import AboutSection from './AboutSection'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir' | 'about'

interface MainContentProps {
  selectedMenu: MenuItem | null
  posts: Post[]
  searchQuery?: string
  aboutData?: AboutData
  aboutDetailContents?: Record<string, string>
}

const POSTS_PER_PAGE = 10

export default function MainContent({ selectedMenu, posts, searchQuery, aboutData, aboutDetailContents }: MainContentProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const categoryLabels: Record<Exclude<MenuItem, 'about'>, string> = {
    book: 'Book',
    paper: 'Paper',
    'try-tech': 'Try Tech',
    memoir: 'Memoir',
  }

  const getCategoryUrl = (category: Exclude<MenuItem, 'about'>) => {
    return withBasePath(`/${category}`)
  }

  // 메뉴나 검색어가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedMenu, searchQuery])

  // 검색 중인 경우
  if (searchQuery) {
    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE
    const endIndex = startIndex + POSTS_PER_PAGE
    const displayPosts = posts.slice(startIndex, endIndex)

    const handlePageChange = (page: number) => {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              검색 결과
            </h2>
            <p className="text-gray-600 text-sm">
              &quot;{searchQuery}&quot;에 대한 검색 결과 {posts.length}개
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={
                    post.category === 'book' || post.category === 'paper' || post.category === 'try-tech'
                      ? withBasePath(`/${post.category}/${post.slug}`)
                      : withBasePath(`/${post.category}/${post.slugPath.join('/')}`)
                  }
                  className="block group"
                >
                  <article className="flex gap-6 pb-6 border-b border-gray-100 last:border-0">
                    {post.cover && (
                      <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image
                          src={post.cover}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-primary-50 text-primary-700 rounded">
                          {categoryLabels[post.category]}
                        </span>
                        <time className="text-xs text-gray-500">{post.date}</time>
                      </div>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                이전
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return (
                      <span key={page} className="px-2 py-2 text-gray-500">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (!selectedMenu) {
    return (
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-600 text-lg">위의 메뉴를 클릭해보세요.</p>
        </div>
      </div>
    )
  }

  // About 메뉴인 경우 AboutSection 렌더링
  if (selectedMenu === 'about') {
    if (aboutData && aboutDetailContents) {
      return <AboutSection data={aboutData} detailContents={aboutDetailContents} />
    }
    return null
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const endIndex = startIndex + POSTS_PER_PAGE
  const displayPosts = posts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
        <div className="space-y-6 mb-8">
          {displayPosts.length > 0 ? (
            displayPosts.map((post) => (
              <Link
                key={post.slug}
                href={
                  post.category === 'book' || post.category === 'paper' || post.category === 'try-tech'
                    ? withBasePath(`/${post.category}/${post.slug}`)
                    : withBasePath(`/${post.category}/${post.slugPath.join('/')}`)
                }
                className="block group"
              >
                <article className="flex gap-6 pb-6 border-b border-gray-100 last:border-0">
                  {post.cover && (
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={post.cover}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <time className="text-xs text-gray-500">{post.date}</time>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">아직 글이 없습니다.</p>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              이전
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // 현재 페이지 주변 2페이지만 표시
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === page
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                } else if (
                  page === currentPage - 3 ||
                  page === currentPage + 3
                ) {
                  return (
                    <span key={page} className="px-2 py-2 text-gray-500">
                      ...
                    </span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
