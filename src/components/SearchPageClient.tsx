'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { CATEGORIES, CATEGORY_META, type Category } from '@/lib/categories'
import {
  loadSearchIndex,
  searchItems,
  splitHighlight,
  type SearchItem,
} from '@/lib/searchClient'

function Highlighted({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitHighlight(text, query).map((p, i) =>
        p.hit ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>
      )}
    </>
  )
}

type Filter = 'all' | Category

export default function SearchPageClient() {
  const params = useSearchParams()
  const [items, setItems] = useState<SearchItem[]>([])
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const [filter, setFilter] = useState<Filter>('all')
  const [shown, setShown] = useState(8)

  useEffect(() => {
    loadSearchIndex().then(setItems)
  }, [])

  // read q from the URL (e.g. arriving from a tag link), but only when it
  // actually differs — otherwise the writeback effect below would ping-pong
  // with useSearchParams (Next tracks history.replaceState) in an endless loop.
  useEffect(() => {
    const q = params.get('q') ?? ''
    setQuery((prev) => (prev === q ? prev : q))
  }, [params])

  // keep the URL shareable as the user types; skip if it already matches
  useEffect(() => {
    setShown(8)
    const url = new URL(window.location.href)
    const current = url.searchParams.get('q') ?? ''
    if (current === query) return
    if (query) url.searchParams.set('q', query)
    else url.searchParams.delete('q')
    window.history.replaceState(null, '', url.toString())
  }, [query])

  const all = useMemo(() => searchItems(items, query), [items, query])
  const seriesResults = useMemo(() => all.filter((r) => r.type === 'series'), [all])
  const postResults = useMemo(() => all.filter((r) => r.type === 'post'), [all])

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: postResults.length }
    CATEGORIES.forEach((cat) => (c[cat] = 0))
    postResults.forEach((r) => {
      if (r.category) c[r.category] += 1
    })
    return c
  }, [postResults])

  const filteredPosts =
    filter === 'all' ? postResults : postResults.filter((r) => r.category === filter)
  const visiblePosts = filteredPosts.slice(0, shown)
  const hasQuery = query.trim() !== ''

  return (
    <section className="px" style={{ paddingTop: 40, paddingBottom: 80 }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div
          className="row items-center gap-12"
          style={{ border: '1.5px solid var(--ink)', borderRadius: 14, background: 'var(--paper)', padding: '16px 22px' }}
        >
          <span className="hero-glyph" aria-hidden>⌕</span>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 시리즈, 태그로 검색…"
            aria-label="검색어"
            style={{
              flex: 1,
              border: 0,
              outline: 0,
              background: 'transparent',
              fontFamily: 'var(--serif-kr)',
              fontSize: 22,
              color: 'var(--ink)',
            }}
          />
          {hasQuery && <span className="label">{all.length} results</span>}
        </div>

        {hasQuery && (
          <div className="row gap-8 wrap-flex items-center" style={{ marginTop: 16 }}>
            <FilterChip label="all" count={counts.all} active={filter === 'all'} onClick={() => setFilter('all')} />
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat}
                label={CATEGORY_META[cat].label.toLowerCase()}
                count={counts[cat]}
                active={filter === cat}
                onClick={() => setFilter(cat)}
              />
            ))}
          </div>
        )}

        {!hasQuery && (
          <p className="body-kr" style={{ marginTop: 32, color: 'var(--mute)' }}>
            검색어를 입력하면 제목 · 설명 · 태그 · 시리즈에서 찾아드려요.
          </p>
        )}

        {hasQuery && all.length === 0 && (
          <p className="body-kr" style={{ marginTop: 32, color: 'var(--mute)' }}>
            ‘{query}’에 대한 결과가 없어요. 다른 키워드로 시도해 보세요.
          </p>
        )}

        {/* SERIES */}
        {hasQuery && filter === 'all' && seriesResults.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <div className="label label--ink" style={{ marginBottom: 8 }}>
              SERIES — {seriesResults.length}
            </div>
            {seriesResults.map((s) => (
              <Link key={s.url} className="card" href={s.url} style={{ padding: 18, marginBottom: 14 }}>
                <div className="label">SERIES{s.categories?.length ? ` · ${s.categories.join(' · ')}` : ''}</div>
                <h3 className="title-lg" style={{ fontSize: 22, margin: '6px 0' }}>
                  <Highlighted text={s.title} query={query} />
                </h3>
                {s.description && (
                  <p className="body-kr" style={{ fontSize: 14, margin: 0 }}>
                    <Highlighted text={s.description} query={query} />
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* POSTS */}
        {hasQuery && filteredPosts.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div className="label label--ink" style={{ marginBottom: 8 }}>
              POSTS — {visiblePosts.length} of {filteredPosts.length}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {visiblePosts.map((r) => (
                <li key={r.url} style={{ borderTop: '1px solid var(--rule)' }}>
                  <Link
                    href={r.url}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: 16,
                      padding: '18px 0',
                      alignItems: 'baseline',
                    }}
                  >
                    <span className={`cat-pill ${CATEGORY_META[r.category!].accent}`}>
                      {CATEGORY_META[r.category!].label}
                    </span>
                    <span>
                      <span style={{ fontFamily: 'var(--serif-kr)', fontSize: 17, color: 'var(--ink)', lineHeight: 1.4, display: 'block' }}>
                        <Highlighted text={r.title} query={query} />
                      </span>
                      {(r.description || r.excerpt) && (
                        <span className="body-kr" style={{ fontSize: 13, color: 'var(--mute)', display: 'block', marginTop: 4 }}>
                          <Highlighted text={r.description || r.excerpt} query={query} />
                        </span>
                      )}
                    </span>
                    <span className="label" style={{ textAlign: 'right' }}>{r.date?.slice(0, 10)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {shown < filteredPosts.length && (
              <div style={{ marginTop: 28, textAlign: 'center' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShown((s) => s + 10)}>
                  SHOW {Math.min(10, filteredPosts.length - shown)} MORE
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={`tag-chip${active ? ' active' : ''}`} onClick={onClick}>
      {label} <span className="n">{count}</span>
    </button>
  )
}
