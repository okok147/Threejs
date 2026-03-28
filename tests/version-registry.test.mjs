import test from 'node:test'
import assert from 'node:assert/strict'

import {
  createVersionRendererRegistry,
  hasRenderVersionExport,
  normalizeVersionModulePath,
} from '../src/lib/version-registry.js'

test('normalizeVersionModulePath 會把 import.meta.glob 路徑轉成 manifest entryFile 路徑', () => {
  assert.equal(
    normalizeVersionModulePath('../versions/v005-tidal-atlas/index.js'),
    'versions/v005-tidal-atlas/index.js'
  )
})

test('createVersionRendererRegistry 會只收錄具備 renderVersion 匯出的版本模組', () => {
  const renderV001 = () => {}
  const registry = createVersionRendererRegistry({
    '../versions/v001-orbit-cinematic/index.js': {
      renderVersion: renderV001,
    },
    '../versions/v999-broken/index.js': {
      somethingElse: () => {},
    },
  })

  assert.equal(registry.get('versions/v001-orbit-cinematic/index.js'), renderV001)
  assert.equal(registry.has('versions/v999-broken/index.js'), false)
})

test('hasRenderVersionExport 可辨識具名函式與 re-export 形式', () => {
  assert.equal(hasRenderVersionExport("export function renderVersion() { return null }"), true)
  assert.equal(hasRenderVersionExport("const renderVersion = () => null\\nexport { renderVersion }"), true)
  assert.equal(hasRenderVersionExport("export function mountVersion() { return null }"), false)
})
