import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { syncLabHtmlMetadataDocument } from '../src/lib/lab-html-metadata.js'

const root = process.cwd()
const manifestPath = path.join(root, 'version-manifest.json')
const indexPath = path.join(root, 'index.html')

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const indexHtml = await readFile(indexPath, 'utf8')

const { lab } = manifest
const { document: nextHtml, releaseFingerprint } = syncLabHtmlMetadataDocument({
  document: indexHtml,
  lab,
})

manifest.lab.releaseFingerprint = releaseFingerprint

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(indexPath, nextHtml)

console.log(`Synced lab HTML metadata with fingerprint ${releaseFingerprint}.`)
