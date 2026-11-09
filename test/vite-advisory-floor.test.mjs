import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(join(root, 'package.json'))

function parseSemver(version) {
  const [major, minor, patch] = version.split('.').map((part) => Number.parseInt(part, 10))
  assert.ok([major, minor, patch].every(Number.isInteger), `invalid semver: ${version}`)
  return { major, minor, patch }
}

function isAtLeast(version, minimum) {
  const current = parseSemver(version)
  const floor = parseSemver(minimum)
  if (current.major !== floor.major) return current.major > floor.major
  if (current.minor !== floor.minor) return current.minor > floor.minor
  return current.patch >= floor.patch
}

test('lockfile pins Vite to the GHSA-patched 8.1.6 floor', () => {
  const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'))
  const resolved = lock.packages['node_modules/vite']?.version
  assert.equal(typeof resolved, 'string', 'node_modules/vite missing from package-lock.json')
  assert.ok(
    isAtLeast(resolved, '8.1.6'),
    `vite ${resolved} is below the GitHub Advisory patched floor 8.1.6 (GHSA-587h-7wmj-h5pm)`,
  )
  assert.equal(parseSemver(resolved).major, 8, `vite major drifted: ${resolved}`)
})

test('installed Vite matches the lockfile and stays on 8.1.x patched floor', () => {
  const { version } = require('vite/package.json')
  assert.ok(isAtLeast(version, '8.1.6'), `installed vite ${version} is below 8.1.6`)
  assert.equal(parseSemver(version).major, 8, `installed vite major drifted: ${version}`)
})

test('Vite config stays on default SPA mode (not custom middleware)', () => {
  const source = readFileSync(join(root, 'vite.config.ts'), 'utf8')
  assert.equal(source.includes("appType: 'custom'"), false)
  assert.equal(source.includes('appType: "custom"'), false)
  assert.equal(source.includes('middlewareMode: true'), false)
})
