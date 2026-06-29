import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/content'
import { getAllSeriesWithPosts } from '@/lib/series'
import { CATEGORIES, CATEGORY_META } from '@/lib/categories'
import { toPostSummary } from '@/lib/posts'
import { SITE, absoluteUrl } from '@/lib/site'
import HomeHeroSearch from '@/components/HomeHeroSearch'
import HomeFeed from '@/components/HomeFeed'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const posts = getAllPosts()
  const summaries = posts.map((p) => toPostSummary(p))
  const series = getAllSeriesWithPosts()

  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c, posts.filter((p) => p.category === c).length])
  ) as Record<string, number>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    inLanguage: 'ko-KR',
    author: { '@type': 'Person', name: SITE.author, url: SITE.url },
    blogPost: posts.slice(0, 10).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      url: absoluteUrl(`/${p.category}/${p.slug}`),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HERO — search + category jumps */}
      <section className="px" style={{ paddingTop: 88, paddingBottom: 56 }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <h1 className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            {SITE.name} — 책 · 논문 · 시도 · 회고
          </h1>
          <HomeHeroSearch />
        </div>

        <div className="row gap-12 center wrap-flex" style={{ marginTop: 28 }}>
          {CATEGORIES.map((c) => {
            const meta = CATEGORY_META[c]
            return (
              <Link
                key={c}
                href={meta.href}
                className="row items-center gap-10"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  padding: '11px 18px',
                  border: '1px solid var(--rule)',
                  borderRadius: 12,
                  color: 'var(--ink)',
                }}
              >
                <span className={`cat-dot ${meta.accent}`} style={{ width: 9, height: 9 }} aria-hidden />
                <span style={{ fontWeight: 600 }}>{meta.label}</span>
                <span style={{ color: 'var(--mute-2)' }}>{counts[c]}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <hr className="rule-thick px" style={{ marginLeft: 'var(--page-px)', marginRight: 'var(--page-px)' }} />

      {/* FEED */}
      <section className="px" style={{ paddingTop: 8, paddingBottom: 64 }}>
        <HomeFeed posts={summaries} />
      </section>

      {/* ARTICLE SERIES */}
      {series.length > 0 && (
        <section className="px" style={{ paddingTop: 64, paddingBottom: 64, borderTop: '2px solid var(--ink)' }}>
          <div className="row between items-baseline" style={{ marginBottom: 32 }}>
            <h2 className="h-display" style={{ fontSize: 48, margin: 0 }}>
              Article Series
            </h2>
            <Link className="label ulink" href="/series">
              view all →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {series.map((s) => (
              <Link
                key={s.slug}
                className="card"
                href={`/series/${s.slug}`}
                style={{ padding: 26, display: 'flex', flexDirection: 'column', minHeight: 200 }}
              >
                <h3 className="title-lg" style={{ fontSize: 24, margin: '0 0 12px' }}>
                  {s.title}
                </h3>
                <p className="body-kr" style={{ fontSize: 15, margin: 0, flex: 1 }}>
                  {s.description}
                </p>
                <div className="label" style={{ marginTop: 18, color: 'var(--ink-2)' }}>
                  {s.posts.length} articles
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
