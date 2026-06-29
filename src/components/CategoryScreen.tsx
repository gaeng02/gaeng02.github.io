import { getPostsByCategory } from '@/lib/content'
import { CATEGORY_META, type Category } from '@/lib/categories'
import { toPostSummary, aggregateTags } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'
import CategoryView from './CategoryView'

export default function CategoryScreen({ category }: { category: Category }) {
  const meta = CATEGORY_META[category]
  const posts = getPostsByCategory(category)
  const summaries = posts.map((p) => toPostSummary(p))
  const tags = aggregateTags(posts)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${meta.label} · ${meta.ko}`,
    description: meta.description,
    url: absoluteUrl(meta.href),
    inLanguage: 'ko-KR',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.slice(0, 20).map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/${p.category}/${p.slug}`),
        name: p.title,
      })),
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="px" style={{ paddingTop: 72, paddingBottom: 28 }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 8vw, 76px)', margin: '0 0 16px' }}>
          {meta.label}
        </h1>
        <p className="body-kr" style={{ maxWidth: 620, margin: 0, fontSize: 17 }}>
          {meta.description}
        </p>
      </section>
      <CategoryView posts={summaries} tags={tags} />
    </>
  )
}
