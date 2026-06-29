'use client'

import { useState } from 'react'
import FeedRow from './FeedRow'
import Pagination from './Pagination'
import type { PostSummary } from '@/lib/posts'

export default function HomeFeed({
  posts,
  pageSize = 8,
}: {
  posts: PostSummary[]
  pageSize?: number
}) {
  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize))
  const start = (page - 1) * pageSize
  const visible = posts.slice(start, start + pageSize)

  function go(next: number) {
    setPage(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (posts.length === 0) {
    return (
      <p className="body-kr" style={{ color: 'var(--mute)' }}>
        아직 발행된 글이 없어요.
      </p>
    )
  }

  return (
    <>
      <ul className="feed-list">
        {visible.map((p, i) => (
          <FeedRow key={`${p.category}/${p.slug}`} post={p} first={i === 0} />
        ))}
      </ul>
      <Pagination page={page} pageCount={pageCount} onChange={go} />
    </>
  )
}
