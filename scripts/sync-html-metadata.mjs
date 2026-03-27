import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { buildLabReleaseFingerprint } from '../src/lib/release-fingerprint.js'

const root = process.cwd()
const manifestPath = path.join(root, 'version-manifest.json')
const indexPath = path.join(root, 'index.html')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const indexHtml = await readFile(indexPath, 'utf8')

const { lab } = manifest

if (!lab?.htmlTitle || !lab?.htmlDescription || !lab?.lastUpdated || !lab?.defaultVersion || !lab?.releaseStatus) {
  throw new Error('Manifest lab metadata must include htmlTitle, htmlDescription, defaultVersion, releaseStatus, and lastUpdated.')
}

const releaseFingerprint = buildLabReleaseFingerprint({
  defaultVersion: lab.defaultVersion,
  releaseStatus: lab.releaseStatus,
  lastUpdated: lab.lastUpdated,
})

manifest.lab.releaseFingerprint = releaseFingerprint

let nextHtml = replaceTagContent(indexHtml, 'title', lab.htmlTitle)
nextHtml = replaceMetaContent(nextHtml, 'description', lab.htmlDescription)
nextHtml = upsertNamedMeta(nextHtml, 'lab-default-version', lab.defaultVersion)
nextHtml = upsertNamedMeta(nextHtml, 'lab-release-status', lab.releaseStatus)
nextHtml = upsertNamedMeta(nextHtml, 'lab-last-updated', lab.lastUpdated)
nextHtml = upsertNamedMeta(nextHtml, 'lab-release-fingerprint', releaseFingerprint)

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(indexPath, nextHtml)

console.log(`Synced lab HTML metadata with fingerprint ${releaseFingerprint}.`)

function replaceTagContent(document, tagName, content) {
  const pattern = new RegExp(`(<${tagName}[^>]*>)([\\s\\S]*?)(</${tagName}>)`, 'i')

  if (!pattern.test(document)) {
    throw new Error(`Unable to find <${tagName}> tag in index.html`)
  }

  return document.replace(pattern, `$1${escapeHtml(content)}$3`)
}

function replaceMetaContent(document, metaName, content) {
  const pattern = new RegExp(
    `(<meta\\s+name="${escapeRegExp(metaName)}"\\s+content=")([^"]*)("\\s*\\/?>)`,
    'i'
  )

  if (!pattern.test(document)) {
    throw new Error(`Unable to find meta[name="${metaName}"] in index.html`)
  }

  return document.replace(pattern, `$1${escapeAttribute(content)}$3`)
}

function upsertNamedMeta(document, metaName, content) {
  const pattern = new RegExp(`<meta\\s+name="${escapeRegExp(metaName)}"\\s+content="[^"]*"\\s*\\/?>`, 'i')
  const nextTag = `    <meta name="${metaName}" content="${escapeAttribute(content)}" />`

  if (pattern.test(document)) {
    return document.replace(pattern, nextTag)
  }

  return document.replace('</head>', `${nextTag}\n  </head>`)
}

function escapeAttribute(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;')
}

function escapeHtml(value) {
  return escapeAttribute(value).replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
