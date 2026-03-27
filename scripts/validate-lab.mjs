import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const manifestPath = path.join(root, 'version-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

const labRequiredFields = [
  'title',
  'defaultVersion',
  'switcherMode',
  'compareMode',
  'hostedUrl',
  'releaseStatus',
  'releaseNotes',
  'lastLiveVerificationAt',
  'liveVerificationNotes',
  'lastUpdated',
]

const requiredFields = [
  'versionNumber',
  'slug',
  'title',
  'concept',
  'sourcePrinciples',
  'sourceFamiliesConsulted',
  'styleFamily',
  'useCaseEmphasis',
  'bestFor',
  'keyTraits',
  'navigationModel',
  'motionLanguage',
  'narrativeStructure',
  'sceneTreatment',
  'notableUxIdeas',
  'notableFeatureIdeas',
  'performanceNotes',
  'entryFile',
  'route',
  'tokenFile',
  'screenshotPaths',
  'previewArtifacts',
  'snapshotReadiness',
  'snapshotNotes',
  'timestamp',
  'status',
  'releaseStatus',
  'releaseNotes',
]

const nonEmptyArrayFields = [
  'sourcePrinciples',
  'sourceFamiliesConsulted',
  'keyTraits',
  'notableUxIdeas',
  'notableFeatureIdeas',
  'performanceNotes',
  'screenshotPaths',
  'previewArtifacts',
]

const allowedStatuses = new Set(['stable', 'experimental', 'draft', 'archived', 'blocked'])
const allowedReleaseStatuses = new Set([
  'local-only',
  'committed-not-pushed',
  'pushed-main',
  'deployed-preview',
  'deployed-production',
  'live-verified',
  'blocked',
])
const allowedSnapshotReadiness = new Set(['preview-only', 'browser-captured', 'capture-blocked'])
const allowedPreviewKinds = new Set(['illustrated-poster', 'browser-screenshot', 'section-capture'])
const seenVersions = new Set()
const seenSlugs = new Set()
const errors = []

if (!Array.isArray(manifest.versions) || !manifest.versions.length) {
  errors.push('Manifest must include at least one registered version.')
}

if (!manifest.lab || typeof manifest.lab !== 'object') {
  errors.push('Manifest must include a lab metadata object.')
} else {
  labRequiredFields.forEach((field) => {
    if (!(field in manifest.lab)) {
      errors.push(`Lab metadata missing field: ${field}`)
    }
  })

  if (!allowedReleaseStatuses.has(manifest.lab.releaseStatus)) {
    errors.push(`Lab metadata has unsupported releaseStatus: ${manifest.lab.releaseStatus}`)
  }

  if (typeof manifest.lab.hostedUrl !== 'string' || !/^https?:\/\//.test(manifest.lab.hostedUrl)) {
    errors.push('Lab metadata hostedUrl must be an absolute http(s) URL.')
  }
}

for (const entry of manifest.versions ?? []) {
  requiredFields.forEach((field) => {
    if (!(field in entry)) {
      errors.push(`${entry.versionNumber ?? 'unknown'} missing field: ${field}`)
    }
  })

  nonEmptyArrayFields.forEach((field) => {
    if (!Array.isArray(entry[field]) || entry[field].length === 0) {
      errors.push(`${entry.versionNumber ?? 'unknown'} requires a non-empty array for ${field}`)
    }
  })

  if (seenVersions.has(entry.versionNumber)) {
    errors.push(`Duplicate version number: ${entry.versionNumber}`)
  }

  if (seenSlugs.has(entry.slug)) {
    errors.push(`Duplicate slug: ${entry.slug}`)
  }

  if (!allowedStatuses.has(entry.status)) {
    errors.push(`${entry.versionNumber ?? 'unknown'} has unsupported status: ${entry.status}`)
  }

  if (!allowedReleaseStatuses.has(entry.releaseStatus)) {
    errors.push(`${entry.versionNumber ?? 'unknown'} has unsupported releaseStatus: ${entry.releaseStatus}`)
  }

  if (!allowedSnapshotReadiness.has(entry.snapshotReadiness)) {
    errors.push(
      `${entry.versionNumber ?? 'unknown'} has unsupported snapshotReadiness: ${entry.snapshotReadiness}`
    )
  }

  if (typeof entry.route !== 'string' || !entry.route.includes(entry.versionNumber)) {
    errors.push(`${entry.versionNumber ?? 'unknown'} route should include its version number`)
  }

  const previewArtifactPaths = new Set()

  for (const artifact of entry.previewArtifacts ?? []) {
    if (!artifact || typeof artifact !== 'object') {
      errors.push(`${entry.versionNumber ?? 'unknown'} has an invalid preview artifact entry`)
      continue
    }

    ;['path', 'label', 'alt', 'kind', 'origin'].forEach((field) => {
      if (!artifact[field]) {
        errors.push(`${entry.versionNumber ?? 'unknown'} preview artifact missing field: ${field}`)
      }
    })

    if (artifact.kind && !allowedPreviewKinds.has(artifact.kind)) {
      errors.push(`${entry.versionNumber ?? 'unknown'} has unsupported preview kind: ${artifact.kind}`)
    }

    if (artifact.path) {
      previewArtifactPaths.add(artifact.path)
      await ensureFile(artifact.path, errors)
    }
  }

  for (const screenshotPath of entry.screenshotPaths ?? []) {
    if (!previewArtifactPaths.has(screenshotPath)) {
      errors.push(
        `${entry.versionNumber ?? 'unknown'} screenshot path must also appear in previewArtifacts: ${screenshotPath}`
      )
    }
  }

  seenVersions.add(entry.versionNumber)
  seenSlugs.add(entry.slug)

  await ensureFile(entry.entryFile, errors)
  await ensureFile(entry.tokenFile, errors)

  for (const screenshotPath of entry.screenshotPaths ?? []) {
    await ensureFile(screenshotPath, errors)
  }
}

if (manifest.lab?.defaultVersion && !seenVersions.has(manifest.lab.defaultVersion)) {
  errors.push(`Lab defaultVersion is not registered: ${manifest.lab.defaultVersion}`)
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Validated ${manifest.versions.length} lab versions.`)

async function ensureFile(filePath, errorsList) {
  if (!filePath) {
    errorsList.push('Encountered missing file path in manifest')
    return
  }

  try {
    await access(path.join(root, filePath))
  } catch (error) {
    errorsList.push(`Missing file: ${filePath}`)
  }
}
