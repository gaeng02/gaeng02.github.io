import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export type Category = 'book' | 'paper' | 'try-tech' | 'memoir'
export type Topic = 'cs' | 'ai'

export interface PostFrontMatter {
  title: string
  date: string
  description: string
  category: Category
  topic?: Topic
  subtopic?: string
  tags?: string[]
  featured?: boolean
  draft?: boolean
  cover?: string
}

export interface Post extends PostFrontMatter {
  slug: string
  slugPath: string[] // for study/retrospective nested paths
  content: string
  filePath: string
}

// 날짜 prefix 제거하여 slug 생성
function getSlugFromFilename(filename: string): string {
  const datePattern = /^\d{4}-\d{2}-\d{2}-/
  return filename.replace(/\.md$/, '').replace(datePattern, '')
}

// 파일 경로에서 slug path 배열 생성 (memoir용)
function getSlugPathFromFilePath(filePath: string, category: Category): string[] {
  if (category !== 'memoir') {
    return []
  }
  
  const relativePath = path.relative(
    path.join(contentDirectory, 'memoir'),
    filePath
  )
  
  const parts = relativePath.split(path.sep)
  const filename = parts[parts.length - 1]
  const slug = getSlugFromFilename(filename)
  
  // 폴더 경로 + slug
  const dirParts = parts.slice(0, -1)
  return [...dirParts, slug]
}

// 모든 MD 파일 읽기
function getAllMarkdownFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir)
  
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      getAllMarkdownFiles(filePath, fileList)
    } else if (file.endsWith('.md')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

// 단일 포스트 읽기
function getPostFromFile(filePath: string, category: Category): Post | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    
    const frontMatter = data as PostFrontMatter
    
    // draft는 제외
    if (frontMatter.draft) {
      return null
    }
    
    // category 일치 확인
    if (frontMatter.category !== category) {
      return null
    }
    
    const filename = path.basename(filePath)
    const slug = getSlugFromFilename(filename)
    const slugPath = getSlugPathFromFilePath(filePath, category)
    
    return {
      ...frontMatter,
      slug,
      slugPath,
      content,
      filePath,
    }
  } catch (error) {
    console.error(`Error reading post from ${filePath}:`, error)
    return null
  }
}

// 카테고리별 포스트 목록 가져오기
export function getPostsByCategory(category: Category): Post[] {
  const categoryDirMap: Record<Category, string> = {
    book: path.join(contentDirectory, 'book-reviews'),
    paper: path.join(contentDirectory, 'paper-reviews'),
    'try-tech': path.join(contentDirectory, 'try-tech'),
    memoir: path.join(contentDirectory, 'memoir'),
  }
  
  const categoryDir = categoryDirMap[category]
  
  if (!fs.existsSync(categoryDir)) {
    return []
  }
  
  const files = getAllMarkdownFiles(categoryDir)
  const posts = files
    .map((file) => getPostFromFile(file, category))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}

// 모든 포스트 가져오기
export function getAllPosts(): Post[] {
  const categories: Category[] = ['book', 'paper', 'try-tech', 'memoir']
  const allPosts: Post[] = []
  
  categories.forEach((category) => {
    const posts = getPostsByCategory(category)
    allPosts.push(...posts)
  })
  
  return allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// slug로 포스트 가져오기 (book, paper, try-tech)
export function getPostBySlug(category: 'book' | 'paper' | 'try-tech', slug: string): Post | null {
  const posts = getPostsByCategory(category)
  return posts.find((post) => post.slug === slug) || null
}

// slug path로 포스트 가져오기 (memoir)
export function getPostBySlugPath(
  category: 'memoir',
  slugPath: string[]
): Post | null {
  const posts = getPostsByCategory(category)
  
  return (
    posts.find((post) => {
      if (post.slugPath.length !== slugPath.length) return false
      return post.slugPath.every((part, idx) => part === slugPath[idx])
    }) || null
  )
}

// Featured 포스트 가져오기
export function getFeaturedPosts(limit: number = 3): Post[] {
  const allPosts = getAllPosts()
  return allPosts
    .filter((post) => post.featured)
    .slice(0, limit)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 최근 포스트 가져오기
export function getRecentPosts(limit: number = 12): Post[] {
  const allPosts = getAllPosts()
  return allPosts.slice(0, limit)
}

