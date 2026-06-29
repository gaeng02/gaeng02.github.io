import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <section
      className="px"
      style={{
        paddingTop: 100,
        paddingBottom: 110,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: 520,
      }}
    >
      <p
        aria-hidden
        style={{
          fontFamily: 'var(--serif)',
          fontWeight: 400,
          fontStyle: 'italic',
          fontSize: 'clamp(110px, 22vw, 200px)',
          margin: 0,
          lineHeight: 0.95,
          color: 'var(--ink)',
          letterSpacing: '-0.03em',
        }}
      >
        404
      </p>
      <h1 className="h-display" style={{ fontSize: 'clamp(28px, 5vw, 40px)', margin: '20px 0 14px' }}>
        여긴 아무 글도 없어요.
      </h1>
      <p className="body-kr" style={{ maxWidth: 440, margin: '0 0 36px' }}>
        주소가 잘못되었거나, 글이 옮겨갔거나, 아직 쓰여지지 않은 글일 수 있어요.
      </p>
      <Link className="btn btn-solid" href="/">
        ← 메인 페이지로 돌아가기
      </Link>
    </section>
  )
}
