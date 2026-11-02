import FeedRow from './FeedRow'
import type { PostSummary } from '@/lib/posts'

/** Posts in a series, always newest first. */
export default function SeriesPosts({ posts }: { posts: PostSummary[] }) {
  const ordered = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return (
    <>
      <div className="row between items-center" style={{ marginBottom: 8 }}>
        <span className="label">{posts.length} articles</span>
      </div>
      <ul className="feed-list">
        {ordered.map((p, i) => (
          <FeedRow key={`${p.category}/${p.slug}`} post={p} first={i === 0} showTags={false} />
        ))}
      </ul>
    </>
  )
}
