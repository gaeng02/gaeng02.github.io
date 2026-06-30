'use client'

import { useEffect, useMemo, useState } from 'react'
import CatRow from './CatRow'
import Pagination from './Pagination'
import type { PostSummary, TagCount } from '@/lib/posts'

type Sort = 'recent' | 'longest' | 'shortest'
const PAGE_SIZE = 8

export default function CategoryView({
  posts,
  tags,
}: {
  posts: PostSummary[]
  tags: TagCount[]
}) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sort, setSort] = useState<Sort>('recent')
  const [open, setOpen] = useState(false)
  const [page, setPage] = useState(1)

  // restore tag from URL on first load
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('tag')
    if (t) {
      setActiveTag(t)
      setOpen(true)
    }
  }, [])

  function selectTag(tag: string | null) {
    setActiveTag(tag)
    setPage(1)
    const url = new URL(window.location.href)
    if (tag) url.searchParams.set('tag', tag)
    else url.searchParams.delete('tag')
    window.history.replaceState(null, '', url.toString())
  }

  const filtered = useMemo(
    () => (activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  )

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'recent') arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    else if (sort === 'longest') arr.sort((a, b) => (b.length ?? 0) - (a.length ?? 0))
    else arr.sort((a, b) => (a.length ?? 0) - (b.length ?? 0))
    return arr
  }, [filtered, sort])

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const visible = sorted.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <>
      {/* tag toggle bar */}
      <div
        className="px row items-center gap-16"
        style={{
          padding: '14px var(--page-px)',
          borderTop: '1px solid var(--rule)',
          borderBottom: open ? 0 : '1px solid var(--rule)',
          background: open ? 'var(--bg-2)' : 'transparent',
        }}
      >
        <button
          type="button"
          className={open ? 'btn btn-solid' : 'btn btn-outline'}
          style={{ padding: '9px 16px', borderRadius: 10 }}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? '▾  Tags' : '▸  Tags'}
        </button>
        <div className="grow" />
        <select
          className="select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as Sort)
            setPage(1)
          }}
          aria-label="정렬"
        >
          <option value="recent">recent</option>
          <option value="longest">longest</option>
          <option value="shortest">shortest</option>
        </select>
      </div>

      {/* tag drawer — animate grid rows (0fr↔1fr) so it tracks the real
          content height; max-height transitions lag when content is shorter
          than the cap, leaving a dead gap on collapse. */}
      <div
        style={{
          borderBottom: open ? '1px solid var(--rule)' : 0,
          background: 'var(--bg-2)',
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
        <div className="px" style={{ padding: '4px var(--page-px) 26px', display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            className={`tag-chip${activeTag === null ? ' active' : ''}`}
            onClick={() => selectTag(null)}
          >
            전체 <span className="n">{posts.length}</span>
          </button>
          {tags.map(({ tag, count }) => (
            <button
              key={tag}
              type="button"
              className={`tag-chip${tag === activeTag ? ' active' : ''}`}
              onClick={() => selectTag(tag === activeTag ? null : tag)}
            >
              #{tag} <span className="n">{count}</span>
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* post list */}
      <section className="px" style={{ paddingTop: 24, paddingBottom: 64 }}>
        {visible.length === 0 ? (
          <p className="body-kr" style={{ color: 'var(--mute)' }}>
            {activeTag ? `#${activeTag} 태그의 글이 없어요.` : '아직 글이 없어요.'}
          </p>
        ) : (
          <ul className="feed-list">
            {visible.map((p, i) => (
              <CatRow key={`${p.category}/${p.slug}`} post={p} first={i === 0} />
            ))}
          </ul>
        )}
        <Pagination page={safePage} pageCount={pageCount} onChange={setPage} />
      </section>
    </>
  )
}
