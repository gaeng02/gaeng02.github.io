'use client'

import { useState, useMemo } from 'react'
import Header from './Header'
import MainContent from './MainContent'
import type { Post } from '@/lib/content'

type MenuItem = 'series' | 'book' | 'paper' | 'try-tech' | 'memoir'

interface CategoryPageClientProps {
  category: 'book' | 'paper' | 'try-tech' | 'memoir'
  posts: Post[]
}

export default function CategoryPageClient({ category, posts }: CategoryPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  // 검색어로 필터링
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts

    const query = searchQuery.toLowerCase().trim()
    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query)
      const descriptionMatch = post.description.toLowerCase().includes(query)
      const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query)) || false
      return titleMatch || descriptionMatch || tagsMatch
    })
  }, [searchQuery, posts])

  const displayPosts = searchQuery.trim() ? filteredPosts : posts

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeMenu={category} 
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <MainContent 
        selectedMenu={searchQuery.trim() ? null : category}
        posts={displayPosts}
        searchQuery={searchQuery.trim()}
      />
    </div>
  )
}
