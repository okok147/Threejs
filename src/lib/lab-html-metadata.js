import { buildLabReleaseFingerprint } from './release-fingerprint.js'

export function syncLabHtmlMetadataDocument({ document, lab }) {
  if (!lab?.htmlTitle || !lab?.htmlDescription || !lab?.lastUpdated || !lab?.defaultVersion || !lab?.releaseStatus) {
    throw new Error('Manifest lab metadata must include htmlTitle, htmlDescription, defaultVersion, releaseStatus, and lastUpdated.')
  }

  const releaseFingerprint = buildLabReleaseFingerprint({
    defaultVersion: lab.defaultVersion,
    releaseStatus: lab.releaseStatus,
    lastUpdated: lab.lastUpdated,
  })

  let nextHtml = replaceTagContent(document, 'title', lab.htmlTitle)
  nextHtml = replaceMetaContent(nextHtml, 'description', lab.htmlDescription)
  nextHtml = upsertNamedMeta(nextHtml, 'lab-default-version', lab.defaultVersion)
  nextHtml = upsertNamedMeta(nextHtml, 'lab-release-status', lab.releaseStatus)
  nextHtml = upsertNamedMeta(nextHtml, 'lab-last-updated', lab.lastUpdated)
  nextHtml = upsertNamedMeta(nextHtml, 'lab-release-fingerprint', releaseFingerprint)

  return {
    document: nextHtml,
    releaseFingerprint,
  }
}

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
  const pattern = new RegExp(
    `^[ \\t]*<meta\\s+name="${escapeRegExp(metaName)}"\\s+content="[^"]*"\\s*\\/?>[ \\t]*$`,
    'im'
  )
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
