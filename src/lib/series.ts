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
  posts: SeriesPost[]
}

export interface SeriesData {
  series: Series[]
}

export interface SeriesWithPosts extends Omit<Series, 'posts'> {
  posts: Post[]
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
