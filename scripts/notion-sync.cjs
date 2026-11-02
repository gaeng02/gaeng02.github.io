// Pull published posts from Notion into content/. Run by .github/workflows/notion-sync.yml.
const { Client } = require('@notionhq/client')
const { syncNotion } = require('../lib/notion.cjs')

async function main() {
  const { NOTION_TOKEN: auth, NOTION_DATABASE_ID: databaseId } = process.env
  if (!auth || !databaseId) {
    console.log('NOTION_TOKEN 또는 NOTION_DATABASE_ID가 없어 동기화를 건너뜁니다.')
    return
  }
  const result = await syncNotion({ notion: new Client({ auth }), databaseId, root: process.cwd() })
  for (const file of result.written) console.log(`반영: ${file}`)
  for (const file of result.removed) console.log(`내림: ${file}`)
  console.log(`변경 없음: ${result.skipped.length}편`)
  for (const error of result.errors) console.log(`::warning::${error}`)
}

main().catch((error) => {
  console.error(`::error::${error.message}`)
  process.exit(1)
})
