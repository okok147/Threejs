import test from 'node:test'
import assert from 'node:assert/strict'

import { syncLabHtmlMetadataDocument } from '../src/lib/lab-html-metadata.js'

const lab = {
  defaultVersion: 'v005',
  releaseStatus: 'committed-not-pushed',
  lastUpdated: '2026-03-28T15:12:00+08:00',
  htmlTitle: '光軌 | Versioned Three.js Style Laboratory',
  htmlDescription: '光軌是一個版本化的 three.js 前端風格實驗室，使用者可以切換並比較多個完整網站版本。',
}

test('syncLabHtmlMetadataDocument 會把漂移的 lab meta 行正規化成固定縮排', () => {
  const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="old description" />
    <title>Old title</title>
                              <meta name="lab-default-version" content="v004" />
                              <meta name="lab-release-status" content="pushed-main" />
                              <meta name="lab-last-updated" content="2026-03-27T23:37:13+08:00" />
                              <meta name="lab-release-fingerprint" content="v004|pushed-main|2026-03-27T23:37:13+08:00" />
  </head>
</html>
`

  const { document } = syncLabHtmlMetadataDocument({ document: html, lab })

  assert.match(document, /^    <meta name="lab-default-version" content="v005" \/>$/m)
  assert.match(document, /^    <meta name="lab-release-status" content="committed-not-pushed" \/>$/m)
  assert.match(document, /^    <meta name="lab-last-updated" content="2026-03-28T15:12:00\+08:00" \/>$/m)
  assert.match(
    document,
    /^    <meta name="lab-release-fingerprint" content="v005\|committed-not-pushed\|2026-03-28T15:12:00\+08:00" \/>$/m
  )
})

test('syncLabHtmlMetadataDocument 重跑時不會再製造新的 HTML 差異', () => {
  const html = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="description" content="old description" />
    <title>Old title</title>
                              <meta name="lab-default-version" content="v004" />
                              <meta name="lab-release-status" content="pushed-main" />
                              <meta name="lab-last-updated" content="2026-03-27T23:37:13+08:00" />
                              <meta name="lab-release-fingerprint" content="v004|pushed-main|2026-03-27T23:37:13+08:00" />
  </head>
</html>
`

  const firstSync = syncLabHtmlMetadataDocument({ document: html, lab }).document
  const secondSync = syncLabHtmlMetadataDocument({ document: firstSync, lab }).document

  assert.equal(secondSync, firstSync)
})
