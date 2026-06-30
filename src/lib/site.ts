/** Site-wide constants (single source of truth for brand + URL). */
export const SITE = {
  /** serif name shown in the brand lockup and titles */
  name: 'Trace of Thought',
  url: 'https://www.gaeng02.com',
  description:
    '책 · 논문 · 시도 · 회고를 한곳에. 도서 리뷰, 논문 정리, 기술 학습 기록과 회고를 남기는 gaeng02의 블로그입니다.',
  colophon: '책 · 논문 · 시도 · 회고를 한곳에 기록합니다.',
  locale: 'ko-KR',
  author: 'gaeng02',
} as const

export function absoluteUrl(path: string): string {
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}
