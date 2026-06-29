import type { TocItem } from '@/lib/markdown'

export default function ArticleToc({ items }: { items: TocItem[] }) {
  if (!items.length) return null
  let h2 = 0
  return (
    <nav className="card toc" aria-label="목차">
      <div className="label label--ink" style={{ marginBottom: 14 }}>
        목차 · CONTENTS
      </div>
      <ol>
        {items.map((it, i) => {
          const isSub = it.depth === 3
          if (!isSub) h2 += 1
          return (
            <li key={`${it.id}-${i}`} className={isSub ? 'd3' : ''}>
              <span className="mk" aria-hidden>
                {isSub ? '└' : String(h2).padStart(2, '0')}
              </span>
              <a className="ulink" href={`#${it.id}`}>
                {it.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
