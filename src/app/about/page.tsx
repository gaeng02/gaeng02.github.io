import Link from 'next/link'
import type { Metadata } from 'next'
import { getAboutData, publicAssetExists } from '@/lib/about'
import { SITE, absoluteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'About',
  description: '프로필, 학력, 프로젝트, 수상, 활동을 소개합니다.',
  alternates: { canonical: '/about' },
  openGraph: { title: 'About', description: '프로필, 학력, 프로젝트, 수상, 활동을 소개합니다.', url: '/about' },
}

function Headline({ text }: { text: string }) {
  const m = /\*(.+?)\*/.exec(text)
  if (!m) return <>{text}</>
  const [before, after] = text.split(m[0])
  return (
    <>
      {before}
      <em style={{ fontStyle: 'italic', color: 'var(--c-paper)' }}>{m[1]}</em>
      {after}
    </>
  )
}

export default function AboutPage() {
  const data = getAboutData()
  const { profile } = data
  const hasPortrait = publicAssetExists(profile.image)

  const contacts = [
    profile.linkedin && { label: 'LinkedIn', value: '바로가기', href: profile.linkedin },
    profile.github && { label: 'GitHub', value: 'gaeng02', href: profile.github },
    profile.instagram && { label: 'Instagram', value: '바로가기', href: profile.instagram },
    profile.email && { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[]

  const sections = [
    { id: 'intro', en: 'Intro', ko: '소개 · 연락', show: true },
    { id: 'education', en: 'Education', ko: '학력', show: !!data.education?.length },
    { id: 'experience', en: 'Experience', ko: '경력', show: !!data.experience?.length },
    { id: 'projects', en: 'Projects', ko: '프로젝트', show: !!data.projects?.length },
    { id: 'awards', en: 'Awards & Honors', ko: '수상 · 영예', show: !!data.awards?.length },
    { id: 'activities', en: 'Activities', ko: '활동', show: !!data.activities?.length },
    { id: 'certifications', en: 'Certifications', ko: '자격 · 인증', show: !!data.certifications?.length },
  ].filter((s) => s.show)

  const intro = profile.intro?.length ? profile.intro : [profile.description]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      description: profile.description,
      url: SITE.url,
      sameAs: [profile.github, profile.linkedin, profile.instagram].filter(Boolean),
      email: profile.email,
    },
    url: absoluteUrl('/about'),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HEADER */}
      <section className="px" style={{ paddingTop: 72, paddingBottom: 36 }}>
        <h1 className="h-display" style={{ fontSize: 'clamp(40px, 8vw, 84px)', margin: '0 0 18px', lineHeight: 1.0 }}>
          <Headline text={profile.headline || `안녕하세요, *${profile.name}*입니다.`} />
        </h1>
        <p className="body-kr" style={{ fontSize: 19, maxWidth: 600, margin: 0 }}>
          {profile.description}
        </p>
      </section>

      {/* CONTENTS BAR */}
      <nav className="about-contents px" aria-label="섹션 목차" style={{ paddingTop: 14, paddingBottom: 14 }}>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 13.5, color: 'var(--ink)', letterSpacing: '0.02em' }}>
              {s.en}
            </div>
            <div style={{ fontFamily: 'var(--serif-kr)', fontSize: 13, color: 'var(--ink-2)', marginTop: 4 }}>
              {s.ko}
            </div>
          </a>
        ))}
      </nav>

      {/* INTRO */}
      <section id="intro" className="about-intro px" style={{ paddingTop: 56, paddingBottom: 44, scrollMarginTop: 80 }}>
        <div>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Intro</h2>
          {intro.map((p, i) => (
            <p key={i} className="body-kr" style={{ fontSize: 17, maxWidth: 580, margin: i === 0 ? 0 : '16px 0 0' }}>
              {p}
            </p>
          ))}
          {contacts.length > 0 && (
            <div className="row gap-8 wrap-flex" style={{ marginTop: 26 }}>
              {contacts.map((c) => (
                <a
                  key={c.label}
                  className="card"
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}
                >
                  <span className="label">{c.label}</span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13.5, color: 'var(--ink)' }}>{c.value}</span>
                </a>
              ))}
            </div>
          )}
        </div>
        {hasPortrait && (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="about-portrait" src={profile.image} alt={`${profile.name} 프로필 사진`} />
            {profile.imageCaption && (
              <div className="label" style={{ marginTop: 10, color: 'var(--mute)' }}>
                {profile.imageCaption}
              </div>
            )}
          </div>
        )}
      </section>

      {/* EDUCATION */}
      {data.education && data.education.length > 0 && (
        <section id="education" className="px" style={{ paddingTop: 40, paddingBottom: 32, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="about-edu">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)' }}>{e.period}</div>
              <div className="serif-title" style={{ fontSize: 17 }}>{e.degree}</div>
              <div className="body-kr" style={{ fontSize: 14 }}>
                {[e.organization, e.detail].filter(Boolean).join(' · ')}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {data.experience && data.experience.length > 0 && (
        <section id="experience" className="px" style={{ paddingTop: 40, paddingBottom: 32, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Experience</h2>
          {data.experience.map((e, i) => (
            <div key={i} className="about-edu">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)' }}>{e.period}</div>
              <div className="serif-title" style={{ fontSize: 17 }}>
                {e.title}
                {e.company ? <span style={{ color: 'var(--mute)' }}> · {e.company}</span> : null}
              </div>
              <div className="body-kr" style={{ fontSize: 14 }}>
                {e.description}
                {e.technologies?.length ? (
                  <span className="label" style={{ display: 'block', marginTop: 6 }}>{e.technologies.join(' · ')}</span>
                ) : null}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {data.projects && data.projects.length > 0 && (
        <section id="projects" className="px" style={{ paddingTop: 40, paddingBottom: 32, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Projects</h2>
          <div className="about-cards">
            {data.projects.map((p, i) => {
              const link = p.demo || p.github
              const Card = (
                <>
                  <div className="row between items-baseline">
                    <h3 className="h-mono" style={{ fontSize: 16, margin: 0 }}>{p.name}</h3>
                    {link && <span className="label ulink">↗</span>}
                  </div>
                  <p className="body-kr" style={{ fontSize: 14, margin: '12px 0 16px' }}>{p.description}</p>
                  {p.technologies?.length ? (
                    <div className="label" style={{ color: 'var(--ink-2)' }}>{p.technologies.join(' · ')}</div>
                  ) : null}
                </>
              )
              return link ? (
                <a key={i} className="card" href={link} target="_blank" rel="noopener noreferrer" style={{ padding: 22 }}>
                  {Card}
                </a>
              ) : (
                <div key={i} className="card" style={{ padding: 22 }}>
                  {Card}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* AWARDS */}
      {data.awards && data.awards.length > 0 && (
        <section id="awards" className="px" style={{ paddingTop: 40, paddingBottom: 32, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Awards &amp; Honors</h2>
          {data.awards.map((a, i) => (
            <div key={i} className="about-aw">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)' }}>{a.date}</div>
              <div className="serif-title" style={{ fontSize: 17 }}>{a.title}</div>
              <div className="label" style={{ color: 'var(--ink-2)' }}>{a.organization}</div>
            </div>
          ))}
        </section>
      )}

      {/* ACTIVITIES */}
      {data.activities && data.activities.length > 0 && (
        <section id="activities" className="px" style={{ paddingTop: 40, paddingBottom: 80, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Activities</h2>
          {data.activities.map((a, i) => (
            <div key={i} className="about-edu">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)' }}>{a.period}</div>
              <div className="serif-title" style={{ fontSize: 17 }}>
                {a.title}
                {a.organization ? <span style={{ color: 'var(--mute)' }}> · {a.organization}</span> : null}
              </div>
              <div className="body-kr" style={{ fontSize: 14 }}>{a.description}</div>
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {data.certifications && data.certifications.length > 0 && (
        <section id="certifications" className="px" style={{ paddingTop: 40, paddingBottom: 80, scrollMarginTop: 80 }}>
          <h2 className="h-display" style={{ fontSize: 36, margin: '0 0 18px' }}>Certifications</h2>
          {data.certifications.map((c, i) => (
            <div key={i} className="about-aw">
              <div style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-2)' }}>{c.date}</div>
              <div className="serif-title" style={{ fontSize: 17 }}>
                {c.credentialUrl ? (
                  <a className="ulink" href={c.credentialUrl} target="_blank" rel="noopener noreferrer">{c.name}</a>
                ) : (
                  c.name
                )}
              </div>
              <div className="label" style={{ color: 'var(--ink-2)' }}>{c.issuer}</div>
            </div>
          ))}
        </section>
      )}
    </>
  )
}
