// Local production build helper.
// The local-only /admin + /api routes (gitignored) break static export
// (`output: 'export'`), so this script moves them aside, runs the same build
// CI runs, then restores them — even if the build fails.
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const root = process.cwd()
const backupDir = path.join(root, '.admin-backup')

// directories that must not exist during a static-export build
const LOCAL_ONLY = ['src/app/admin', 'src/app/api']

const moved = []

function setAside() {
  fs.mkdirSync(backupDir, { recursive: true })
  for (const rel of LOCAL_ONLY) {
    const from = path.join(root, rel)
    if (fs.existsSync(from)) {
      const to = path.join(backupDir, rel.replace(/[\\/]/g, '__'))
      fs.renameSync(from, to)
      moved.push({ from, to })
    }
  }
  if (moved.length) console.log(`🔧 set aside local-only: ${moved.map((m) => path.relative(root, m.from)).join(', ')}`)
}

function restore() {
  for (const { from, to } of moved.reverse()) {
    if (fs.existsSync(to)) {
      fs.mkdirSync(path.dirname(from), { recursive: true })
      fs.renameSync(to, from)
    }
  }
  try {
    fs.rmSync(backupDir, { recursive: true, force: true })
  } catch {}
  if (moved.length) console.log('↩️  restored local-only admin/api')
}

process.on('SIGINT', () => {
  restore()
  process.exit(1)
})

try {
  setAside()
  execSync('npm run build', {
    stdio: 'inherit',
    cwd: root,
    env: { ...process.env, NODE_ENV: 'production' },
  })
  console.log('\n✅ Static site built to ./out  —  preview with:  npx serve out')
} finally {
  restore()
}
