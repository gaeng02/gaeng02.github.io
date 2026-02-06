'use client'

import Link from 'next/link'
import { withBasePath } from '@/lib/utils'
import type { SeriesWithPosts } from '@/lib/series'

interface SeriesListProps {
  series: SeriesWithPosts[]
}

export default function SeriesList({ series }: SeriesListProps) {
  if (series.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
          <div className="text-center py-12">
            <p className="text-gray-500">아직 시리즈가 없습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Series
          </h2>
          <p className="text-gray-600 text-sm">
              주제별로 모은 포스트 모음
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {series.map((s) => (
            <Link
              key={s.slug}
              href={withBasePath(`/series/${s.slug}`)}
              className="block group"
            >
              <article className="p-6 border border-gray-200 rounded-lg hover:border-primary-600 hover:shadow-md transition-all">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {s.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {s.posts.length}개의 포스트
                  </span>
                  <span className="text-xs text-primary-600 group-hover:underline">
                    보기 →
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
