import { getAllPosts, type Post } from './content'
import { getMonthName } from './dateUtils'

export interface GroupedPost {
  year: number
  month: number
  monthName: string
  posts: Post[]
}

export interface YearGroup {
  year: number
  months: MonthGroup[]
  totalCount: number
}

export interface MonthGroup {
  month: number
  monthName: string
  posts: Post[]
  count: number
}

// 모든 포스트를 연도/월별로 그룹화
export function getPostsGroupedByYearAndMonth(): YearGroup[] {
  const allPosts = getAllPosts()
  
  // 연도별로 그룹화
  const yearMap = new Map<number, Map<number, Post[]>>()
  
  allPosts.forEach((post) => {
    const date = new Date(post.date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 1-12
    
    if (!yearMap.has(year)) {
      yearMap.set(year, new Map())
    }
    
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    
    monthMap.get(month)!.push(post)
  })
  
  // YearGroup 배열로 변환
  const yearGroups: YearGroup[] = []
  
  // 연도는 내림차순 (최신순)
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b - a)
  
  sortedYears.forEach((year) => {
    const monthMap = yearMap.get(year)!
    const months: MonthGroup[] = []
    let totalCount = 0
    
    // 월은 내림차순 (최신순)
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b - a)
    
    sortedMonths.forEach((month) => {
      const posts = monthMap.get(month)!
      // 각 월 내에서도 날짜순 정렬 (최신순)
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      
      months.push({
        month,
        monthName: getMonthName(month),
        posts,
        count: posts.length,
      })
      
      totalCount += posts.length
    })
    
    yearGroups.push({
      year,
      months,
      totalCount,
    })
  })
  
  return yearGroups
}
