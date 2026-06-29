import type { Metadata } from 'next'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import HideOnAdmin from '@/components/HideOnAdmin'
import GoogleAnalytics from '@/components/GoogleAnalytics'

const SITE_NAME = 'Trace of Thought'
const SITE_URL = 'https://www.gaeng02.com'
const SITE_DESC =
  '책 · 논문 · 시도 · 회고를 한곳에. 도서 리뷰, 논문 정리, 기술 학습 기록과 회고를 남기는 gaeng02의 블로그입니다.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — 책 · 논문 · 시도 · 회고`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: ['블로그', '도서 리뷰', '논문 리뷰', '기술 블로그', '학습 기록', '회고', 'gaeng02', 'Trace of Thought'],
  authors: [{ name: 'gaeng02', url: SITE_URL }],
  creator: 'gaeng02',
  publisher: 'gaeng02',
  applicationName: SITE_NAME,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — 책 · 논문 · 시도 · 회고`,
    description: SITE_DESC,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — 책 · 논문 · 시도 · 회고`,
    description: SITE_DESC,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Google Search Console verification code (필요 시 추가)
    // google: 'your-verification-code',
  },
}

const themeInit = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: 'gaeng02 blog',
  url: SITE_URL,
  description: SITE_DESC,
  inLanguage: 'ko-KR',
  author: { '@type': 'Person', name: 'gaeng02', url: SITE_URL },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Noto+Serif+KR:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0c0c0d" media="(prefers-color-scheme: dark)" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <div className="shell">
          <SiteHeader />
          <main>{children}</main>
          <HideOnAdmin>
            <SiteFooter />
          </HideOnAdmin>
        </div>
      </body>
    </html>
  )
}
