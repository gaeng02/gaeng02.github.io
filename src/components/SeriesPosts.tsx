'use client'

import { useMemo, useState } from 'react'
import FeedRow from './FeedRow'
import type { PostSummary } from '@/lib/posts'

export default function SeriesPosts({ posts }: { posts: PostSummary[] }) {
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest')

  const ordered = useMemo(() => {
    const arr = [...posts]
    arr.sort((a, b) => {
      const d = new Date(a.date).getTime() - new Date(b.date).getTime()
      return sort === 'newest' ? -d : d
    })
    return arr
  }, [posts, sort])

  return (
    <>
      <div className="row between items-center" style={{ marginBottom: 8 }}>
        <span className="label">{posts.length} articles</span>
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value as 'newest' | 'oldest')}
          aria-label="정렬"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      <ul className="feed-list">
        {ordered.map((p, i) => (
          <FeedRow key={`${p.category}/${p.slug}`} post={p} first={i === 0} showTags={false} />
        ))}
      </ul>
    </>
  )
}
