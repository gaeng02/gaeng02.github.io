'use client'

import { withBasePath } from './utils'
import type { Category } from './content'

export interface SearchItem {
  type: 'post' | 'series'
  category?: Category
  slug: string
  title: string
  description: string
  date?: string
  tags: string[]
  url: string
  excerpt: string
  series?: { slug: string; title: string } | null
  categories?: Category[] // for series: category mix
}

let cache: SearchItem[] | null = null
let inflight: Promise<SearchItem[]> | null = null

export async function loadSearchIndex(): Promise<SearchItem[]> {
  if (cache) return cache
  if (inflight) return inflight
  inflight = fetch(withBasePath('/search-index.json'))
    .then((r) => (r.ok ? r.json() : []))
    .then((data: SearchItem[]) => {
      cache = Array.isArray(data) ? data : []
      return cache
    })
    .catch(() => {
      cache = []
      return cache
    })
  return inflight
}

export interface ScoredItem extends SearchItem {
  score: number
}

/** Rank items against a query. Returns matches sorted by score then date. */
export function searchItems(items: SearchItem[], rawQuery: string): ScoredItem[] {
  const q = rawQuery.trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)

  const scored: ScoredItem[] = []
  for (const it of items) {
    const title = it.title.toLowerCase()
    const desc = it.description.toLowerCase()
    const tags = it.tags.map((t) => t.toLowerCase())
    const excerpt = it.excerpt.toLowerCase()

    let score = 0
    let matchedAll = true
    for (const term of terms) {
      let termScore = 0
      if (title.startsWith(term)) termScore += 12
      else if (title.includes(term)) termScore += 8
      if (tags.some((t) => t === term)) termScore += 7
      else if (tags.some((t) => t.includes(term))) termScore += 4
      if (desc.includes(term)) termScore += 3
      if (excerpt.includes(term)) termScore += 1
      if (termScore === 0) {
        matchedAll = false
        break
      }
      score += termScore
    }
    if (!matchedAll) continue
    if (it.type === 'series') score += 2 // surface series a touch higher
    scored.push({ ...it, score })
  }

  return scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return (b.date ?? '').localeCompare(a.date ?? '')
  })
}

export interface HighlightPart {
  text: string
  hit: boolean
}

/** Split text into highlighted / plain parts for the first matching term. */
export function splitHighlight(text: string, rawQuery: string): HighlightPart[] {
  const terms = rawQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
  if (!terms.length || !text) return [{ text, hit: false }]

  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`(${escaped.join('|')})`, 'ig')
  const parts = text.split(re)
  return parts
    .filter((p) => p !== '')
    .map((p) => ({ text: p, hit: terms.includes(p.toLowerCase()) }))
}
