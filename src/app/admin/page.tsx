'use client'

// LOCAL-ONLY (gitignored). Markdown authoring screen with live preview that
// writes posts straight into content/. Never deployed (excluded from export).

import { useEffect, useMemo, useRef, useState } from 'react'

const CATS = [
  { key: 'book', label: 'Book', accent: 'var(--c-book)' },
  { key: 'paper', label: 'Paper', accent: 'var(--c-paper)' },
  { key: 'try-tech', label: 'Try Tech', accent: 'var(--c-try)' },
  { key: 'memoir', label: 'Memoir', accent: 'var(--c-memoir)' },
] as const

function todayLocal(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function slugify(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const TEMPLATE = `여기에 본문을 Markdown으로 작성하세요.

## 첫 번째 섹션

내용을 적습니다. **굵게**, *기울임*, \`인라인 코드\`, [링크](https://example.com)를 쓸 수 있어요.

> 인용문도 됩니다.

### 하위 섹션

- 목록 1
- 목록 2
`

const dark = {
  bar: '#18181b',
  barText: '#f4f4f5',
  barMute: '#8a8a93',
  barRule: '#2a2a2e',
}

const field: React.CSSProperties = {
  width: '100%',
  fontFamily: 'var(--mono)',
  fontSize: 12.5,
  padding: '8px 10px',
  border: '1px solid var(--rule)',
  borderRadius: 8,
  background: 'var(--paper)',
  color: 'var(--ink)',
  outline: 'none',
}

export default function AdminWrite() {
  const [category, setCategory] = useState<string>('try-tech')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [date, setDate] = useState(todayLocal())
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [seriesTag, setSeriesTag] = useState('')
  const [cover, setCover] = useState('')
  const [body, setBody] = useState(TEMPLATE)

  const [previewHtml, setPreviewHtml] = useState('')
  const [status, setStatus] = useState<{ kind: 'idle' | 'ok' | 'err' | 'busy'; msg: string; url?: string }>({
    kind: 'idle',
    msg: '',
  })
  const [conflict, setConflict] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const bodyFileRef = useRef<HTMLInputElement>(null)
  const coverFileRef = useRef<HTMLInputElement>(null)

  const effectiveSlug = useMemo(() => slug.trim() || slugify(title) || 'untitled', [slug, title])
  const filename = `${date}-${effectiveSlug}.md`

  const tagList = useMemo(() => {
    const base = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const st = seriesTag.trim()
    if (st && !base.includes(st)) base.push(st)
    return base
  }, [tags, seriesTag])

  const frontmatter = useMemo(
    () =>
      [
        '---',
        `title: "${title.replace(/"/g, '\\"')}"`,
        `date: "${date}"`,
        `description: "${description.replace(/"/g, '\\"')}"`,
        `category: "${category}"`,
        `tags: [${tagList.map((t) => `"${t}"`).join(', ')}]`,
        ...(cover ? [`cover: "${cover}"`] : []),
        '---',
      ].join('\n'),
    [title, date, description, category, tagList, cover]
  )

  // live preview (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdown: body }),
      })
        .then((r) => r.json())
        .then((d) => setPreviewHtml(d.html || ''))
        .catch(() => {})
    }, 350)
    return () => clearTimeout(id)
  }, [body])

  async function publish(overwrite = false) {
    if (!title.trim()) {
      setStatus({ kind: 'err', msg: '제목을 입력하세요.' })
      return
    }
    setStatus({ kind: 'busy', msg: '저장 중…' })
    setConflict(false)
    try {
      const res = await fetch('/api/admin/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          title,
          slug: slug.trim(),
          date,
          description,
          tags: tagList,
          cover,
          body,
          overwrite,
        }),
      })
      const d = await res.json()
      if (res.status === 409) {
        setConflict(true)
        setStatus({ kind: 'err', msg: `${d.filename} 이(가) 이미 있어요. 덮어쓸까요?` })
        return
      }
      if (!res.ok) {
        setStatus({ kind: 'err', msg: d.error || '저장 실패' })
        return
      }
      setStatus({
        kind: 'ok',
        msg: `저장됨 → ${d.path}${d.genOk ? ' · 색인 갱신 완료' : ' · 색인 갱신 실패(수동 npm run gen)'}`,
        url: d.url,
      })
    } catch (e) {
      setStatus({ kind: 'err', msg: String(e) })
    }
  }

  // ---- image upload ----
  function insertIntoBody(snippet: string) {
    const ta = bodyRef.current
    if (!ta) {
      setBody((b) => b + snippet)
      return
    }
    const start = ta.selectionStart ?? body.length
    const end = ta.selectionEnd ?? body.length
    setBody((b) => b.slice(0, start) + snippet + b.slice(end))
    requestAnimationFrame(() => {
      ta.focus()
      const pos = start + snippet.length
      ta.setSelectionRange(pos, pos)
    })
  }

  async function uploadFile(file: File): Promise<string | null> {
    setUploading(true)
    setStatus({ kind: 'busy', msg: `이미지 업로드 중… (${file.name || 'image'})` })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (!res.ok) {
        setStatus({ kind: 'err', msg: d.error || '업로드 실패' })
        return null
      }
      setStatus({ kind: 'ok', msg: `이미지 추가됨 → ${d.path}` })
      return d.path as string
    } catch (e) {
      setStatus({ kind: 'err', msg: String(e) })
      return null
    } finally {
      setUploading(false)
    }
  }

  async function uploadAndInsert(files: FileList | File[]) {
    const imgs = Array.from(files).filter((f) => f.type.startsWith('image/'))
    for (const f of imgs) {
      const p = await uploadFile(f)
      if (p) insertIntoBody(`![](${p})\n`)
    }
  }

  async function onDropBody(e: React.DragEvent<HTMLTextAreaElement>) {
    if (!e.dataTransfer?.files?.length) return
    e.preventDefault()
    setDragOver(false)
    await uploadAndInsert(e.dataTransfer.files)
  }

  async function onPasteBody(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData?.items
    if (!items) return
    const files: File[] = []
    for (const it of Array.from(items)) {
      if (it.type.startsWith('image/')) {
        const f = it.getAsFile()
        if (f) files.push(f)
      }
    }
    if (!files.length) return
    e.preventDefault()
    await uploadAndInsert(files)
  }

  async function onBodyPick(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) await uploadAndInsert(e.target.files)
    e.target.value = ''
  }

  async function onCoverPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) {
      const p = await uploadFile(f)
      if (p) setCover(p)
    }
    e.target.value = ''
  }

  const activeCat = CATS.find((c) => c.key === category)!

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-2)' }}>
      {/* top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '14px 24px',
          borderBottom: `1px solid ${dark.barRule}`,
          background: dark.bar,
          color: dark.barText,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 8, height: 8, background: activeCat.accent, display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '0.08em' }}>ADMIN · /draft/new</span>
          <span style={{ color: dark.barMute, fontFamily: 'var(--mono)', fontSize: 12 }}>
            / {activeCat.label} / {filename}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: dark.barMute, fontFamily: 'var(--mono)', fontSize: 11 }}>로컬 전용 · 배포 안 됨</span>
          <button
            type="button"
            onClick={() => publish(false)}
            disabled={status.kind === 'busy'}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              padding: '7px 16px',
              border: '1px solid #f4f4f5',
              background: '#f4f4f5',
              color: '#18181b',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Publish →
          </button>
        </div>
      </div>

      {/* status line */}
      {status.kind !== 'idle' && (
        <div
          style={{
            padding: '10px 24px',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            background: status.kind === 'ok' ? 'var(--c-paper-bg)' : status.kind === 'err' ? 'var(--c-try-bg)' : 'var(--bg-3)',
            color: status.kind === 'ok' ? 'var(--c-paper)' : status.kind === 'err' ? 'var(--c-try)' : 'var(--ink-2)',
            display: 'flex',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <span>{status.msg}</span>
          {status.url && (
            <a className="ulink" href={status.url} target="_blank" rel="noreferrer">
              열기 ↗
            </a>
          )}
          {conflict && (
            <button type="button" className="ulink" onClick={() => publish(true)} style={{ background: 'none', border: 0, cursor: 'pointer' }}>
              덮어쓰기
            </button>
          )}
        </div>
      )}

      {/* 3-column workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 1fr', minHeight: 'calc(100vh - 52px)' }}>
        {/* meta sidebar */}
        <aside style={{ borderRight: '1px solid var(--rule)', padding: 18, background: 'var(--bg)', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="label label--ink">POST META</div>

          <Label t="category">
            <select style={field} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </Label>
          <Label t="title">
            <input style={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
          </Label>
          <Label t="slug">
            <input style={field} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={effectiveSlug} />
          </Label>
          <Label t="date">
            <input type="date" style={field} value={date} onChange={(e) => setDate(e.target.value)} />
          </Label>
          <Label t="description">
            <textarea style={{ ...field, minHeight: 56, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="한 줄 설명" />
          </Label>
          <Label t="tags (콤마)">
            <input style={field} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="예: 2025, 회고" />
          </Label>
          <Label t="series tag (선택)">
            <input style={field} value={seriesTag} onChange={(e) => setSeriesTag(e.target.value)} placeholder="예: SWMaestro" />
          </Label>
          <Label t="cover (선택)">
            <div className="row gap-8">
              <input style={{ ...field, flex: 1 }} value={cover} onChange={(e) => setCover(e.target.value)} placeholder="/assets/images/…" />
              <button
                type="button"
                className="btn"
                style={{ padding: '8px 10px', fontSize: 11, borderRadius: 8 }}
                onClick={() => coverFileRef.current?.click()}
                disabled={uploading}
              >
                올리기
              </button>
            </div>
            <input ref={coverFileRef} type="file" accept="image/*" hidden onChange={onCoverPick} />
          </Label>

          <div style={{ marginTop: 'auto', paddingTop: 12 }}>
            <div className="label" style={{ marginBottom: 6 }}>FRONTMATTER</div>
            <pre style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.6, color: 'var(--ink-2)', whiteSpace: 'pre-wrap', margin: 0, background: 'var(--bg-2)', padding: 10, borderRadius: 8, border: '1px solid var(--rule)' }}>
              {frontmatter}
            </pre>
          </div>
        </aside>

        {/* editor */}
        <section style={{ borderRight: '1px solid var(--rule)', padding: '18px 20px', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
          <div className="row between items-center" style={{ marginBottom: 10 }}>
            <span className="label">EDITOR · {filename}</span>
            <button
              type="button"
              className="btn"
              style={{ padding: '5px 12px', fontSize: 11, borderRadius: 8 }}
              onClick={() => bodyFileRef.current?.click()}
              disabled={uploading}
            >
              🖼 이미지 추가
            </button>
            <input ref={bodyFileRef} type="file" accept="image/*" multiple hidden onChange={onBodyPick} />
          </div>
          <textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onDrop={onDropBody}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onPaste={onPasteBody}
            spellCheck={false}
            style={{
              flex: 1,
              minHeight: 600,
              fontFamily: 'var(--mono)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'var(--ink)',
              background: 'var(--paper)',
              border: `1px solid ${dragOver ? 'var(--c-paper)' : 'var(--rule)'}`,
              borderRadius: 10,
              padding: 18,
              resize: 'none',
              outline: 'none',
            }}
          />
          <div className="label" style={{ marginTop: 8 }}>
            이미지를 드래그하거나 붙여넣기(⌘V)하면 자동 업로드 → 마크다운이 삽입됩니다.
          </div>
        </section>

        {/* preview */}
        <section style={{ padding: '18px 20px', background: 'var(--bg)', overflow: 'auto' }}>
          <div className="label" style={{ marginBottom: 10 }}>PREVIEW · live</div>
          <div className="card" style={{ padding: 24 }}>
            <span className={`cat-pill ${activeCat.key === 'try-tech' ? 'try' : activeCat.key}`}>{activeCat.label}</span>
            <h1 style={{ fontFamily: 'var(--serif-kr)', fontWeight: 500, fontSize: 28, lineHeight: 1.3, margin: '12px 0 12px' }}>
              {title || '제목을 입력하세요'}
            </h1>
            {description && (
              <p className="body-kr" style={{ fontSize: 15, color: 'var(--ink-2)', margin: '0 0 16px' }}>{description}</p>
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </section>
      </div>
    </div>
  )
}

function Label({ t, children }: { t: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="label" style={{ display: 'block', marginBottom: 4 }}>{t}</span>
      {children}
    </label>
  )
}
