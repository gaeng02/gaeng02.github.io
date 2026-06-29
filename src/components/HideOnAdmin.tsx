'use client'

import { usePathname } from 'next/navigation'

/** Hides chrome (e.g. the footer) on the local-only /admin screen. */
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/'
  if (pathname.startsWith('/admin')) return null
  return <>{children}</>
}
