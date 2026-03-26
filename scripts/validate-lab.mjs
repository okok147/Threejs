import { access, readFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const manifestPath = path.join(root, 'version-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))

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
  'timestamp',
  'status',
]

const nonEmptyArrayFields = [
  'sourcePrinciples',
  'sourceFamiliesConsulted',
  'keyTraits',
  'notableUxIdeas',
  'notableFeatureIdeas',
  'performanceNotes',
  'screenshotPaths',
]

const allowedStatuses = new Set(['stable', 'experimental', 'draft', 'archived', 'blocked'])
const seenVersions = new Set()
const seenSlugs = new Set()
const errors = []

if (!Array.isArray(manifest.versions) || !manifest.versions.length) {
  errors.push('Manifest must include at least one registered version.')
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

  if (typeof entry.route !== 'string' || !entry.route.includes(entry.versionNumber)) {
    errors.push(`${entry.versionNumber ?? 'unknown'} route should include its version number`)
  }

  seenVersions.add(entry.versionNumber)
  seenSlugs.add(entry.slug)

  await ensureFile(entry.entryFile, errors)
  await ensureFile(entry.tokenFile, errors)

  for (const screenshotPath of entry.screenshotPaths ?? []) {
    await ensureFile(screenshotPath, errors)
  }
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
