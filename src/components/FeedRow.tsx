import Link from 'next/link'
import { CatPill } from './CatPill'
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
        <div className="row gap-8 items-center wrap-flex" style={{ marginBottom: 12 }}>
          <CatPill category={post.category} />
          {showTags && post.tags.map((t) => (
            <span key={t} className="tag-flat">#{t}</span>
          ))}
        </div>
        <h3 className="title-lg" style={{ fontSize: 27, margin: '0 0 10px' }}>
          <Link href={href}>{post.title}</Link>
        </h3>
        {post.description && (
          <p className="body-kr" style={{ fontSize: 15.5, margin: 0, maxWidth: 620 }}>
            {post.description}
          </p>
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
