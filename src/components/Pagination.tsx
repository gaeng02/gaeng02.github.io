'use client'

export default function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number
  pageCount: number
  onChange: (next: number) => void
}) {
  if (pageCount <= 1) return null

  // windowed page numbers to avoid an overly long bar
  const pages: number[] = []
  const span = 2
  for (let p = 1; p <= pageCount; p++) {
    if (p === 1 || p === pageCount || (p >= page - span && p <= page + span)) pages.push(p)
  }

  const out: (number | '…')[] = []
  let prev = 0
  for (const p of pages) {
    if (prev && p - prev > 1) out.push('…')
    out.push(p)
    prev = p
  }

  return (
    <nav className="pg" aria-label="페이지네이션">
      <button
        className="pg-btn"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>
      {out.map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="pg-btn" style={{ border: 0, cursor: 'default' }}>
            …
          </span>
        ) : (
          <button
            key={p}
            className={`pg-btn${p === page ? ' active' : ''}`}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}
      <button
        className="pg-btn"
        onClick={() => onChange(page + 1)}
        disabled={page === pageCount}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  )
}
