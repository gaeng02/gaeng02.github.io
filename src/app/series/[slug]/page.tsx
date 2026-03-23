import { getSeriesWithPosts } from '@/lib/series'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { withBasePath } from '@/lib/utils'
import Image from 'next/image'
import type { Metadata } from 'next'

interface SeriesPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const { getAllSeries } = await import('@/lib/series')
  const allSeries = getAllSeries()
  
  // 빈 배열이어도 반환해야 함 (output: 'export' 모드에서 필요)
  if (allSeries.length === 0) {
    return []
  }
  
  return allSeries.map((series) => ({
    slug: series.slug,
  }))
}

export async function generateMetadata({ params }: SeriesPageProps): Promise<Metadata> {
  const series = getSeriesWithPosts(params.slug)
  
  if (!series) {
    return {
      title: 'Series Not Found',
    }
  }

  return {
    title: `${series.title} - Trace of Thought`,
    description: series.description,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `https://www.gaeng02.com/series/${series.slug}`,
    },
    openGraph: {
      title: `${series.title} - Trace of Thought`,
      description: series.description,
      url: `https://www.gaeng02.com/series/${series.slug}`,
    },
  }
}

const categoryLabels: Record<string, string> = {
  book: 'Book',
  paper: 'Paper',
  'try-tech': 'Try Tech',
  memoir: 'Memoir',
}

export default function SeriesPage({ params }: SeriesPageProps) {
  const series = getSeriesWithPosts(params.slug)

  if (!series) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: series.title,
    description: series.description,
    url: `https://www.gaeng02.com/series/${series.slug}`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href={withBasePath('/')}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors mb-4 inline-block"
            >
              ← 목록으로 돌아가기
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {series.title}
            </h1>
            <p className="text-gray-600 text-lg">
              {series.description}
            </p>
            <div className="mt-4 text-sm text-gray-500">
              {series.posts.length}개의 포스트
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12 shadow-sm">
            <div className="space-y-6">
              {series.posts.length > 0 ? (
                series.posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={withBasePath(`/${post.category}/${post.slug}`)}
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
                  <p className="text-gray-500">아직 포스트가 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
