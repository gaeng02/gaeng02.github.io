import fs from 'fs'
import path from 'path'
import { getAllPosts, type Post } from './content'

const seriesFilePath = path.join(process.cwd(), 'content', 'series.json')

export interface SeriesPost {
  category: string
  slug: string
}

export interface Series {
  slug: string
  title: string
  description: string
  /** editorial "Series Note" pull-quote shown on the series detail page */
  note?: string
  /** optional cover image path */
  cover?: string
  posts: SeriesPost[]
}

export interface SeriesData {
  series: Series[]
}

export interface SeriesWithPosts extends Omit<Series, 'posts'> {
  posts: Post[]
}

/** Ordered, de-duplicated list of categories present in a series. */
export function seriesCategoryMix(series: SeriesWithPosts): Post['category'][] {
  const seen = new Set<Post['category']>()
  series.posts.forEach((p) => seen.add(p.category))
  return Array.from(seen)
}

// Series 목록 가져오기
export function getAllSeries(): Series[] {
  try {
    const fileContents = fs.readFileSync(seriesFilePath, 'utf8')
    const data: SeriesData = JSON.parse(fileContents)
    return data.series || []
  } catch (error) {
    console.error('Error reading series.json:', error)
    return []
  }
}

// slug로 Series 가져오기
export function getSeriesBySlug(slug: string): Series | null {
  const allSeries = getAllSeries()
  return allSeries.find((s) => s.slug === slug) || null
}

// Series에 포함된 포스트들 가져오기
export function getSeriesWithPosts(slug: string): SeriesWithPosts | null {
  const series = getSeriesBySlug(slug)
  if (!series) return null

  const allPosts = getAllPosts()
  const posts: Post[] = []

  series.posts.forEach((seriesPost) => {
    const post = allPosts.find(
      (p) => p.category === seriesPost.category && p.slug === seriesPost.slug
    )
    if (post) {
      posts.push(post)
    }
  })

  return {
    ...series,
    posts,
  }
}

// 모든 Series와 포함된 포스트들 가져오기
export function getAllSeriesWithPosts(): SeriesWithPosts[] {
  const allSeries = getAllSeries()
  const allPosts = getAllPosts()

  return allSeries.map((series) => {
    const posts: Post[] = []

    series.posts.forEach((seriesPost) => {
      const post = allPosts.find(
        (p) => p.category === seriesPost.category && p.slug === seriesPost.slug
      )
      if (post) {
        posts.push(post)
      }
    })

    return {
      ...series,
      posts,
    }
  })
}

// 특정 포스트가 속한 시리즈 찾기
export function getSeriesForPost(category: string, slug: string): SeriesWithPosts | null {
  const all = getAllSeriesWithPosts()
  return (
    all.find((s) => s.posts.some((p) => p.category === category && p.slug === slug)) || null
  )
}

export interface SeriesNav {
  series: { slug: string; title: string }
  prev: Post | null // 시간상 이전(더 오래된) 글
  next: Post | null // 시간상 다음(더 최신) 글
}

// 시리즈 내 이전/다음 글 (날짜 오름차순 기준)
export function getPostSeriesNav(category: string, slug: string): SeriesNav | null {
  const series = getSeriesForPost(category, slug)
  if (!series) return null

  const ordered = [...series.posts].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const idx = ordered.findIndex((p) => p.category === category && p.slug === slug)
  if (idx === -1) return null

  return {
    series: { slug: series.slug, title: series.title },
    prev: idx > 0 ? ordered[idx - 1] : null,
    next: idx < ordered.length - 1 ? ordered[idx + 1] : null,
  }
}
