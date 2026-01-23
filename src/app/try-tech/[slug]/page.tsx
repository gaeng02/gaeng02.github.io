import { getPostBySlug, getAllPosts } from '@/lib/content'
import MarkdownContent from '@/components/MarkdownContent'
import { notFound } from 'next/navigation'
import { withBasePath } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts
    .filter((post) => post.category === 'try-tech')
    .map((post) => ({
      slug: post.slug,
    }))
}

export default async function TryTechPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug('try-tech', slug)

  if (!post) {
    notFound()
  }

  return (
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
              Try Tech
            </span>
            {post.topic && (
              <span className="px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full">
                {post.topic.toUpperCase()}
              </span>
            )}
            {post.subtopic && (
              <span className="px-3 py-1 text-xs text-gray-700 bg-gray-100 rounded-full">
                {post.subtopic}
              </span>
            )}
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
  )
}
