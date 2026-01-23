'use client'

import Link from 'next/link'
import { withBasePath } from '@/lib/utils'
import { useState } from 'react'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir' | 'about'

interface HeaderProps {
  activeMenu?: MenuItem
  onMenuClick?: (menu: MenuItem) => void
}

export default function Header({ activeMenu, onMenuClick }: HeaderProps) {
  const menuItems: { key: MenuItem; label: string; href: string }[] = [
    { key: 'book', label: 'Book', href: '/book' },
    { key: 'paper', label: 'Paper', href: '/paper' },
    { key: 'try-tech', label: 'Try Tech', href: '/try-tech' },
    { key: 'memoir', label: 'Memoir', href: '/memoir' },
    { key: 'about', label: 'About', href: '/about' },
  ]

  const handleClick = (menu: MenuItem, href: string) => {
    // 모든 메뉴는 클릭 이벤트 전달
    onMenuClick?.(menu)
  }

  return (
    <header className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-xs text-gray-500 mb-4 tracking-wider uppercase">
          Everything is personal. Including this blog..
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          Train of Thought
        </h1>
        <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
      </div>

      <nav className="flex items-center justify-center gap-8 mb-12">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleClick(item.key, item.href)}
            className={`text-sm font-medium transition-colors relative ${
              activeMenu === item.key
                ? 'text-primary-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
            {activeMenu === item.key && (
              <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary-600"></span>
            )}
          </button>
        ))}
      </nav>
    </header>
  )
}
