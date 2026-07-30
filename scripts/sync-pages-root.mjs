import { cpSync, rmSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/** Copy Vite dist output to repo root for GitHub Pages (legacy: main /). */
const root = process.cwd()
const dist = join(root, 'dist')
const assets = join(root, 'assets')

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run build first')
  process.exit(1)
}

if (existsSync(assets)) {
  rmSync(assets, { recursive: true, force: true })
}

cpSync(join(dist, 'assets'), assets, { recursive: true })
cpSync(join(dist, 'index.html'), join(root, 'index.html'))
cpSync(join(dist, '404.html'), join(root, '404.html'))
if (existsSync(join(dist, 'favicon.svg'))) {
  cpSync(join(dist, 'favicon.svg'), join(root, 'favicon.svg'))
}

console.log('Synced dist → repo root for GitHub Pages')
