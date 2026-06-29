import Link from 'next/link'
import { CatPill } from './CatPill'
import { formatDot } from '@/lib/dateUtils'
import { postUrl, type PostSummary } from '@/lib/posts'

export default function FeedRow({
  post,
  first = false,
  showTags = true,
}: {
  post: PostSummary
  first?: boolean
  showTags?: boolean
}) {
  const href = postUrl(post.category, post.slug)
  const hasImg = !!post.cover
  return (
    <li className={`feed-row${first ? ' first' : ''}${hasImg ? '' : ' no-img'}`}>
      <div>
        <div className="row gap-12 items-center" style={{ marginBottom: 12 }}>
          <CatPill category={post.category} />
          <span className="label">{formatDot(post.date)}</span>
        </div>
        <h3 className="title-lg" style={{ fontSize: 27, margin: '0 0 10px' }}>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.description && (
          <p className="body-kr" style={{ fontSize: 15.5, margin: '0 0 14px', maxWidth: 620 }}>
            {post.description}
          </p>
        )}
        {showTags && post.tags.length > 0 && (
          <div className="row gap-8 wrap-flex">
            {post.tags.map((t) => (
              <span key={t} className="tag-flat">#{t}</span>
            ))}
          </div>
        )}
      </div>
      {hasImg && (
        <Link href={href} aria-hidden tabIndex={-1}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cover" src={post.cover} alt="" loading="lazy" />
        </Link>
      )}
    </li>
  )
}
