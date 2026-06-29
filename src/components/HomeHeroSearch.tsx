'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function HomeHeroSearch() {
  const router = useRouter()
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // `/` focuses the hero search (matches the global shortcut intent on home)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === '/' && !isTyping(e.target)) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const q = value.trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  return (
    <form className="hero-search" onSubmit={submit} role="search">
      <span className="hero-glyph" aria-hidden>
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="제목, 시리즈, 태그로 검색…  e.g. SWMaestro, 회고"
        aria-label="사이트 검색"
        enterKeyHint="search"
      />
      <span className="kbd" aria-hidden>
        /
      </span>
    </form>
  )
}

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}
