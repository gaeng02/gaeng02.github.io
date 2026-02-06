import { getAboutData, getAboutDetailContent } from '@/lib/about'
import AboutPageClient from '@/components/AboutPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '프로젝트, 활동, 수상 경력, 자격증을 소개합니다',
  openGraph: {
    title: 'About - Trace of Thought',
    description: '프로젝트, 활동, 수상 경력, 자격증을 소개합니다',
    url: 'https://www.gaeng02.com/about',
  },
}

export default function AboutPage() {
  const aboutData = getAboutData()
  const detailContents: Record<string, string> = {}
  
  aboutData.projects.forEach((project) => {
    if (project.detailFile) {
      detailContents[project.detailFile] = getAboutDetailContent(project.detailFile)
    }
  })
  
  aboutData.activities.forEach((activity) => {
    if (activity.detailFile) {
      detailContents[activity.detailFile] = getAboutDetailContent(activity.detailFile)
    }
  })

  return <AboutPageClient aboutData={aboutData} detailContents={detailContents} />
}
