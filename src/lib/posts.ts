import type { Post, Category } from './content'

/** Serializable, client-safe view of a post (no file content). */
export interface PostSummary {
  category: Category
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  cover?: string
  series?: { slug: string; title: string } | null
  /** body length (chars) — used for longest/shortest sort */
  length?: number
}

export function toPostSummary(
  post: Post,
  series?: { slug: string; title: string } | null
): PostSummary {
  return {
    category: post.category,
    slug: post.slug,
    title: post.title,
    description: post.description ?? '',
    date: post.date,
    tags: post.tags ?? [],
    cover: post.cover,
    series: series ?? null,
    length: post.content?.length ?? 0,
  }
}

export interface TagCount {
  tag: string
  count: number
}

/** Tag → count, sorted by count desc then name. */
export function aggregateTags(posts: Array<{ tags?: string[] }>): TagCount[] {
  const map = new Map<string, number>()
  posts.forEach((p) => {
    ;(p.tags ?? []).forEach((t) => map.set(t, (map.get(t) ?? 0) + 1))
  })
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
}

export function postUrl(category: Category, slug: string): string {
  return `/${category}/${slug}`
}
