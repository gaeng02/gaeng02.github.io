'use client'

import Header from './Header'
import { formatDate } from '@/lib/dateUtils'
import { withBasePath } from '@/lib/utils'
import Link from 'next/link'
import type { YearGroup } from '@/lib/archives'

interface ArchivesPageClientProps {
  yearGroups: YearGroup[]
}

export default function ArchivesPageClient({ yearGroups }: ArchivesPageClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-2">
            Archives
          </h1>
          <p className="text-lg text-gray-600 italic">
            All the articles I've archived.
          </p>
        </div>

        <div className="space-y-12">
          {yearGroups.map((yearGroup) => (
            <div key={yearGroup.year} className="space-y-8">
              {/* 연도 헤더 */}
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl font-bold text-gray-900">
                  {yearGroup.year}
                </h2>
                <span className="text-sm text-gray-500">
                  {yearGroup.totalCount}
                </span>
              </div>

              {/* 월별 그룹 */}
              {yearGroup.months.map((monthGroup) => (
                <div key={`${yearGroup.year}-${monthGroup.month}`} className="space-y-4">
                  {/* 월 헤더 */}
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {monthGroup.monthName}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {monthGroup.count}
                    </span>
                  </div>

                  {/* 포스트 목록 */}
                  <div className="space-y-6 pl-4 border-l-2 border-gray-200">
                    {monthGroup.posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={withBasePath(`/${post.category}/${post.slug}`)}
                        className="block group"
                      >
                        <article className="space-y-2">
                          <div className="flex items-center gap-3">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            <time className="text-sm text-gray-500">
                              {formatDate(post.date)}
                            </time>
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {post.description}
                          </p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {yearGroups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">아직 아카이브된 글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
