'use client'

import { useState } from 'react'
import Header from './Header'
import SeriesList from './SeriesList'
import type { SeriesWithPosts } from '@/lib/series'

interface HomePageClientProps {
  allSeries: SeriesWithPosts[]
}

export default function HomePageClient({ allSeries }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeMenu="series"
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <SeriesList series={allSeries} />
    </div>
  )
}
