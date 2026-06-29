import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllSeriesWithPosts, seriesCategoryMix } from '@/lib/series'
import { CATEGORY_META } from '@/lib/categories'
import { absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Article Series',
  description: '연재 형태로 묶은 글 모음. 한 주제를 여러 갈래로 이어 읽어보세요.',
  alternates: { canonical: '/series' },
  openGraph: {
    title: 'Article Series',
    description: '연재 형태로 묶은 글 모음. 한 주제를 여러 갈래로 이어 읽어보세요.',
    url: '/series',
  },
}

export default function SeriesIndexPage() {
  const series = getAllSeriesWithPosts()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Article Series',
    url: absoluteUrl('/series'),
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: series.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/series/${s.slug}`),
        name: s.title,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="px" style={{ paddingTop: 72, paddingBottom: 24 }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 8vw, 76px)', margin: 0 }}>
          Article Series
        </h1>
      </section>

      <section className="px" style={{ paddingTop: 12, paddingBottom: 64 }}>
        <hr className="rule-thick" />
        {series.length === 0 ? (
          <p className="body-kr" style={{ color: 'var(--mute)', marginTop: 24 }}>
            아직 시리즈가 없어요.
          </p>
        ) : (
          <ul className="feed-list">
            {series.map((s) => {
              const mix = seriesCategoryMix(s)
              const hasImg = !!s.cover
              return (
                <li key={s.slug} className={`series-row${hasImg ? '' : ' no-img'}`}>
                  {hasImg && (
                    <Link href={`/series/${s.slug}`} aria-hidden tabIndex={-1}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="cover" src={s.cover} alt="" loading="lazy" />
                    </Link>
                  )}
                  <div>
                    {mix.length > 0 && (
                      <div className="label" style={{ marginBottom: 8 }}>
                        {mix.map((c) => CATEGORY_META[c].label).join(' · ')}
                      </div>
                    )}
                    <h2 className="title-lg" style={{ fontSize: 28, margin: '0 0 10px' }}>
                      <Link href={`/series/${s.slug}`}>{s.title}</Link>
                    </h2>
                    <p className="body-kr" style={{ fontSize: 15.5, margin: '0 0 12px', maxWidth: 620 }}>
                      {s.description}
                    </p>
                    <div className="label" style={{ color: 'var(--ink-2)' }}>
                      {s.posts.length} articles
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}
