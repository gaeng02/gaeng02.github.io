import type { Metadata } from 'next'
import CategoryScreen from '@/components/CategoryScreen'
import { CATEGORY_META } from '@/lib/categories'

const meta = CATEGORY_META.paper

export const metadata: Metadata = {
  title: `${meta.label} · ${meta.ko}`,
  description: meta.description,
  alternates: { canonical: meta.href },
  openGraph: { title: `${meta.label} · ${meta.ko}`, description: meta.description, url: meta.href },
}

export default function PaperPage() {
  return <CategoryScreen category="paper" />
}
