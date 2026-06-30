import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllSeries, getSeriesWithPosts } from '@/lib/series'
import { toPostSummary } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'
import SeriesPosts from '@/components/SeriesPosts'

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const series = getSeriesWithPosts(params.slug)
  if (!series) return { title: 'Series Not Found', robots: { index: false, follow: true } }

  return {
    title: series.title,
    description: series.description,
    alternates: { canonical: `/series/${series.slug}` },
    openGraph: {
      title: series.title,
      description: series.description,
      url: `/series/${series.slug}`,
    },
  }
}

export default function SeriesDetailPage({ params }: { params: { slug: string } }) {
  const series = getSeriesWithPosts(params.slug)
  if (!series) notFound()

  const summaries = series.posts.map((p) => toPostSummary(p))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: series.title,
    description: series.description,
    url: absoluteUrl(`/series/${series.slug}`),
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: series.posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/${p.category}/${p.slug}`),
        name: p.title,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO */}
      <section className="px" style={{ paddingTop: 72, paddingBottom: 48 }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 7vw, 88px)', margin: '0 0 18px', lineHeight: 1.02, maxWidth: 1000 }}>
          {series.title}
        </h1>
        <p className="body-kr" style={{ fontSize: 20, maxWidth: 660, margin: 0 }}>
          {series.description}
        </p>

        {series.note && (
          <div
            style={{
              marginTop: 40,
              maxWidth: 760,
              display: 'grid',
              gridTemplateColumns: '52px 1fr',
              gap: 18,
              alignItems: 'start',
            }}
          >
            <div style={{ fontFamily: 'var(--serif)', fontSize: 84, lineHeight: 0.78, color: 'var(--c-paper)' }} aria-hidden>
              &ldquo;
            </div>
            <div>
              <p className="body-kr" style={{ fontSize: 20, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                {series.note}
              </p>
              <div className="label" style={{ marginTop: 14 }}>— Series Note</div>
            </div>
          </div>
        )}
      </section>

      {/* POSTS */}
      <section className="px" style={{ paddingTop: 8, paddingBottom: 72 }}>
        {summaries.length > 0 ? (
          <SeriesPosts posts={summaries} />
        ) : (
          <p className="body-kr" style={{ color: 'var(--mute)' }}>
            아직 이 시리즈에 글이 없어요.
          </p>
        )}
      </section>
    </>
  )
}
