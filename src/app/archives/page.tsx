import { getPostsGroupedByYearAndMonth } from '@/lib/archives'
import ArchivesPageClient from '@/components/ArchivesPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Archives',
  description: 'All the articles I\'ve archived.',
  openGraph: {
    title: 'Archives - Trace of Thought',
    description: 'All the articles I\'ve archived.',
    url: 'https://www.gaeng02.com/archives',
  },
}

export default function ArchivesPage() {
  const yearGroups = getPostsGroupedByYearAndMonth()

  return <ArchivesPageClient yearGroups={yearGroups} />
}
