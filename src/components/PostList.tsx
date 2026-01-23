import Link from 'next/link'
import { Post } from '@/lib/content'
import { withBasePath } from '@/lib/utils'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  const categoryLabels: Record<Post['category'], string> = {
    book: 'Book',
    paper: 'Paper',
    'try-tech': 'Try Tech',
    memoir: 'Memoir',
  }

  const getPostUrl = (post: Post) => {
    if (post.category === 'book' || post.category === 'paper') {
      return withBasePath(`/${post.category}/${post.slug}`)
    } else {
      return withBasePath(`/${post.category}/${post.slugPath.join('/')}`)
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={getPostUrl(post)}
          className="block group py-4 border-b border-gray-200 hover:bg-gray-50 px-4 -mx-4 rounded-lg transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2.5 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
                  {categoryLabels[post.category]}
                </span>
                <time className="text-xs text-gray-500">{post.date}</time>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                {post.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">{post.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
