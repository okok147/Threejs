import './style.css'
import manifest from '../version-manifest.json'
import { siteContent } from './data/site-content.js'
import { createBrowserDialogController } from './lib/browser-dialog.js'
import {
  buildSearchIndex as buildNavigatorSearchIndex,
  getCompareAxes as getNavigatorCompareAxes,
  getSuggestedCompareVersions as getNavigatorSuggestedCompareVersions,
  getVersionTabIntent,
  isValidCompareTarget as isValidNavigatorCompareTarget,
  resolveInitialCompareVersion,
  resolveInitialVersion,
} from './lib/version-navigator.js'
import {
  getBrowserShortcutAction,
  handleBrowserSearchSubmit,
  handleVersionTabKeydownIntent,
  syncVersionTabs,
} from './lib/version-navigator-ui.js'
import { renderVersion as renderOrbitCinematic } from '../versions/v001-orbit-cinematic/index.js'
import { renderVersion as renderSignalLedger } from '../versions/v002-signal-ledger/index.js'
import { renderVersion as renderMuseumMonograph } from '../versions/v003-museum-monograph/index.js'
import { renderVersion as renderInstrumentDeck } from '../versions/v004-instrument-deck/index.js'
import { renderVersion as renderTidalAtlas } from '../versions/v005-tidal-atlas/index.js'

const STORAGE_KEY = 'threejs-style-lab-version'
const COMPARE_STORAGE_KEY = 'threejs-style-lab-compare-version'
const VERSION_RENDERERS = {
  v001: renderOrbitCinematic,
  v002: renderSignalLedger,
  v003: renderMuseumMonograph,
  v004: renderInstrumentDeck,
  v005: renderTidalAtlas,
}
const previewAssetModules = import.meta.glob('../screenshots/**/*.{avif,jpg,jpeg,png,svg,webp}', {
  eager: true,
  import: 'default',
})
const previewAssetUrls = new Map(
  Object.entries(previewAssetModules).map(([filePath, assetUrl]) => [filePath.replace(/^\.\.\//, ''), assetUrl])
)
const SNAPSHOT_READINESS_LABELS = {
  'preview-only': '概念預覽',
  'browser-captured': '瀏覽器快照',
  'capture-blocked': '快照受阻',
}
const PREVIEW_KIND_LABELS = {
  'illustrated-poster': '概念海報',
  'browser-screenshot': '瀏覽器截圖',
  'section-capture': '章節截圖',
}
const VERSION_PANEL_ID = 'lab-version-panel'
const TAB_HINT_ID = 'lab-tab-hint'
const STATUS_LABELS = {
  stable: '穩定',
  experimental: '實驗中',
  draft: '草稿',
  archived: '封存',
  blocked: '受阻',
}
const RELEASE_STATUS_LABELS = {
  'local-only': '僅本地',
  'committed-not-pushed': '已提交未推送',
  'pushed-main': '已推送 main',
  'deployed-preview': '預覽已部署',
  'deployed-production': '正式已部署',
  'live-verified': '已線上驗證',
  blocked: '發布受阻',
}

const app = document.querySelector('#app')
const versions = manifest.versions
const versionNumbers = versions.map((version) => version.versionNumber)
const versionMap = new Map(versions.map((version) => [version.versionNumber, version]))
const hostedUrl = manifest.lab.hostedUrl || siteContent.liveUrl
const initialParams = new URLSearchParams(window.location.search)

let activeVersionNumber = resolveInitialVersion({
  requestedVersion: initialParams.get('v'),
  storedVersion: window.localStorage.getItem(STORAGE_KEY),
  defaultVersion: manifest.lab.defaultVersion,
  versionMap,
})
let compareVersionNumber = resolveInitialCompareVersion({
  activeVersion: activeVersionNumber,
  requestedCompare: initialParams.get('compare'),
  storedCompare: window.localStorage.getItem(COMPARE_STORAGE_KEY),
  versionMap,
})
let disposeActiveVersion = () => {}
let lastFilteredVersions = versions

if (!app) {
  throw new Error('Missing #app mount point')
}

app.innerHTML = `
  <div class="lab-app">
    <a class="lab-skip-link" href="#version-content">跳到版本內容</a>

    <header class="lab-toolbar" aria-label="版本切換列">
      <a class="lab-toolbar-brand" href="#top">${escapeHtml(siteContent.brand)}</a>

      <div class="lab-toolbar-current" data-toolbar-current></div>

      <div class="lab-toolbar-actions">
        <p class="lab-visually-hidden" id="${TAB_HINT_ID}">
          方向鍵只移動版本焦點，按 Enter 或空白鍵才會切換版本。
        </p>

        <div
          class="lab-quick-switcher"
          role="tablist"
          aria-label="快速版本切換"
          aria-describedby="${TAB_HINT_ID}"
        >
          ${versions
            .map(
              (version) => `
                <button
                  class="lab-tab"
                  type="button"
                  role="tab"
                  id="lab-tab-${escapeAttribute(version.versionNumber)}"
                  data-version-tab="${escapeAttribute(version.versionNumber)}"
                  aria-selected="false"
                  aria-controls="${VERSION_PANEL_ID}"
                >
                  <span>${escapeHtml(version.versionNumber)}</span>
                  <small>${escapeHtml(version.title)}</small>
                </button>
              `
            )
            .join('')}
        </div>

        <div class="lab-toolbar-compare" data-toolbar-compare-list></div>

        <button
          class="lab-browser-toggle"
          type="button"
          data-browser-toggle
          aria-expanded="false"
          aria-controls="lab-browser-panel"
          aria-haspopup="dialog"
        >
          <span class="lab-browser-toggle-copy">
            <small>Version Browser</small>
            <strong data-browser-toggle-label></strong>
          </span>
          <span class="lab-browser-toggle-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>

    <div class="lab-browser-backdrop" data-browser-backdrop></div>

    <aside
      class="lab-dock"
      id="lab-browser-panel"
      data-browser-panel
      role="dialog"
      aria-modal="true"
      aria-hidden="true"
      aria-labelledby="lab-browser-title"
      aria-describedby="lab-browser-summary"
    >
      <div class="lab-browser-head">
        <div>
          <p class="lab-kicker">${escapeHtml(manifest.lab.title)}</p>
          <h2 class="lab-browser-title" id="lab-browser-title">切換、搜尋與比較版本</h2>
        </div>

        <div class="lab-browser-head-actions">
          <span class="lab-key-hint" aria-label="鍵盤捷徑">
            <kbd>${navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</kbd>
            <kbd>K</kbd>
          </span>
          <button class="lab-browser-close" type="button" data-browser-close aria-label="關閉版本瀏覽器">
            關閉
          </button>
        </div>
      </div>

      <p class="lab-summary" id="lab-browser-summary">${escapeHtml(siteContent.labSummary)}</p>

      <label class="lab-search" for="version-search">
        <span class="lab-search-label">搜尋版本</span>
        <input
          id="version-search"
          class="lab-search-input"
          type="search"
          data-version-search
          placeholder="輸入版本號、slug、概念、style family、traits 或 best for"
          autocomplete="off"
        />
      </label>

      <div class="lab-version-meta" data-version-meta></div>
      <section class="lab-compare-panel" data-compare-panel aria-live="polite"></section>
      <div class="lab-browser-list" data-version-list aria-live="polite"></div>

      <div class="lab-links">
        <a href="${escapeAttribute(siteContent.repoUrl)}" target="_blank" rel="noreferrer">GitHub</a>
        <a href="${escapeAttribute(hostedUrl)}" target="_blank" rel="noreferrer">Hosted Site</a>
      </div>
    </aside>

    <div
      class="version-stage"
      id="${VERSION_PANEL_ID}"
      data-version-stage
      role="tabpanel"
      tabindex="-1"
    ></div>
  </div>
`

const stage = app.querySelector('[data-version-stage]')
const toolbarCurrent = app.querySelector('[data-toolbar-current]')
const toolbarCompareList = app.querySelector('[data-toolbar-compare-list]')
const versionMeta = app.querySelector('[data-version-meta]')
const comparePanel = app.querySelector('[data-compare-panel]')
const versionList = app.querySelector('[data-version-list]')
const versionTabs = [...app.querySelectorAll('[data-version-tab]')]
const quickSwitcher = app.querySelector('.lab-quick-switcher')
const skipLink = app.querySelector('.lab-skip-link')
const toolbar = app.querySelector('.lab-toolbar')
const browserPanel = app.querySelector('[data-browser-panel]')
const browserBackdrop = app.querySelector('[data-browser-backdrop]')
const browserToggle = app.querySelector('[data-browser-toggle]')
const browserClose = app.querySelector('[data-browser-close]')
const browserToggleLabel = app.querySelector('[data-browser-toggle-label]')
const searchInput = app.querySelector('[data-version-search]')
const descriptionMeta = document.querySelector('meta[name="description"]')
let focusableVersionNumber = activeVersionNumber

const browserDialog = createBrowserDialogController({
  dialogElement: browserPanel,
  backdropElement: browserBackdrop,
  returnFocusElement: browserToggle,
  initialFocusElement: searchInput,
  inertRoots: [skipLink, toolbar, stage],
  body: document.body,
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  getActiveElement: () => document.activeElement,
})

versionTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const requestedVersion = tab.dataset.versionTab

    if (!requestedVersion) {
      return
    }

    focusVersionTab(requestedVersion)
    renderLabVersion(requestedVersion)
  })
})

quickSwitcher?.addEventListener('keydown', handleVersionTabKeydown)

toolbarCompareList.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target.closest('[data-toolbar-compare]') : null
  if (!target) {
    return
  }

  const requestedVersion = target.getAttribute('data-toolbar-compare')
  toggleCompareVersion(requestedVersion)
  setBrowserOpen(true)
})

versionList.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null

  const openButton = target?.closest('[data-open-version]')
  if (openButton) {
    renderLabVersion(openButton.getAttribute('data-open-version'))
    setBrowserOpen(false)
    return
  }

  const compareButton = target?.closest('[data-compare-version]')
  if (compareButton) {
    toggleCompareVersion(compareButton.getAttribute('data-compare-version'))
  }
})

comparePanel.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null

  const compareButton = target?.closest('[data-compare-version]')
  if (compareButton) {
    toggleCompareVersion(compareButton.getAttribute('data-compare-version'))
    return
  }

  if (target?.closest('[data-clear-compare]')) {
    clearCompareVersion()
  }
})

searchInput.addEventListener('input', () => {
  renderBrowserList(searchInput.value)
})

searchInput.addEventListener('keydown', (event) => {
  handleBrowserSearchSubmit({
    event,
    filteredVersions: lastFilteredVersions,
    activateVersion: renderLabVersion,
    setBrowserOpen,
  })
})

browserToggle.addEventListener('click', () => {
  setBrowserOpen(!browserDialog.isOpen)
})

browserClose.addEventListener('click', () => {
  setBrowserOpen(false)
})

browserBackdrop.addEventListener('click', () => {
  setBrowserOpen(false)
})

document.addEventListener('keydown', (event) => {
  if (browserDialog.handleKeydown(event)) {
    return
  }

  const shortcutAction = getBrowserShortcutAction({
    event,
    isBrowserOpen: browserDialog.isOpen,
  })

  if (!shortcutAction) {
    return
  }

  event.preventDefault()
  setBrowserOpen(shortcutAction === 'open')
})

window.addEventListener(
  'pagehide',
  () => {
    disposeActiveVersion()
  },
  { once: true }
)

renderLabVersion(activeVersionNumber)

function renderLabVersion(versionNumber) {
  const manifestEntry = versionMap.get(versionNumber) ?? versionMap.get(manifest.lab.defaultVersion)
  const renderer = VERSION_RENDERERS[manifestEntry.versionNumber]

  if (!renderer) {
    throw new Error(`Missing renderer for ${manifestEntry.versionNumber}`)
  }

  if (
    !isValidNavigatorCompareTarget({
      activeVersion: manifestEntry.versionNumber,
      compareVersion: compareVersionNumber,
      versionMap,
    })
  ) {
    compareVersionNumber = ''
  }

  disposeActiveVersion()
  stage.innerHTML = ''

  activeVersionNumber = manifestEntry.versionNumber
  focusableVersionNumber = activeVersionNumber
  document.body.dataset.activeVersion = activeVersionNumber
  document.body.dataset.compareVersion = compareVersionNumber || ''
  updateUrl(activeVersionNumber, compareVersionNumber)
  window.localStorage.setItem(STORAGE_KEY, activeVersionNumber)

  if (compareVersionNumber) {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, compareVersionNumber)
  } else {
    window.localStorage.removeItem(COMPARE_STORAGE_KEY)
  }

  updateDock(manifestEntry)

  disposeActiveVersion =
    renderer({
      container: stage,
      manifestEntry,
      content: siteContent,
      versions,
      stats: {
        versionCount: versions.length,
      },
    }) ?? (() => {})

  window.scrollTo({ top: 0, behavior: 'auto' })

  document.title = `${siteContent.brand} | ${manifestEntry.versionNumber} ${manifestEntry.title}`

  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', manifestEntry.concept)
  }
}

function updateDock(manifestEntry) {
  syncVersionTabs({
    versionTabs,
    activeVersionNumber: manifestEntry.versionNumber,
    focusableVersionNumber,
  })

  stage.setAttribute('aria-labelledby', `lab-tab-${manifestEntry.versionNumber}`)

  browserToggleLabel.textContent = compareVersionNumber
    ? `${manifestEntry.versionNumber} vs ${compareVersionNumber}`
    : `${manifestEntry.versionNumber} / ${manifestEntry.title}`

  toolbarCurrent.innerHTML = renderToolbarCurrent(manifestEntry)
  toolbarCompareList.innerHTML = renderToolbarCompare(manifestEntry)
  versionMeta.innerHTML = renderBrowserMeta(manifestEntry)
  comparePanel.innerHTML = renderComparePanel(manifestEntry)
  renderBrowserList(searchInput.value)
}

function renderBrowserList(query = '') {
  const normalizedQuery = query.trim().toLowerCase()
  lastFilteredVersions = versions.filter((version) => {
    if (!normalizedQuery) {
      return true
    }

    return buildNavigatorSearchIndex({ version, lab: manifest.lab }).includes(normalizedQuery)
  })

  if (!lastFilteredVersions.length) {
    versionList.innerHTML = `
      <div class="lab-browser-empty">
        <strong>找不到對應版本</strong>
        <p>可試試搜尋版本號、slug、概念、style family、traits 或 best for。</p>
      </div>
    `
    return
  }

  versionList.innerHTML = lastFilteredVersions.map((version) => renderBrowserCard(version)).join('')
}

function renderToolbarCurrent(version) {
  return `
    <p class="lab-toolbar-label">Current Version</p>
    <div class="lab-toolbar-current-main">
      <strong>${escapeHtml(version.versionNumber)} / ${escapeHtml(version.title)}</strong>
      <div class="lab-toolbar-statuses">
        ${renderStatusChip(version.status)}
        ${renderReleaseChip(version.releaseStatus)}
      </div>
    </div>
    <p class="lab-toolbar-current-copy">${escapeHtml(version.bestFor)}</p>
  `
}

function renderToolbarCompare(version) {
  const suggestions = getSuggestedCompareVersions(version.versionNumber)

  if (!suggestions.length) {
    return ''
  }

  return suggestions
    .map(
      (candidate) => `
        <button
          class="lab-compare-pill ${compareVersionNumber === candidate.versionNumber ? 'is-active' : ''}"
          type="button"
          data-toolbar-compare="${escapeAttribute(candidate.versionNumber)}"
          aria-pressed="${String(compareVersionNumber === candidate.versionNumber)}"
        >
          比較 ${escapeHtml(candidate.versionNumber)}
        </button>
      `
    )
    .join('')
}

function renderBrowserMeta(version) {
  const preview = getPrimaryPreview(version)

  return `
    <div class="lab-meta-block">
      <p class="lab-active">目前版本 <strong>${escapeHtml(version.versionNumber)}</strong> / ${escapeHtml(version.title)}</p>
      <p class="lab-concept">${escapeHtml(version.concept)}</p>
      <div class="lab-traits">
        <span class="lab-chip">${escapeHtml(version.styleFamily)}</span>
        <span class="lab-chip">${escapeHtml(version.useCaseEmphasis)}</span>
        ${renderStatusChip(version.status)}
        ${renderReleaseChip(version.releaseStatus)}
      </div>
    </div>

    <div class="lab-meta-grid">
      <div class="lab-meta-row">
        <span class="lab-meta-label">Best for</span>
        <p>${escapeHtml(version.bestFor)}</p>
      </div>

      <div class="lab-meta-row">
        <span class="lab-meta-label">Traits</span>
        <p>${escapeHtml(version.keyTraits.join(' / '))}</p>
      </div>

      <div class="lab-meta-row">
        <span class="lab-meta-label">Source families</span>
        <p>${escapeHtml(version.sourceFamiliesConsulted.join(' / '))}</p>
      </div>

      <div class="lab-meta-row">
        <span class="lab-meta-label">Release truth</span>
        <div class="lab-meta-statuses">
          ${renderStatusChip(version.status)}
          ${renderReleaseChip(version.releaseStatus)}
        </div>
        <p>${escapeHtml(version.releaseNotes)}</p>
      </div>

      <div class="lab-meta-row">
        <span class="lab-meta-label">Hosted site</span>
        <p>
          <a class="lab-inline-link" href="${escapeAttribute(hostedUrl)}" target="_blank" rel="noreferrer">
            ${escapeHtml(hostedUrl)}
          </a>
        </p>
        <p class="lab-meta-note">
          Expected HTML title:
          <span class="lab-code">${escapeHtml(manifest.lab.htmlTitle)}</span>
        </p>
        <p class="lab-meta-note">
          Expected fingerprint:
          <span class="lab-code">${escapeHtml(manifest.lab.releaseFingerprint)}</span>
        </p>
        <p class="lab-meta-note">${escapeHtml(manifest.lab.liveVerificationNotes)}</p>
        <p class="lab-meta-note">Last check: ${escapeHtml(manifest.lab.lastLiveVerificationAt)}</p>
      </div>
    </div>

    <div class="lab-meta-preview">
      ${renderPreviewFrame(version, 'lab-preview-frame lab-preview-frame-meta')}

      <div class="lab-meta-preview-copy">
        <span class="lab-meta-label">Preview evidence</span>
        <p>
          ${preview ? `${escapeHtml(formatPreviewKind(preview.kind))} / ${escapeHtml(preview.origin)}` : '尚未提供預覽資產'}
        </p>
        <p class="lab-meta-note">${escapeHtml(version.snapshotNotes)}</p>
      </div>
    </div>
  `
}

function renderComparePanel(currentVersion) {
  const compareVersion = versionMap.get(compareVersionNumber)

  if (!compareVersion) {
    const suggestions = getSuggestedCompareVersions(currentVersion.versionNumber)

    return `
      <div class="lab-compare-head">
        <div>
          <p class="lab-kicker">Quick Compare</p>
          <h3 class="lab-compare-title">先比較相鄰版本，快速讀懂方向差異。</h3>
        </div>
      </div>

      <div class="lab-compare-suggestions">
        ${suggestions
          .map(
            (version) => `
              <button
                class="lab-compare-suggestion"
                type="button"
                data-compare-version="${escapeAttribute(version.versionNumber)}"
              >
                <span>${escapeHtml(version.versionNumber)}</span>
                <strong>${escapeHtml(version.title)}</strong>
                <small>${escapeHtml(version.bestFor)}</small>
              </button>
            `
          )
          .join('')}
      </div>
    `
  }

  const compareAxes = getCompareAxes(currentVersion, compareVersion)

  return `
    <div class="lab-compare-head">
      <div>
        <p class="lab-kicker">Quick Compare</p>
        <h3 class="lab-compare-title">${escapeHtml(currentVersion.versionNumber)} 與 ${escapeHtml(compareVersion.versionNumber)} 的主要差異</h3>
      </div>
      <button class="lab-text-button" type="button" data-clear-compare>
        清除比較
      </button>
    </div>

    <div class="lab-compare-grid">
      ${renderCompareSummaryCard(currentVersion, '目前版本')}
      ${renderCompareSummaryCard(compareVersion, '比較對象')}
    </div>

    <div class="lab-compare-diffs">
      ${compareAxes
        .map(
          (axis) => `
            <article class="lab-compare-diff">
              <span>${escapeHtml(axis.label)}</span>
              <strong>${escapeHtml(axis.current)}</strong>
              <p>${escapeHtml(axis.target)}</p>
            </article>
          `
        )
        .join('')}
    </div>
  `
}

function renderCompareSummaryCard(version, label) {
  return `
    <article class="lab-compare-card">
      ${renderPreviewFrame(version, 'lab-preview-frame lab-preview-frame-compare')}

      <div class="lab-compare-card-head">
        <span class="lab-compare-card-kicker">${escapeHtml(label)}</span>
        <h4>${escapeHtml(version.versionNumber)} / ${escapeHtml(version.title)}</h4>
        <p>${escapeHtml(version.styleFamily)}</p>
      </div>

      <ul class="lab-compare-list">
        <li>
          <span>Best for</span>
          <strong>${escapeHtml(version.bestFor)}</strong>
        </li>
        <li>
          <span>Snapshot</span>
          <strong>${escapeHtml(formatSnapshotReadiness(version.snapshotReadiness))}</strong>
        </li>
        <li>
          <span>Release</span>
          <strong>${escapeHtml(formatReleaseStatus(version.releaseStatus))}</strong>
        </li>
      </ul>

      <p class="lab-compare-copy">${escapeHtml(version.snapshotNotes)}</p>
    </article>
  `
}

function renderBrowserCard(version) {
  const isActive = version.versionNumber === activeVersionNumber
  const isCompared = version.versionNumber === compareVersionNumber
  const preview = getPrimaryPreview(version)

  return `
    <article
      class="lab-browser-card ${isActive ? 'is-active' : ''} ${isCompared ? 'is-compared' : ''}"
      data-browser-version="${escapeAttribute(version.versionNumber)}"
    >
      ${renderPreviewFrame(version, 'lab-preview-frame lab-preview-frame-card')}

      <div class="lab-browser-card-head">
        <div class="lab-browser-card-title">
          <span>${escapeHtml(version.versionNumber)}</span>
          <strong>${escapeHtml(version.title)}</strong>
        </div>
        <div class="lab-browser-card-badges">
          ${isActive ? '<span class="lab-pill lab-pill-current">目前</span>' : ''}
          ${isCompared ? '<span class="lab-pill lab-pill-compare">比較中</span>' : ''}
        </div>
      </div>

      <p class="lab-browser-card-concept">${escapeHtml(version.concept)}</p>
      <p class="lab-browser-card-best-for">${escapeHtml(version.bestFor)}</p>
      <p class="lab-browser-card-evidence">
        ${escapeHtml(formatSnapshotReadiness(version.snapshotReadiness))}
        ${preview ? ` / ${escapeHtml(formatPreviewKind(preview.kind))}` : ''}
        / ${escapeHtml(formatReleaseStatus(version.releaseStatus))}
      </p>

      <div class="lab-browser-card-tags">
        <span class="lab-chip">${escapeHtml(version.styleFamily)}</span>
        <span class="lab-chip">${escapeHtml(version.useCaseEmphasis)}</span>
        ${renderStatusChip(version.status)}
        ${renderReleaseChip(version.releaseStatus)}
      </div>

      <div class="lab-browser-card-traits">
        ${version.keyTraits.map((trait) => `<span class="lab-pill">${escapeHtml(trait)}</span>`).join('')}
      </div>

      <div class="lab-browser-card-actions">
        <button
          class="lab-action-button lab-action-button-primary"
          type="button"
          data-open-version="${escapeAttribute(version.versionNumber)}"
          aria-current="${isActive ? 'page' : 'false'}"
        >
          ${isActive ? '目前所在版本' : '切換到此版本'}
        </button>

        <button
          class="lab-action-button"
          type="button"
          data-compare-version="${escapeAttribute(version.versionNumber)}"
          ${isActive ? 'disabled' : ''}
        >
          ${isCompared ? '取消比較' : `比較 ${escapeHtml(version.versionNumber)}`}
        </button>
      </div>
    </article>
  `
}

function toggleCompareVersion(versionNumber) {
  if (
    !isValidNavigatorCompareTarget({
      activeVersion: activeVersionNumber,
      compareVersion: versionNumber,
      versionMap,
    })
  ) {
    clearCompareVersion()
    return
  }

  compareVersionNumber = compareVersionNumber === versionNumber ? '' : versionNumber
  updateDock(versionMap.get(activeVersionNumber))
  updateUrl(activeVersionNumber, compareVersionNumber)

  if (compareVersionNumber) {
    window.localStorage.setItem(COMPARE_STORAGE_KEY, compareVersionNumber)
  } else {
    window.localStorage.removeItem(COMPARE_STORAGE_KEY)
  }
}

function clearCompareVersion() {
  compareVersionNumber = ''
  updateDock(versionMap.get(activeVersionNumber))
  updateUrl(activeVersionNumber, compareVersionNumber)
  window.localStorage.removeItem(COMPARE_STORAGE_KEY)
}

function getSuggestedCompareVersions(versionNumber) {
  return getNavigatorSuggestedCompareVersions({ versionNumber, versions })
}

function getCompareAxes(currentVersion, compareVersion) {
  return getNavigatorCompareAxes(currentVersion, compareVersion)
}

function handleVersionTabKeydown(event) {
  handleVersionTabKeydownIntent({
    event,
    versionNumbers,
    getVersionTabIntent,
    focusVersionTab,
    activateVersion: renderLabVersion,
  })
}

function focusVersionTab(versionNumber) {
  if (!versionMap.has(versionNumber)) {
    return
  }

  focusableVersionNumber = versionNumber
  syncVersionTabs({
    versionTabs,
    activeVersionNumber,
    focusableVersionNumber,
  })
  getVersionTab(versionNumber)?.focus({ preventScroll: true })
}

function getVersionTab(versionNumber) {
  return versionTabs.find((tab) => tab.dataset.versionTab === versionNumber) ?? null
}

function setBrowserOpen(nextState) {
  if (nextState) {
    renderBrowserList(searchInput.value)
  }

  browserDialog.setOpen(nextState)
}

function updateUrl(versionNumber, compareVersion) {
  const params = new URLSearchParams(window.location.search)
  params.set('v', versionNumber)

  if (compareVersion) {
    params.set('compare', compareVersion)
  } else {
    params.delete('compare')
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState({}, '', nextUrl)
}

function getPrimaryPreview(version) {
  const artifact = version.previewArtifacts?.[0]

  if (!artifact) {
    return null
  }

  return {
    ...artifact,
    url: previewAssetUrls.get(artifact.path) ?? artifact.path,
  }
}

function renderPreviewFrame(version, className) {
  const preview = getPrimaryPreview(version)

  if (!preview) {
    return `
      <div class="${className} is-empty" aria-hidden="true">
        <span>Preview unavailable</span>
      </div>
    `
  }

  return `
    <figure class="${className}">
      <img
        src="${escapeAttribute(preview.url)}"
        alt="${escapeAttribute(preview.alt)}"
        loading="lazy"
        decoding="async"
      />
      <figcaption class="lab-preview-meta">
        <span>${escapeHtml(preview.label)}</span>
        <strong>${escapeHtml(formatPreviewKind(preview.kind))}</strong>
      </figcaption>
    </figure>
  `
}

function formatSnapshotReadiness(snapshotReadiness) {
  return SNAPSHOT_READINESS_LABELS[snapshotReadiness] ?? snapshotReadiness
}

function formatPreviewKind(kind) {
  return PREVIEW_KIND_LABELS[kind] ?? kind
}

function renderStatusChip(status) {
  return `<span class="lab-chip lab-chip-status is-${escapeAttribute(status)}">${escapeHtml(formatStatus(status))}</span>`
}

function renderReleaseChip(releaseStatus) {
  return `<span class="lab-chip lab-chip-release is-${escapeAttribute(releaseStatus)}">${escapeHtml(formatReleaseStatus(releaseStatus))}</span>`
}

function formatStatus(status) {
  return STATUS_LABELS[status] ?? status
}

function formatReleaseStatus(releaseStatus) {
  return RELEASE_STATUS_LABELS[releaseStatus] ?? releaseStatus
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('`', '&#96;')
}
