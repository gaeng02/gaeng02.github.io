import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/content'
import { getPostSeriesNav } from '@/lib/series'
import { renderMarkdown } from '@/lib/markdown'
import { CATEGORY_META, type Category } from '@/lib/categories'
import { formatDot } from '@/lib/dateUtils'
import { SITE, absoluteUrl } from '@/lib/site'
import CatPill from './CatPill'
import ProseHtml from './ProseHtml'
import ArticleToc from './ArticleToc'
import CopyLinkButton from './CopyLinkButton'

export default async function ArticleScreen({
  category,
  slug,
}: {
  category: Category
  slug: string
}) {
  const post = getPostBySlug(category, slug)
  if (!post) notFound()

  const { html, toc } = await renderMarkdown(post.content)
  const nav = getPostSeriesNav(category, slug)
  const meta = CATEGORY_META[category]
  const url = absoluteUrl(`/${category}/${slug}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.cover ? absoluteUrl(post.cover) : undefined,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'ko-KR',
    author: { '@type': 'Person', name: SITE.author, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags?.join(', '),
    articleSection: meta.label,
    url,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url },
      { '@type': 'ListItem', position: 2, name: meta.label, item: absoluteUrl(meta.href) },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <article>
        {/* HEAD */}
        <section className="px" style={{ paddingTop: 72, paddingBottom: 28 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Link className="btn" href={meta.href} style={{ marginBottom: 28 }}>
              ← {meta.label} 목록으로 돌아가기
            </Link>

            <div className="row gap-12 items-center wrap-flex" style={{ marginBottom: 22 }}>
              <CatPill category={category} />
              {nav && (
                <>
                  <span className="label">└ in series:</span>
                  <Link
                    href={`/series/${nav.series.slug}`}
                    className={`cat-text ${meta.accent}`}
                    style={{ fontFamily: 'var(--serif-kr)', fontSize: 14 }}
                  >
                    {nav.series.title}
                  </Link>
                </>
              )}
              <div className="grow" />
              <span className="label">{formatDot(post.date)}</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--serif-kr)',
                fontWeight: 500,
                letterSpacing: '-0.015em',
                fontSize: 'clamp(32px, 5vw, 52px)',
                margin: '0 0 18px',
                lineHeight: 1.25,
                maxWidth: 880,
                color: 'var(--ink)',
              }}
            >
              {post.title}
            </h1>

            {post.description && (
              <p className="body-kr" style={{ fontSize: 19, maxWidth: 720, color: 'var(--ink-2)', margin: '0 0 20px' }}>
                {post.description}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="row gap-8 wrap-flex">
                {post.tags.map((t) => (
                  <Link key={t} className="tag-chip" href={`/search?q=${encodeURIComponent(t)}`}>
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* BODY */}
        <section className="px" style={{ paddingTop: 20, paddingBottom: 64 }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>
              <ArticleToc items={toc} />
              <ProseHtml html={html} />

              <div style={{ marginTop: 48, paddingTop: 28, borderTop: '1px solid var(--rule)' }}>
                <div className="label label--ink" style={{ marginBottom: 14 }}>
                  Share
                </div>
                <CopyLinkButton url={url} />
              </div>
            </div>
          </div>
        </section>

        {/* prev / next within series */}
        {nav && (nav.prev || nav.next) && (
          <section className="px" style={{ paddingBottom: 24 }}>
            <div
              style={{
                maxWidth: 1000,
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 24,
              }}
            >
              {nav.prev ? (
                <Link className="card" href={`/${nav.prev.category}/${nav.prev.slug}`} style={{ padding: 22 }}>
                  <div className="label">← PREVIOUS · 시리즈</div>
                  <div style={{ fontFamily: 'var(--serif-kr)', fontSize: 18, color: 'var(--ink)', marginTop: 8 }}>
                    {nav.prev.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
              {nav.next ? (
                <Link className="card" href={`/${nav.next.category}/${nav.next.slug}`} style={{ padding: 22, textAlign: 'right' }}>
                  <div className="label">NEXT · 시리즈 →</div>
                  <div style={{ fontFamily: 'var(--serif-kr)', fontSize: 18, color: 'var(--ink)', marginTop: 8 }}>
                    {nav.next.title}
                  </div>
                </Link>
              ) : (
                <span />
              )}
            </div>
          </section>
        )}

        {/* back to list */}
        <section className="px" style={{ paddingTop: 12, paddingBottom: 64, textAlign: 'center' }}>
          <Link className="btn" href={meta.href}>
            ← {meta.label} 목록으로 돌아가기
          </Link>
        </section>
      </article>
    </>
  )
}
