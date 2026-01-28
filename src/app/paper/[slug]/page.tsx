import { getPostBySlug, getAllPosts } from '@/lib/content'
import MarkdownContent from '@/components/MarkdownContent'
import { notFound } from 'next/navigation'
import { withBasePath } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts
    .filter((post) => post.category === 'paper')
    .map((post) => ({
      slug: post.slug,
    }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug('paper', slug)

  if (!post) {
    return {}
  }

  const url = 'https://www.gaeng02.com'
  const postUrl = `${url}/paper/${slug}`
  const ogImage = post.cover ? `${url}${post.cover}` : undefined

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: ogImage ? [{ url: ogImage, alt: post.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function PaperPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug('paper', slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.cover ? `https://www.gaeng02.com${post.cover}` : undefined,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'gaeng02',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Trace of Thought',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.gaeng02.com/paper/${slug}`,
    },
    keywords: post.tags?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href={withBasePath('/')}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          ← 목록으로
        </Link>

        <article className="bg-white rounded-3xl border border-gray-200 p-8 md:p-12 shadow-sm">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <time>{post.date}</time>
            <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
              논문 리뷰
            </span>
          </div>
          {post.description && (
            <p className="text-lg text-gray-700 mb-6">{post.description}</p>
          )}
          {post.cover && (
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-6">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose prose-lg max-w-none">
          <MarkdownContent content={post.content} />
        </div>
      </article>
    </div>
    </>
  )
}
