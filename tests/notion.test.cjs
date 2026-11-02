const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const matter = require('gray-matter')
const { syncNotion, slugify } = require('../lib/notion.cjs')
const { readPosts } = require('../lib/content.cjs')

const text = (content, annotations = {}) => ({
  type: 'text',
  plain_text: content,
  href: null,
  annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default', ...annotations },
})
const block = (id, type, value, extra = {}) => ({ object: 'block', id, type, has_children: false, [type]: value, ...extra })

function page(id, { title, status = 'released', category = 'Memoir', slug = '', date = '2026-11-01', edited = '2026-11-01T03:00:00.000Z', tags = [] }) {
  return {
    object: 'page',
    id,
    url: `https://www.notion.so/${id}`,
    created_time: '2026-10-31T15:30:00.000Z',
    last_edited_time: edited,
    cover: null,
    // The names used in the blog's Notion database (gaeng02_posts).
    properties: {
      title: { type: 'title', title: [text(title)] },
      status: { type: 'status', status: { name: status } },
      category: { type: 'select', select: { name: category } },
      url: { type: 'rich_text', rich_text: slug ? [text(slug)] : [] },
      date: { type: 'date', date: date ? { start: date } : null },
      tags: { type: 'multi_select', multi_select: tags.map((name) => ({ name })) },
      summary: { type: 'rich_text', rich_text: [text('검색 결과 설명')] },
      thumbnail: { type: 'files', files: [] },
    },
  }
}

function fakeNotion(pages, blocks) {
  return {
    databases: { retrieve: async () => ({ data_sources: [{ id: 'source' }] }) },
    dataSources: { query: async () => ({ results: pages(), has_more: false, next_cursor: null }) },
    blocks: { children: { list: async ({ block_id }) => ({ results: blocks[block_id] || [], has_more: false, next_cursor: null }) } },
  }
}

const PNG = Buffer.from('89504e470d0a1a0a', 'hex')
const fetchImpl = async () => new Response(PNG, { headers: { 'content-type': 'image/png' } })

test('slugs keep Korean letters and drop punctuation', () => {
  assert.equal(slugify('  소마 16기: 합격 후기!  '), '소마-16기-합격-후기')
  assert.equal(slugify('2025-03-SWMaestro'), '2025-03-SWMaestro')
})

test('published Notion pages become posts the blog can build; others are left alone', async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'notion-sync-'))
  t.after(() => fs.rmSync(root, { recursive: true }))
  fs.mkdirSync(path.join(root, 'content', 'memoir'), { recursive: true })
  const handWritten = '---\ntitle: 직접 쓴 글\ndate: "2025-03-31"\ncategory: memoir\n---\n\n본문\n'
  fs.writeFileSync(path.join(root, 'content', 'memoir', '2025-03-SWMaestro.md'), handWritten)

  let pages = [
    page('p1', { title: '첫 글', slug: 'first-post', tags: ['회고'] }),
    page('p2', { title: '아직 초안', status: 'writing' }),
    page('p3', { title: '카테고리 오류', category: '일기' }),
  ]
  const blocks = {
    p1: [
      block('b1', 'heading_1', { rich_text: [text('들어가며')], is_toggleable: false }),
      block('b2', 'paragraph', { rich_text: [text('굵은', { bold: true }), text(' 글')] }),
      block('b3', 'image', { type: 'file', file: { url: 'https://s3.example/x.png?expires=1' }, caption: [text('그림 설명')] }),
      block('b4', 'bulleted_list_item', { rich_text: [text('항목')] }),
      block('b5', 'paragraph', { rich_text: [text('첫 줄\n둘째 줄')] }),
      block('b6', 'image', { type: 'external', external: { url: 'https://www.gaeng02.com/assets/images/old.png' }, caption: [] }),
    ],
  }
  const notion = fakeNotion(() => pages, blocks)
  const first = await syncNotion({ notion, databaseId: 'db', root, fetchImpl, log: () => {} })

  assert.deepEqual(first.written, ['content/memoir/2026-11-01-first-post.md'])
  assert.equal(first.errors.length, 1)
  assert.match(first.errors[0], /카테고리/)
  const file = path.join(root, 'content', 'memoir', '2026-11-01-first-post.md')
  const { data, content } = matter(fs.readFileSync(file, 'utf8'))
  assert.equal(data.notion, 'p1')
  assert.deepEqual(data.tags, ['회고'])
  assert.equal(data.updatedAt, undefined) // a first publication is not an update
  assert.match(content, /^## 들어가며$/m)
  assert.match(content, /\*\*굵은\*\* 글/)
  const image = /!\[그림 설명\]\((\/assets\/images\/[0-9a-f]{16}\.png)\)/.exec(content)
  assert.ok(image, content)
  assert.deepEqual(fs.readFileSync(path.join(root, 'public', image[1])), PNG)
  assert.match(content, /^첫 줄\\\n둘째 줄$/m)
  assert.match(content, /!\[\]\(\/assets\/images\/old\.png\)/)
  // The blog's own loader accepts the file, next to the hand-written post.
  assert.deepEqual(readPosts(path.join(root, 'content')).map((post) => post.slug).sort(), ['2025-03-SWMaestro', 'first-post'])

  // Nothing edited in Notion: nothing is rewritten.
  const second = await syncNotion({ notion, databaseId: 'db', root, fetchImpl, log: () => {} })
  assert.deepEqual(second.written, [])
  assert.deepEqual(second.skipped, ['content/memoir/2026-11-01-first-post.md'])

  // A changed address moves the file; back to draft takes the post down.
  pages = [page('p1', { title: '첫 글', slug: 'renamed', edited: '2026-11-02T03:00:00.000Z' })]
  const moved = await syncNotion({ notion, databaseId: 'db', root, fetchImpl, log: () => {} })
  assert.deepEqual(moved.written, ['content/memoir/2026-11-01-renamed.md'])
  assert.ok(!fs.existsSync(file))
  assert.ok(matter(fs.readFileSync(path.join(root, 'content/memoir/2026-11-01-renamed.md'), 'utf8')).data.updatedAt)
  pages = [page('p1', { title: '첫 글', slug: 'renamed', status: 'before' })]
  const removed = await syncNotion({ notion, databaseId: 'db', root, fetchImpl, log: () => {} })
  assert.deepEqual(removed.removed, ['content/memoir/2026-11-01-renamed.md'])

  // A hand-written post is never overwritten, even when a Notion page claims its address.
  const clash = page('p9', { title: '겹치는 글', slug: '2025-03-SWMaestro', date: '' })
  clash.created_time = '2025-03-30T16:00:00.000Z'
  pages = [clash]
  fs.renameSync(path.join(root, 'content/memoir/2025-03-SWMaestro.md'), path.join(root, 'content/memoir/2025-03-31-2025-03-SWMaestro.md'))
  await assert.rejects(syncNotion({ notion, databaseId: 'db', root, fetchImpl, log: () => {} }), /직접 작성한 글/)
  assert.equal(fs.readFileSync(path.join(root, 'content/memoir/2025-03-31-2025-03-SWMaestro.md'), 'utf8'), handWritten)
})
