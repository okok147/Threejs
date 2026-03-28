import { resolveEffectiveReleaseTruth } from './release-truth.js'

export function resolveInitialVersion({ requestedVersion = '', storedVersion = '', defaultVersion, versionMap }) {
  if (hasVersion(versionMap, requestedVersion)) {
    return requestedVersion
  }

  if (hasVersion(versionMap, storedVersion)) {
    return storedVersion
  }

  return defaultVersion
}

export function resolveInitialCompareVersion({
  activeVersion = '',
  requestedCompare = '',
  storedCompare = '',
  versionMap,
}) {
  if (isValidCompareTarget({ activeVersion, compareVersion: requestedCompare, versionMap })) {
    return requestedCompare
  }

  if (isValidCompareTarget({ activeVersion, compareVersion: storedCompare, versionMap })) {
    return storedCompare
  }

  return ''
}

export function resolveNavigatorRouteState({
  search = '',
  defaultVersion,
  versionMap,
  storedVersion = '',
  storedCompare = '',
}) {
  const params = new URLSearchParams(search)
  const activeVersionNumber = resolveInitialVersion({
    requestedVersion: params.get('v'),
    storedVersion,
    defaultVersion,
    versionMap,
  })

  return {
    activeVersionNumber,
    compareVersionNumber: resolveInitialCompareVersion({
      activeVersion: activeVersionNumber,
      requestedCompare: params.get('compare'),
      storedCompare,
      versionMap,
    }),
  }
}

export function buildNavigatorUrl({
  pathname = '/',
  search = '',
  hash = '',
  versionNumber = '',
  compareVersion = '',
}) {
  const params = new URLSearchParams(search)
  params.set('v', versionNumber)

  if (compareVersion) {
    params.set('compare', compareVersion)
  } else {
    params.delete('compare')
  }

  const queryString = params.toString()
  return `${pathname}${queryString ? `?${queryString}` : ''}${hash}`
}

export function buildSearchIndex({ version, lab }) {
  const releaseTruth = resolveEffectiveReleaseTruth({
    labReleaseStatus: lab.releaseStatus,
    versionReleaseStatus: version.releaseStatus,
  })

  return [
    version.versionNumber,
    version.slug,
    version.title,
    version.concept,
    version.styleFamily,
    version.useCaseEmphasis,
    version.bestFor,
    version.navigationModel,
    version.motionLanguage,
    version.narrativeStructure,
    version.sceneTreatment,
    version.snapshotReadiness,
    version.snapshotNotes,
    version.releaseStatus,
    version.releaseNotes,
    releaseTruth.effectiveStatus,
    lab.releaseStatus,
    lab.releaseNotes,
    lab.hostedUrl,
    lab.liveVerificationNotes,
    ...(version.keyTraits ?? []),
    ...(version.sourceFamiliesConsulted ?? []),
    ...(version.notableUxIdeas ?? []),
    ...(version.notableFeatureIdeas ?? []),
    ...((version.previewArtifacts ?? []).flatMap((artifact) => [artifact.label, artifact.kind, artifact.origin])),
  ]
    .join(' ')
    .toLowerCase()
}

export function getSuggestedCompareVersions({ versionNumber, versions }) {
  const versionNumbers = versions.map((version) => version.versionNumber)
  const currentIndex = versionNumbers.indexOf(versionNumber)
  const candidates = []

  pushUniqueVersion(candidates, versions[currentIndex - 1], versionNumber)
  pushUniqueVersion(candidates, versions[currentIndex + 1], versionNumber)
  pushUniqueVersion(candidates, versions[0], versionNumber)
  pushUniqueVersion(candidates, versions.at(-1), versionNumber)

  return candidates.slice(0, 2)
}

export function getCompareAxes(currentVersion, compareVersion) {
  const axes = [
    {
      label: 'Visual language',
      current: currentVersion.styleFamily,
      target: compareVersion.styleFamily,
    },
    {
      label: 'Best for',
      current: currentVersion.bestFor,
      target: compareVersion.bestFor,
    },
    {
      label: 'Navigation',
      current: currentVersion.navigationModel,
      target: compareVersion.navigationModel,
    },
    {
      label: 'Motion',
      current: currentVersion.motionLanguage,
      target: compareVersion.motionLanguage,
    },
    {
      label: 'Scene treatment',
      current: currentVersion.sceneTreatment,
      target: compareVersion.sceneTreatment,
    },
    {
      label: 'Narrative',
      current: currentVersion.narrativeStructure,
      target: compareVersion.narrativeStructure,
    },
  ]

  const distinctAxes = axes.filter((axis) => axis.current !== axis.target)
  return distinctAxes.length ? distinctAxes.slice(0, 4) : axes.slice(0, 3)
}

export function getVersionTabIntent({ key, currentVersion = '', versionNumbers = [] }) {
  const currentIndex = versionNumbers.indexOf(currentVersion)

  if (currentIndex === -1 || !versionNumbers.length) {
    return null
  }

  const movementByKey = {
    ArrowRight: 1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowUp: -1,
  }

  if (key in movementByKey) {
    const nextIndex = (currentIndex + movementByKey[key] + versionNumbers.length) % versionNumbers.length
    return {
      type: 'focus',
      versionNumber: versionNumbers[nextIndex],
    }
  }

  if (key === 'Home') {
    return {
      type: 'focus',
      versionNumber: versionNumbers[0],
    }
  }

  if (key === 'End') {
    return {
      type: 'focus',
      versionNumber: versionNumbers.at(-1),
    }
  }

  if (key === 'Enter' || key === ' ' || key === 'Space') {
    return {
      type: 'activate',
      versionNumber: currentVersion,
    }
  }

  return null
}

export function isValidCompareTarget({ activeVersion = '', compareVersion = '', versionMap }) {
  return Boolean(compareVersion && compareVersion !== activeVersion && hasVersion(versionMap, compareVersion))
}

function hasVersion(versionMap, versionNumber) {
  return Boolean(versionNumber && versionMap?.has(versionNumber))
}

function pushUniqueVersion(list, version, activeVersion) {
  if (!version || version.versionNumber === activeVersion) {
    return
  }

  if (!list.some((entry) => entry.versionNumber === version.versionNumber)) {
    list.push(version)
  }
}
