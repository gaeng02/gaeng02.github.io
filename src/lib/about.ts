import fs from 'fs'
import path from 'path'

const aboutDataPath = path.join(process.cwd(), 'data', 'about.json')
const aboutContentPath = path.join(process.cwd(), 'data', 'about')

export interface AboutData {
  profile: {
    name: string
    title: string
    description: string
    /** large greeting headline; supports a single *emphasis* span */
    headline?: string
    /** intro paragraphs shown in the Intro section */
    intro?: string[]
    image?: string
    imageCaption?: string
    email?: string
    github?: string
    linkedin?: string
    instagram?: string
    blog?: string
  }
  education?: Array<{
    period: string
    degree: string
    organization?: string
    detail?: string
  }>
  experience: Array<{
    title: string
    company: string
    period: string
    description: string
    technologies?: string[]
  }>
  projects: Array<{
    name: string
    period: string
    description: string
    technologies: string[]
    github?: string
    demo?: string
    featured?: boolean
    detailFile?: string
  }>
  activities: Array<{
    title: string
    organization: string
    period: string
    description: string
    role?: string
    detailFile?: string
  }>
  awards: Array<{
    title: string
    organization: string
    date: string
    description: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    credentialId?: string
    credentialUrl?: string
  }>
}

export function getAboutDetailContent(filePath: string): string {
  try {
    const fullPath = path.join(aboutContentPath, filePath)
    if (fs.existsSync(fullPath)) {
      return fs.readFileSync(fullPath, 'utf8')
    }
    return ''
  } catch (error) {
    console.error(`Error reading detail content from ${filePath}:`, error)
    return ''
  }
}

/** True if a /public asset actually exists (avoids broken <img> in production). */
export function publicAssetExists(assetPath?: string): boolean {
  if (!assetPath) return false
  try {
    const clean = assetPath.split('?')[0]
    return fs.existsSync(path.join(process.cwd(), 'public', clean.replace(/^\//, '')))
  } catch {
    return false
  }
}

export function getAboutData(): AboutData {
  try {
    const fileContents = fs.readFileSync(aboutDataPath, 'utf8')
    return JSON.parse(fileContents) as AboutData
  } catch (error) {
    console.error('Error reading about data:', error)
    // 기본 데이터 반환
    return {
      profile: {
        name: '개발자',
        title: 'Developer',
        description: '',
      },
      experience: [],
      projects: [],
      activities: [],
      awards: [],
      certifications: [],
    }
  }
}
