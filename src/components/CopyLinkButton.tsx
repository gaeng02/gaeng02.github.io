'use client'

import { useState } from 'react'

export default function CopyLinkButton({ url }: { url?: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const link = url ?? (typeof window !== 'undefined' ? window.location.href : '')
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // ignore — clipboard may be unavailable
    }
  }

  return (
    <button type="button" className="btn btn-outline" onClick={copy}>
      {copied ? '복사됨 ✓' : 'Copy link'}
    </button>
  )
}
