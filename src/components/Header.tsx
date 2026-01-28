'use client'

import Link from 'next/link'
import { withBasePath } from '@/lib/utils'
import { useState } from 'react'

type MenuItem = 'book' | 'paper' | 'try-tech' | 'memoir' | 'about'

interface HeaderProps {
  activeMenu?: MenuItem
  onMenuClick?: (menu: MenuItem) => void
  onSearchChange?: (query: string) => void
  searchQuery?: string
}

export default function Header({ activeMenu, onMenuClick, onSearchChange, searchQuery = '' }: HeaderProps) {
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange?.(e.target.value)
  }

  return (
    <header className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <p className="text-xs text-gray-500 mb-4 tracking-wider uppercase">
          Little by little, a little becomes a lot.
        </p>
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
          Trace of Thought
        </h1>
        <div className="w-24 h-px bg-gray-300 mx-auto mb-8"></div>
      </div>

      <nav className="flex items-center justify-center gap-8 mb-8">
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

      {/* 검색창 */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
    </header>
  )
}
