export function buildLabReleaseFingerprint({ defaultVersion = '', releaseStatus = '', lastUpdated = '' }) {
  return [defaultVersion, releaseStatus, lastUpdated].join('|')
}
