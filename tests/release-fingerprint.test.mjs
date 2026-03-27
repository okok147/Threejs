import test from 'node:test'
import assert from 'node:assert/strict'

import { buildLabReleaseFingerprint } from '../src/lib/release-fingerprint.js'

test('buildLabReleaseFingerprint 會用 defaultVersion、releaseStatus 與 lastUpdated 建立穩定指紋', () => {
  assert.equal(
    buildLabReleaseFingerprint({
      defaultVersion: 'v004',
      releaseStatus: 'blocked',
      lastUpdated: '2026-03-27T23:25:58+08:00',
    }),
    'v004|blocked|2026-03-27T23:25:58+08:00'
  )
})
