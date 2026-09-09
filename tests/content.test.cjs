const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { readPosts, slugFromFilename } = require('../lib/content.cjs')

test('preserve the live memoir URL', () => {
  assert.equal(slugFromFilename('2025-03-SWMaestro.md'), '2025-03-SWMaestro')
  assert.equal(slugFromFilename('2026-09-09-새-글.md'), '새-글')
  assert.ok(readPosts().some((post) => post.slug === '2025-03-SWMaestro'))
  assert.ok(readPosts().every((post) => post.title !== 'sample'))
})

test('YAML syntax, drafts, updates and duplicate URLs use the same loader', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-content-'))
  t.after(() => fs.rmSync(root, { recursive: true }))
  fs.mkdirSync(path.join(root, 'memoir'))
  const post = '---\ntitle: 한글 제목\ncategory: memoir\ndate: 2025-03-31\nupdatedAt: 2026-09-09T01:00:00Z\ntags:\n  - "쉼표, 태그"\n  - "따옴표\\\""\n---\n\n본문'
  fs.writeFileSync(path.join(root, 'memoir', '2025-03-31-post.md'), post)
  fs.writeFileSync(path.join(root, 'memoir', 'draft.md'), '---\ndraft: true\n---\n비공개')
  const posts = readPosts(root)
  assert.equal(posts.length, 1)
  assert.equal(posts[0].tags[0], '쉼표, 태그')
  assert.equal(posts[0].description, '본문')
  assert.ok(posts[0].updatedAt.startsWith('2026-09-09'))
  const midnight = post.replace('2025-03-31', '2026-09-09').replace('2026-09-09T01:00:00Z', '"2026-09-09T00:30:00+09:00"')
  fs.writeFileSync(path.join(root, 'memoir', '2025-03-31-post.md'), midnight)
  assert.equal(readPosts(root)[0].updatedAt, '2026-09-09T00:30:00+09:00')
  fs.writeFileSync(path.join(root, 'memoir', '2026-09-09-post.md'), post)
  assert.throws(() => readPosts(root), /duplicate post URL/)
})

test('calendar dates remain stable and modification dates display in Korea time', () => {
  const ts = require('typescript')
  const vm = require('node:vm')
  const source = fs.readFileSync(path.join(__dirname, '../src/lib/dateUtils.ts'), 'utf8')
  const exports = {}
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
  vm.runInNewContext(outputText, { exports, Intl, Date })
  assert.equal(exports.formatDot('2025-03-31'), '2025.03.31')
  assert.equal(exports.formatDot('2026-09-08T16:00:00Z'), '2026.09.09')
  assert.equal(exports.formatDate('2026-09-09T00:30:00+09:00'), '9 Sep, 2026')
})
