import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBasePath(): string {
  return process.env.BASE_PATH || ''
}

export function withBasePath(path: string): string {
  const basePath = getBasePath()
  if (!basePath) return path
  return `${basePath}${path.startsWith('/') ? path : `/${path}`}`
}
