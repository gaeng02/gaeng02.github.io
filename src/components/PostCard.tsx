import Link from 'next/link'
import { Post } from '@/lib/content'
import { withBasePath } from '@/lib/utils'
import Image from 'next/image'

interface PostCardProps {
  post: Post
  showCategory?: boolean
}

export default function PostCard({ post, showCategory = false }: PostCardProps) {
  const categoryLabels: Record<Post['category'], string> = {
    book: 'Book',
    paper: 'Paper',
    'try-tech': 'Try Tech',
    memoir: 'Memoir',
  }

  const getPostUrl = () => {
    return withBasePath(`/${post.category}/${post.slug}`)
  }

  return (
    <Link href={getPostUrl()} className="block group">
      <article className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
        {post.cover && (
          <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        )}
        <div className="space-y-2">
          {showCategory && (
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
              {categoryLabels[post.category]}
            </span>
          )}
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
          <div className="flex items-center justify-between pt-2">
            <time className="text-xs text-gray-500">{post.date}</time>
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
