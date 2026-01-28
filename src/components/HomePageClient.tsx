'use client'

import { useState, useMemo } from 'react'
import Header from './Header'
import MainContent from './MainContent'
import type { Post } from '@/lib/content'
import type { AboutData } from '@/lib/about'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir' | 'about'

interface HomePageClientProps {
  postsByCategory: {
    book: Post[]
    paper: Post[]
    'try-tech': Post[]
    memoir: Post[]
  }
  aboutData: AboutData
  aboutDetailContents: Record<string, string>
}

export default function HomePageClient({ postsByCategory, aboutData, aboutDetailContents }: HomePageClientProps) {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleMenuClick = (menu: MenuItem) => {
    setSelectedMenu(menu)
    // 메뉴 클릭 시 검색어 초기화
    setSearchQuery('')
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    // 검색 시 메뉴 선택 해제
    if (query) {
      setSelectedMenu(null)
    }
  }

  // 모든 포스트를 하나의 배열로 합치기
  const allPosts = useMemo(() => {
    return [
      ...postsByCategory.book,
      ...postsByCategory.paper,
      ...postsByCategory['try-tech'],
      ...postsByCategory.memoir,
    ]
  }, [postsByCategory])

  // 검색어로 필터링
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase().trim()
    return allPosts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(query)
      const descriptionMatch = post.description.toLowerCase().includes(query)
      const tagsMatch = post.tags?.some((tag) => tag.toLowerCase().includes(query)) || false
      return titleMatch || descriptionMatch || tagsMatch
    })
  }, [searchQuery, allPosts])

  const getPostsForMenu = (menu: MenuItem | null): Post[] => {
    if (!menu || menu === 'about') return []
    return postsByCategory[menu] || []
  }

  // 검색 중이면 검색 결과, 아니면 메뉴별 포스트
  const displayPosts = searchQuery.trim() ? filteredPosts : getPostsForMenu(selectedMenu)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeMenu={selectedMenu || undefined} 
        onMenuClick={handleMenuClick}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <MainContent 
        selectedMenu={searchQuery.trim() ? null : selectedMenu}
        posts={displayPosts}
        searchQuery={searchQuery.trim()}
        aboutData={aboutData}
        aboutDetailContents={aboutDetailContents}
      />
    </div>
  )
}
