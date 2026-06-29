'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORY_META } from '@/lib/categories'
import {
  loadSearchIndex,
  searchItems,
  splitHighlight,
  type SearchItem,
} from '@/lib/searchClient'

function Highlighted({ text, query }: { text: string; query: string }) {
  return (
    <>
      {splitHighlight(text, query).map((p, i) =>
        p.hit ? <mark key={i}>{p.text}</mark> : <span key={i}>{p.text}</span>
      )}
    </>
  )
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const [items, setItems] = useState<SearchItem[]>([])
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      loadSearchIndex().then(setItems)
      setSel(0)
      const t = setTimeout(() => inputRef.current?.focus(), 20)
      document.body.style.overflow = 'hidden'
      return () => {
        clearTimeout(t)
        document.body.style.overflow = ''
      }
    }
  }, [open])

  const results = useMemo(() => searchItems(items, query).slice(0, 12), [items, query])

  useEffect(() => {
    setSel(0)
  }, [query])

  function navigate(url: string) {
    onClose()
    setQuery('')
    router.push(url)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => Math.min(s + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => Math.max(s - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[sel]) navigate(results[sel].url)
      else if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  if (!open) return null

  return (
    <div className="overlay" onClick={onClose} role="presentation">
      <div
        className="overlay-panel"
        role="dialog"
        aria-modal="true"
        aria-label="검색"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="overlay-input">
          <span className="hero-glyph" aria-hidden>⌕</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목, 시리즈, 태그로 검색…"
            aria-label="검색어"
          />
          <span className="kbd" aria-hidden>ESC</span>
        </div>

        {query.trim() !== '' && (
          <div className="overlay-results">
            {results.length === 0 ? (
              <div className="label" style={{ padding: '18px 14px' }}>
                ‘{query}’에 대한 결과가 없어요.
              </div>
            ) : (
              results.map((r, i) => {
                const accent = r.type === 'series' ? 'paper' : CATEGORY_META[r.category!].accent
                const tag = r.type === 'series' ? 'SERIES' : CATEGORY_META[r.category!].label
                return (
                  <div
                    key={r.url}
                    className={`overlay-row${i === sel ? ' sel' : ''}`}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => navigate(r.url)}
                  >
                    <span className={`cat-pill ${accent}`}>{tag}</span>
                    <span style={{ fontFamily: 'var(--serif-kr)', fontSize: 15, color: 'var(--ink)' }}>
                      <Highlighted text={r.title} query={query} />
                    </span>
                    <span className="label">{r.date?.slice(0, 10)}</span>
                  </div>
                )
              })
            )}
            {results.length > 0 && (
              <div
                className="overlay-row"
                onClick={() => navigate(`/search?q=${encodeURIComponent(query.trim())}`)}
                onMouseEnter={() => setSel(-1)}
                style={{ gridTemplateColumns: '1fr', color: 'var(--mute)' }}
              >
                <span className="label">전체 검색 결과 보기 →</span>
              </div>
            )}
          </div>
        )}

        <div className="overlay-foot">
          <span>Enter 열기</span>
          <span>↑↓ 이동</span>
          <span>Esc 닫기</span>
        </div>
      </div>
    </div>
  )
}
