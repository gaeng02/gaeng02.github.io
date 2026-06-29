import { CATEGORY_META, type Category } from '@/lib/categories'

export function CatPill({ category }: { category: Category }) {
  const meta = CATEGORY_META[category]
  return <span className={`cat-pill ${meta.accent}`}>{meta.label}</span>
}

export function CatDot({ category }: { category: Category }) {
  return <span className={`cat-dot ${CATEGORY_META[category].accent}`} aria-hidden />
}

export default CatPill
