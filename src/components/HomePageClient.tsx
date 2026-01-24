'use client'

import { useState } from 'react'
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

  const handleMenuClick = (menu: MenuItem) => {
    setSelectedMenu(menu)
  }

  const getPostsForMenu = (menu: MenuItem | null): Post[] => {
    if (!menu || menu === 'about') return []
    return postsByCategory[menu] || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeMenu={selectedMenu || undefined} onMenuClick={handleMenuClick} />
      <MainContent 
        selectedMenu={selectedMenu} 
        posts={getPostsForMenu(selectedMenu)}
        aboutData={aboutData}
        aboutDetailContents={aboutDetailContents}
      />
    </div>
  )
}
