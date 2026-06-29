import Link from 'next/link'
import { formatDot } from '@/lib/dateUtils'
import { postUrl, type PostSummary } from '@/lib/posts'

export default function CatRow({
  post,
  first = false,
}: {
  post: PostSummary
  first?: boolean
}) {
  const href = postUrl(post.category, post.slug)
  const hasImg = !!post.cover
  const primaryTag = post.tags[0]
  return (
    <li className={`cat-row${first ? ' first' : ''}${hasImg ? '' : ' no-img'}`}>
      <div>
        {primaryTag && <span className="tag-chip" style={{ cursor: 'default' }}>#{primaryTag}</span>}
        <h3 className="title-lg" style={{ fontSize: 25, margin: '14px 0 0' }}>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.description && (
          <p className="body-kr" style={{ fontSize: 15, margin: '10px 0 0', maxWidth: 620 }}>
            {post.description}
          </p>
        )}
        <div className="label" style={{ marginTop: 14 }}>{formatDot(post.date)}</div>
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
