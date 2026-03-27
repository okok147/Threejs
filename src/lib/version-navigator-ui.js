export function syncVersionTabs({ versionTabs, activeVersionNumber = '', focusableVersionNumber = '' }) {
  versionTabs.forEach((tab) => {
    const isActive = tab.dataset?.versionTab === activeVersionNumber
    const isFocusable = tab.dataset?.versionTab === focusableVersionNumber

    tab.classList?.toggle('is-active', isActive)
    tab.setAttribute?.('aria-selected', String(isActive))
    tab.tabIndex = isFocusable ? 0 : -1
  })
}

export function handleVersionTabKeydownIntent({
  event,
  versionNumbers = [],
  getVersionTabIntent,
  focusVersionTab,
  activateVersion,
}) {
  const target = event.target?.closest?.('[data-version-tab]') ?? null
  const currentVersion = target?.dataset?.versionTab

  if (!currentVersion) {
    return false
  }

  const intent = getVersionTabIntent({
    key: event.key,
    currentVersion,
    versionNumbers,
  })

  if (!intent) {
    return false
  }

  event.preventDefault?.()
  focusVersionTab(intent.versionNumber)

  if (intent.type === 'activate') {
    activateVersion(intent.versionNumber)
  }

  return true
}

export function handleBrowserSearchSubmit({
  event,
  filteredVersions = [],
  activateVersion,
  setBrowserOpen,
}) {
  if (event.key !== 'Enter') {
    return false
  }

  const [firstVersion] = filteredVersions

  if (!firstVersion) {
    return false
  }

  event.preventDefault?.()
  activateVersion(firstVersion.versionNumber)
  setBrowserOpen(false)
  return true
}

export function getBrowserShortcutAction({ event, isBrowserOpen }) {
  if (event.key === 'Escape' && isBrowserOpen) {
    return 'close'
  }

  if (isTypingTarget(event.target)) {
    return null
  }

  const isOpenShortcut =
    (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) ||
    ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')

  return isOpenShortcut ? 'open' : null
}

export function isTypingTarget(target) {
  return Boolean(target?.closest?.('input, textarea, select, [contenteditable="true"]'))
}
