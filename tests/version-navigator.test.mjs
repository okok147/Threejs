import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildSearchIndex,
  getCompareAxes,
  getSuggestedCompareVersions,
  getVersionTabIntent,
  isValidCompareTarget,
  resolveInitialCompareVersion,
  resolveInitialVersion,
} from '../src/lib/version-navigator.js'

const versions = [
  {
    versionNumber: 'v001',
    slug: 'orbit-cinematic',
    title: 'Orbit Cinematic',
    concept: 'Poster-first hero',
    styleFamily: 'Cinematic orbital narrative',
    useCaseEmphasis: '品牌發表頁',
    bestFor: '世界觀首頁',
    navigationModel: '固定頂部導覽',
    motionLanguage: 'orbital drift',
    narrativeStructure: 'hero -> archive',
    sceneTreatment: '單一核心物件',
    snapshotReadiness: 'preview-only',
    snapshotNotes: '只有概念海報',
    releaseStatus: 'committed-not-pushed',
    releaseNotes: '已本地提交',
    keyTraits: ['滿版 hero', '單一主物件'],
    sourceFamiliesConsulted: ['official three.js documentation'],
    notableUxIdeas: ['scroll-phase scene choreography'],
    notableFeatureIdeas: ['shared content separated from presentation'],
    previewArtifacts: [
      {
        path: 'screenshots/v001/poster.svg',
        label: 'Orbit poster',
        alt: 'v001 poster',
        kind: 'illustrated-poster',
        origin: 'repo 內維護的向量海報預覽',
      },
    ],
  },
  {
    versionNumber: 'v002',
    slug: 'signal-ledger',
    title: 'Signal Ledger',
    concept: 'Editorial ledger',
    styleFamily: 'Editorial atlas / signal ledger',
    useCaseEmphasis: '作品集索引',
    bestFor: '快速瀏覽版本治理',
    navigationModel: '章節 anchors',
    motionLanguage: 'editorial drift',
    narrativeStructure: 'manifesto -> archive',
    sceneTreatment: '右側儀表面板',
    snapshotReadiness: 'preview-only',
    snapshotNotes: '只有概念海報',
    releaseStatus: 'committed-not-pushed',
    releaseNotes: '已本地提交',
    keyTraits: ['paper-toned grid', 'clipped 3D instrument'],
    sourceFamiliesConsulted: ['official design systems'],
    notableUxIdeas: ['lab method surfaced'],
    notableFeatureIdeas: ['version registry surfaced in the global dock'],
    previewArtifacts: [
      {
        path: 'screenshots/v002/poster.svg',
        label: 'Signal poster',
        alt: 'v002 poster',
        kind: 'illustrated-poster',
        origin: 'repo 內維護的向量海報預覽',
      },
    ],
  },
  {
    versionNumber: 'v003',
    slug: 'museum-monograph',
    title: 'Museum Monograph',
    concept: 'Curated exhibit reading',
    styleFamily: 'Museum monograph / exhibition dossier',
    useCaseEmphasis: '案例深讀頁',
    bestFor: '深讀單一案例',
    navigationModel: '左側固定 rail',
    motionLanguage: 'gallery drift',
    narrativeStructure: 'curator note -> study room',
    sceneTreatment: '被框進展櫃的 3D 展件',
    snapshotReadiness: 'preview-only',
    snapshotNotes: '只有概念海報',
    releaseStatus: 'committed-not-pushed',
    releaseNotes: '已本地提交',
    keyTraits: ['策展型雙軸閱讀', 'study room version wall'],
    sourceFamiliesConsulted: ['curated exhibition inspiration'],
    notableUxIdeas: ['specimen register'],
    notableFeatureIdeas: ['framed exhibit case'],
    previewArtifacts: [
      {
        path: 'screenshots/v003/poster.svg',
        label: 'Museum poster',
        alt: 'v003 poster',
        kind: 'illustrated-poster',
        origin: 'repo 內維護的向量海報預覽',
      },
    ],
  },
]

const versionMap = new Map(versions.map((version) => [version.versionNumber, version]))
const lab = {
  releaseStatus: 'committed-not-pushed',
  releaseNotes: '最新共享 shell 僅在本地 commit',
  hostedUrl: 'https://okok147.github.io/Threejs/',
  liveVerificationNotes: 'hosted URL 可達，但不代表本地工作樹已部署',
}

test('resolveInitialVersion 依序使用 query、storage、defaultVersion', () => {
  assert.equal(
    resolveInitialVersion({
      requestedVersion: 'v002',
      storedVersion: 'v001',
      defaultVersion: 'v003',
      versionMap,
    }),
    'v002'
  )

  assert.equal(
    resolveInitialVersion({
      requestedVersion: 'v999',
      storedVersion: 'v001',
      defaultVersion: 'v003',
      versionMap,
    }),
    'v001'
  )

  assert.equal(
    resolveInitialVersion({
      requestedVersion: 'v999',
      storedVersion: 'v998',
      defaultVersion: 'v003',
      versionMap,
    }),
    'v003'
  )
})

test('resolveInitialCompareVersion 只接受有效 compare target', () => {
  assert.equal(
    resolveInitialCompareVersion({
      activeVersion: 'v002',
      requestedCompare: 'v003',
      storedCompare: 'v001',
      versionMap,
    }),
    'v003'
  )

  assert.equal(
    resolveInitialCompareVersion({
      activeVersion: 'v002',
      requestedCompare: 'v002',
      storedCompare: 'v001',
      versionMap,
    }),
    'v001'
  )

  assert.equal(
    resolveInitialCompareVersion({
      activeVersion: 'v002',
      requestedCompare: 'v999',
      storedCompare: 'v002',
      versionMap,
    }),
    ''
  )
})

test('isValidCompareTarget 排除自己與不存在的版本', () => {
  assert.equal(isValidCompareTarget({ activeVersion: 'v001', compareVersion: 'v002', versionMap }), true)
  assert.equal(isValidCompareTarget({ activeVersion: 'v001', compareVersion: 'v001', versionMap }), false)
  assert.equal(isValidCompareTarget({ activeVersion: 'v001', compareVersion: 'v999', versionMap }), false)
})

test('getVersionTabIntent 維持 manual-activation tabs 規則', () => {
  assert.deepEqual(
    getVersionTabIntent({ key: 'ArrowRight', currentVersion: 'v001', versionNumbers: ['v001', 'v002', 'v003'] }),
    { type: 'focus', versionNumber: 'v002' }
  )

  assert.deepEqual(
    getVersionTabIntent({ key: 'ArrowLeft', currentVersion: 'v001', versionNumbers: ['v001', 'v002', 'v003'] }),
    { type: 'focus', versionNumber: 'v003' }
  )

  assert.deepEqual(
    getVersionTabIntent({ key: 'Home', currentVersion: 'v003', versionNumbers: ['v001', 'v002', 'v003'] }),
    { type: 'focus', versionNumber: 'v001' }
  )

  assert.deepEqual(
    getVersionTabIntent({ key: 'Enter', currentVersion: 'v002', versionNumbers: ['v001', 'v002', 'v003'] }),
    { type: 'activate', versionNumber: 'v002' }
  )

  assert.deepEqual(
    getVersionTabIntent({ key: 'Space', currentVersion: 'v002', versionNumbers: ['v001', 'v002', 'v003'] }),
    { type: 'activate', versionNumber: 'v002' }
  )
})

test('getSuggestedCompareVersions 優先回傳相鄰版本且不重複', () => {
  assert.deepEqual(
    getSuggestedCompareVersions({ versionNumber: 'v002', versions }).map((version) => version.versionNumber),
    ['v001', 'v003']
  )

  assert.deepEqual(
    getSuggestedCompareVersions({ versionNumber: 'v001', versions }).map((version) => version.versionNumber),
    ['v002', 'v003']
  )
})

test('buildSearchIndex 收錄 compare / release / preview 關鍵字並轉成小寫', () => {
  const searchIndex = buildSearchIndex({ version: versions[0], lab })

  assert.equal(searchIndex.includes('official three.js documentation'.toLowerCase()), true)
  assert.equal(searchIndex.includes('repo 內維護的向量海報預覽'.toLowerCase()), true)
  assert.equal(searchIndex.includes('https://okok147.github.io/threejs/'), true)
  assert.equal(searchIndex.includes('committed-not-pushed'), true)
})

test('getCompareAxes 優先保留真正不同的差異軸線', () => {
  const axes = getCompareAxes(versions[0], versions[1])

  assert.equal(axes.length <= 4, true)
  assert.equal(axes.every((axis) => axis.current !== axis.target), true)
  assert.equal(axes.some((axis) => axis.label === 'Visual language'), true)
})
