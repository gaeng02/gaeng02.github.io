import type { Category } from './content'

export type { Category }

export const CATEGORIES: Category[] = ['try-tech', 'memoir', 'paper', 'book']

export interface CategoryMeta {
  /** content category key */
  key: Category
  /** English display label */
  label: string
  /** Korean short label */
  ko: string
  /** CSS accent class (book/paper/try/memoir) */
  accent: 'book' | 'paper' | 'try' | 'memoir'
  /** route path */
  href: string
  /** page description */
  description: string
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  book: {
    key: 'book',
    label: 'Book',
    ko: '책',
    accent: 'book',
    href: '/book',
    description:
      '읽은 책에서 밑줄 그은 문장과 남은 생각을 정리합니다. 줄거리 요약보다, 오래 곱씹게 된 부분에 대해서.',
  },
  paper: {
    key: 'paper',
    label: 'Paper',
    ko: '논문',
    accent: 'paper',
    href: '/paper',
    description:
      '논문을 한 줄씩 따라 읽으며 직관으로 다시 정리한 노트. 수식보다 “왜 그렇게 했는가”를 적으려 합니다.',
  },
  'try-tech': {
    key: 'try-tech',
    label: 'Try Tech',
    ko: '기술',
    accent: 'try',
    href: '/try-tech',
    description:
      '새 라이브러리, 새 도구, 새 패러다임. 일단 한 번 만들어보고 적은 글들. 대부분은 실패담이고, 가끔 성공담입니다.',
  },
  memoir: {
    key: 'memoir',
    label: 'Memoir',
    ko: '회고',
    accent: 'memoir',
    href: '/memoir',
    description:
      '잘한 것보다 꾸준한 것에 대해서. 과정에서 막혔던 자리와 그때의 마음을 남겨 둡니다.',
  },
}

export function categoryMeta(key: Category): CategoryMeta {
  return CATEGORY_META[key]
}

export function categoryAccent(key: Category): 'book' | 'paper' | 'try' | 'memoir' {
  return CATEGORY_META[key].accent
}

export function categoryLabel(key: Category): string {
  return CATEGORY_META[key].label
}
