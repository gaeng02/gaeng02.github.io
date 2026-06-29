import Link from 'next/link'
import type { Metadata } from 'next'
import { getPostsGroupedByYearAndMonth } from '@/lib/archives'
import { CatPill } from '@/components/CatPill'
import { formatDot } from '@/lib/dateUtils'
import { postUrl } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Archives',
  description: '지금까지 쓴 모든 글을 연도별로 모았습니다.',
  alternates: { canonical: '/archives' },
  openGraph: { title: 'Archives', description: '지금까지 쓴 모든 글을 연도별로 모았습니다.', url: '/archives' },
}

export default function ArchivesPage() {
  const yearGroups = getPostsGroupedByYearAndMonth()
  const total = yearGroups.reduce((n, y) => n + y.totalCount, 0)

  return (
    <>
      <section className="px" style={{ paddingTop: 72, paddingBottom: 16 }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 8vw, 76px)', margin: '0 0 14px' }}>
          Archives
        </h1>
        <p className="body-kr" style={{ margin: 0, fontSize: 16 }}>
          지금까지 쓴 모든 글 — 총 {total}편.
        </p>
      </section>

      <section className="px" style={{ paddingBottom: 72 }}>
        {yearGroups.length === 0 ? (
          <p className="body-kr" style={{ color: 'var(--mute)' }}>아직 글이 없어요.</p>
        ) : (
          yearGroups.map((year) => (
            <div key={year.year} style={{ borderTop: '2px solid var(--ink)', paddingTop: 24, marginTop: 28 }}>
              <div className="row between items-baseline" style={{ marginBottom: 8 }}>
                <h2 className="h-display" style={{ fontSize: 40, margin: 0 }}>{year.year}</h2>
                <span className="label">{year.totalCount} posts</span>
              </div>

              {year.months.map((month) => (
                <div key={month.month} style={{ marginTop: 18 }}>
                  <div className="label" style={{ marginBottom: 6 }}>{month.monthName}</div>
                  <ul className="feed-list">
                    {month.posts.map((post) => (
                      <li
                        key={`${post.category}/${post.slug}`}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'auto 1fr auto',
                          gap: 16,
                          padding: '12px 0',
                          borderTop: '1px solid var(--rule)',
                          alignItems: 'baseline',
                        }}
                      >
                        <CatPill category={post.category} />
                        <Link
                          href={postUrl(post.category, post.slug)}
                          style={{ fontFamily: 'var(--serif-kr)', fontSize: 16, color: 'var(--ink)', lineHeight: 1.4 }}
                        >
                          {post.title}
                        </Link>
                        <span className="label" style={{ textAlign: 'right' }}>{formatDot(post.date)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ))
        )}
      </section>
    </>
  )
}
