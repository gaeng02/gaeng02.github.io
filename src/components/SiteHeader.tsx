'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CATEGORIES, CATEGORY_META } from '@/lib/categories'
import { SITE } from '@/lib/site'
import ThemeToggle from './ThemeToggle'
import SearchOverlay from './SearchOverlay'

export default function SiteHeader() {
  const pathname = usePathname() || '/'
  const [searchOpen, setSearchOpen] = useState(false)

  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  const aboutActive = pathname.startsWith('/about')
  const seriesActive = pathname.startsWith('/series')

  // global "/" + ⌘K to open the palette (home delegates "/" to its hero search)
  useEffect(() => {
    if (isAdmin) return
    function onKey(e: KeyboardEvent) {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen(true)
        return
      }
      if (e.key === '/' && !isHome && !isTyping(e.target)) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isHome, isAdmin])

  if (isAdmin) return null

  return (
    <>
      <header className="nav">
        <Link href="/" className="brand" aria-label={`${SITE.name} 홈`}>
          <span className="sq" aria-hidden />
          <span className="j">{SITE.brandWord}</span>
          <span className="name">— {SITE.name}</span>
        </Link>

        <nav className="nav-links" aria-label="주요 메뉴">
          <ul className="nav-group">
            <li>
              <Link className={`nav-link${aboutActive ? ' active' : ''}`} href="/about">
                About
              </Link>
            </li>
          </ul>
          <span className="nav-divider" aria-hidden />
          <ul className="nav-group">
            <li>
              <Link className={`nav-link${seriesActive ? ' active' : ''}`} href="/series">
                Series
              </Link>
            </li>
          </ul>
          <span className="nav-divider" aria-hidden />
          <ul className="nav-group nav-cats">
            {CATEGORIES.map((c) => {
              const meta = CATEGORY_META[c]
              const active = pathname.startsWith(meta.href)
              return (
                <li key={c}>
                  <Link className={`nav-link${active ? ' active' : ''}`} href={meta.href}>
                    <span className={`cat-dot ${meta.accent}`} aria-hidden />
                    <span>{meta.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="right">
          {!isHome && (
            <button type="button" className="search-btn" onClick={() => setSearchOpen(true)}>
              <span aria-hidden>⌕</span>
              <span>Search</span>
              <span className="kbd" aria-hidden>/</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}
