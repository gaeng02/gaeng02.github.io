import { readPosts } from '../../lib/content.cjs'

export type Category = 'book' | 'paper' | 'try-tech' | 'memoir'
export interface Post {
  title: string
  date: string
  updatedAt?: string
  description: string
  category: Category
  tags: string[]
  cover?: string
  slug: string
  content: string
  filePath: string
}

export function getAllPosts(): Post[] { return readPosts() as Post[] }
export function getPostsByCategory(category: Category): Post[] {
  return getAllPosts().filter((post) => post.category === category)
}
export function getPostBySlug(category: Category, slug: string): Post | null {
  return getPostsByCategory(category).find((post) => post.slug === slug) || null
}
