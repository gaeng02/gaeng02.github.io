import Link from 'next/link'
import { CATEGORIES, CATEGORY_META } from '@/lib/categories'
import { getAboutData } from '@/lib/about'
import { SITE } from '@/lib/site'

export default function SiteFooter() {
  const { profile } = getAboutData()
  const year = new Date().getFullYear()

  const socials = [
    profile.github && { label: 'GitHub', href: profile.github },
    profile.linkedin && { label: 'LinkedIn', href: profile.linkedin },
    profile.instagram && { label: 'Instagram', href: profile.instagram },
    profile.email && { label: 'Email', href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; href: string }[]

  return (
    <footer className="foot">
      <div className="colophon">
        <h5>{SITE.name}</h5>
        <p style={{ margin: 0 }}>{SITE.colophon}</p>
        {socials.length > 0 && (
          <p style={{ marginTop: 14, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
          </p>
        )}
        <p className="copy">© {year} {SITE.author}. All Rights Reserved.</p>
      </div>

      <div>
        <h5>Read</h5>
        {CATEGORIES.map((c) => (
          <Link key={c} href={CATEGORY_META[c].href}>
            {CATEGORY_META[c].label}
          </Link>
        ))}
      </div>

      <div>
        <h5>Browse</h5>
        <Link href="/series">All Series</Link>
        <Link href="/archives">Archives</Link>
        <Link href="/about">About</Link>
      </div>
    </footer>
  )
}
