import { getPostsByCategory } from '@/lib/content'
import { getAboutData, getAboutDetailContent } from '@/lib/about'
import HomePageClient from '@/components/HomePageClient'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir'

export default function HomePage() {
  // 서버에서 모든 카테고리의 데이터를 미리 가져오기
  const bookPosts = getPostsByCategory('book')
  const paperPosts = getPostsByCategory('paper')
  const tryTechPosts = getPostsByCategory('try-tech')
  const memoirPosts = getPostsByCategory('memoir')

  const postsByCategory: Record<MenuItem, typeof bookPosts> = {
    book: bookPosts,
    paper: paperPosts,
    'try-tech': tryTechPosts,
    memoir: memoirPosts,
  }

  // About 데이터 로드
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

  return (
    <HomePageClient 
      postsByCategory={postsByCategory}
      aboutData={aboutData}
      aboutDetailContents={detailContents}
    />
  )
}
