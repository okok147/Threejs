const RELEASE_STATUS_ORDER = [
  'local-only',
  'committed-not-pushed',
  'pushed-main',
  'deployed-preview',
  'deployed-production',
  'live-verified',
]

const RELEASE_STATUS_RANKS = new Map(RELEASE_STATUS_ORDER.map((status, index) => [status, index]))

export function resolveEffectiveReleaseTruth({ labReleaseStatus = '', versionReleaseStatus = '' }) {
  const labTruth = buildReleaseTruthLayer('lab', labReleaseStatus)
  const versionTruth = buildReleaseTruthLayer('version', versionReleaseStatus)
  const knownTruths = [labTruth, versionTruth].filter((truth) => truth)

  if (!knownTruths.length) {
    return {
      effectiveStatus: '',
      limitingLayer: 'unknown',
      labReleaseStatus,
      versionReleaseStatus,
    }
  }

  const blockingTruth = knownTruths.find((truth) => truth.status === 'blocked')
  if (blockingTruth) {
    return {
      effectiveStatus: 'blocked',
      limitingLayer: blockingTruth.layer,
      labReleaseStatus,
      versionReleaseStatus,
    }
  }

  const sortedTruths = [...knownTruths].sort((left, right) => left.rank - right.rank)
  const [effectiveTruth] = sortedTruths
  const limitingLayer =
    labTruth && versionTruth && labTruth.rank === versionTruth.rank ? 'aligned' : effectiveTruth.layer

  return {
    effectiveStatus: effectiveTruth.status,
    limitingLayer,
    labReleaseStatus,
    versionReleaseStatus,
  }
}

function buildReleaseTruthLayer(layer, status) {
  if (!status) {
    return null
  }

  if (status === 'blocked') {
    return { layer, status, rank: -1 }
  }

  if (!RELEASE_STATUS_RANKS.has(status)) {
    return null
  }

  return {
    layer,
    status,
    rank: RELEASE_STATUS_RANKS.get(status),
  }
}
