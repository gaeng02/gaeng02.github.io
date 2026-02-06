'use client'

import Header from './Header'
import AboutSection from './AboutSection'
import type { AboutData } from '@/lib/about'

interface AboutPageClientProps {
  aboutData: AboutData
  detailContents: Record<string, string>
}

export default function AboutPageClient({ aboutData, detailContents }: AboutPageClientProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <AboutSection data={aboutData} detailContents={detailContents} />
      </div>
    </div>
  )
}
