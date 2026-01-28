import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { withBasePath } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' })

export const metadata: Metadata = {
  title: {
    default: 'Trace of Thought',
    template: '%s | Trace of Thought',
  },
  description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
  keywords: ['블로그', '도서 리뷰', '논문 정리', '기술 블로그', '학습', '회고'],
  authors: [{ name: 'gaeng02' }],
  creator: 'gaeng02',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://gaeng02.github.io',
    siteName: 'Trace of Thought',
    title: 'Trace of Thought',
    description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trace of Thought',
    description: '도서 리뷰, 논문 정리, 학습 내용, 그리고 회고를 기록하는 블로그',
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
    // Google Search Console에서 받은 verification code를 여기에 추가
    // google: 'your-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <GoogleAnalytics />
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
