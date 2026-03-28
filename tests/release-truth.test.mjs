import test from 'node:test'
import assert from 'node:assert/strict'

import { resolveEffectiveReleaseTruth } from '../src/lib/release-truth.js'

test('resolveEffectiveReleaseTruth 在 lab 與 version 對齊時保留相同狀態', () => {
  assert.deepEqual(
    resolveEffectiveReleaseTruth({
      labReleaseStatus: 'pushed-main',
      versionReleaseStatus: 'pushed-main',
    }),
    {
      effectiveStatus: 'pushed-main',
      limitingLayer: 'aligned',
      labReleaseStatus: 'pushed-main',
      versionReleaseStatus: 'pushed-main',
    }
  )
})

test('resolveEffectiveReleaseTruth 會在 shared lab shell 落後時降級整體 route truth', () => {
  assert.deepEqual(
    resolveEffectiveReleaseTruth({
      labReleaseStatus: 'committed-not-pushed',
      versionReleaseStatus: 'pushed-main',
    }),
    {
      effectiveStatus: 'committed-not-pushed',
      limitingLayer: 'lab',
      labReleaseStatus: 'committed-not-pushed',
      versionReleaseStatus: 'pushed-main',
    }
  )
})

test('resolveEffectiveReleaseTruth 會在版本條目落後時保留較低的版本狀態', () => {
  assert.deepEqual(
    resolveEffectiveReleaseTruth({
      labReleaseStatus: 'deployed-production',
      versionReleaseStatus: 'pushed-main',
    }),
    {
      effectiveStatus: 'pushed-main',
      limitingLayer: 'version',
      labReleaseStatus: 'deployed-production',
      versionReleaseStatus: 'pushed-main',
    }
  )
})

test('resolveEffectiveReleaseTruth 會把 blocked 視為最高優先的限制層', () => {
  assert.deepEqual(
    resolveEffectiveReleaseTruth({
      labReleaseStatus: 'deployed-production',
      versionReleaseStatus: 'blocked',
    }),
    {
      effectiveStatus: 'blocked',
      limitingLayer: 'version',
      labReleaseStatus: 'deployed-production',
      versionReleaseStatus: 'blocked',
    }
  )
})
