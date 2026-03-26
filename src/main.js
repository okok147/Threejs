import './style.css'
import manifest from '../version-manifest.json'
import { siteContent } from './data/site-content.js'
import { renderVersion as renderOrbitCinematic } from '../versions/v001-orbit-cinematic/index.js'
import { renderVersion as renderSignalLedger } from '../versions/v002-signal-ledger/index.js'
import { renderVersion as renderMuseumMonograph } from '../versions/v003-museum-monograph/index.js'

const STORAGE_KEY = 'threejs-style-lab-version'
const VERSION_RENDERERS = {
  v001: renderOrbitCinematic,
  v002: renderSignalLedger,
  v003: renderMuseumMonograph,
}

const COMPARISON_AXES = [
  { key: 'styleFamily', label: '風格家族' },
  { key: 'useCaseEmphasis', label: '使用情境' },
  { key: 'navigationModel', label: '導覽模型' },
  { key: 'motionLanguage', label: '動態語言' },
  { key: 'narrativeStructure', label: '敘事骨架' },
  { key: 'sceneTreatment', label: '3D 處理' },
]

const app = document.querySelector('#app')
const versions = manifest.versions
const versionMap = new Map(versions.map((version) => [version.versionNumber, version]))
const appState = {
  activeVersionNumber: resolveInitialVersion(),
  browserOpen: false,
  searchQuery: '',
}

let disposeActiveVersion = () => {}

app.innerHTML = `
  <div class="lab-app">
    <a class="lab-skip-link" href="#version-panel">跳到版本內容</a>
    <div class="lab-browser-backdrop" data-browser-backdrop aria-hidden="true"></div>

    <div class="lab-toolbar" aria-label="版本工具列">
      <a class="lab-toolbar-brand" href="#top">${siteContent.brand}</a>

      <div class="lab-toolbar-actions">
        <div class="lab-quick-switcher" role="tablist" aria-label="網站版本">
          ${versions
            .map(
              (version) => `
                <button
                  class="lab-tab"
                  id="tab-${version.versionNumber}"
                  type="button"
                  role="tab"
                  data-version-tab="${version.versionNumber}"
                  aria-controls="version-panel"
                  aria-selected="false"
                >
                  <span>${version.versionNumber}</span>
                  <small>${version.title}</small>
                </button>
              `
            )
            .join('')}
        </div>

        <button
          class="lab-browser-toggle"
          type="button"
          data-browser-toggle
          aria-expanded="false"
          aria-controls="lab-dock"
        >
          <div class="lab-browser-toggle-copy" data-browser-toggle-copy></div>
          <div class="lab-browser-toggle-icon" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </div>

    <aside class="lab-dock" id="lab-dock" data-browser-dock aria-label="版本檔案庫" aria-hidden="true">
      <div class="lab-browser-head">
        <div>
          <p class="lab-kicker">版本檔案庫</p>
          <h2 class="lab-browser-title">搜尋、切換與近鄰比較</h2>
        </div>
        <button class="lab-browser-close" type="button" data-browser-close>關閉</button>
      </div>

      <p class="lab-summary">${siteContent.labSummary}</p>
      <div class="lab-version-meta" data-version-meta></div>

      <div class="lab-search">
        <input
          class="lab-search-input"
          type="search"
          data-browser-search
          aria-label="搜尋版本"
          placeholder="搜尋版本號、標題、風格或關鍵特徵"
          autocomplete="off"
          spellcheck="false"
        />
        <p class="lab-search-results" data-search-results aria-live="polite"></p>
      </div>

      <div class="lab-browser-list" data-browser-list></div>
      <section class="lab-compare" data-compare-panel aria-label="近鄰比較"></section>

      <div class="lab-links">
        <a href="${siteContent.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
        <a href="${siteContent.liveUrl}" target="_blank" rel="noreferrer">Live Site</a>
      </div>
    </aside>

    <div class="version-stage" id="version-panel" role="tabpanel" data-version-stage></div>
  </div>
`

const stage = app.querySelector('[data-version-stage]')
const browserBackdrop = app.querySelector('[data-browser-backdrop]')
const dock = app.querySelector('[data-browser-dock]')
const browserToggle = app.querySelector('[data-browser-toggle]')
const browserToggleCopy = app.querySelector('[data-browser-toggle-copy]')
const browserClose = app.querySelector('[data-browser-close]')
const versionMeta = app.querySelector('[data-version-meta]')
const browserSearch = app.querySelector('[data-browser-search]')
const searchResults = app.querySelector('[data-search-results]')
const browserList = app.querySelector('[data-browser-list]')
const comparePanel = app.querySelector('[data-compare-panel]')
const versionTabs = [...app.querySelectorAll('[data-version-tab]')]
const descriptionMeta = document.querySelector('meta[name="description"]')

versionTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    renderLabVersion(tab.dataset.versionTab)
  })

  tab.addEventListener('keydown', handleTabKeydown)
})

browserToggle.addEventListener('click', () => {
  if (appState.browserOpen) {
    closeBrowser({ restoreFocus: true })
    return
  }

  openBrowser()
})

browserClose.addEventListener('click', () => closeBrowser({ restoreFocus: true }))
browserBackdrop.addEventListener('click', () => closeBrowser({ restoreFocus: true }))

browserSearch.addEventListener('input', (event) => {
  appState.searchQuery = event.currentTarget.value.trim()
  renderBrowserContent()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && appState.browserOpen) {
    closeBrowser({ restoreFocus: true })
  }
})

window.addEventListener(
  'pagehide',
  () => {
    disposeActiveVersion()
  },
  { once: true }
)

renderLabVersion(appState.activeVersionNumber)

function resolveInitialVersion() {
  const params = new URLSearchParams(window.location.search)
  const requestedVersion = params.get('v')

  if (requestedVersion && versionMap.has(requestedVersion)) {
    return requestedVersion
  }

  const storedVersion = window.localStorage.getItem(STORAGE_KEY)
  if (storedVersion && versionMap.has(storedVersion)) {
    return storedVersion
  }

  return manifest.lab.defaultVersion
}

function renderLabVersion(versionNumber) {
  const manifestEntry = versionMap.get(versionNumber) ?? versionMap.get(manifest.lab.defaultVersion)
  const renderer = VERSION_RENDERERS[manifestEntry.versionNumber]

  if (!renderer) {
    throw new Error(`Missing renderer for ${manifestEntry.versionNumber}`)
  }

  disposeActiveVersion()
  stage.innerHTML = ''

  appState.activeVersionNumber = manifestEntry.versionNumber
  document.body.dataset.activeVersion = manifestEntry.versionNumber
  updateUrl(manifestEntry.versionNumber)
  window.localStorage.setItem(STORAGE_KEY, manifestEntry.versionNumber)
  updateTabState(manifestEntry.versionNumber)
  updateBrowserToggle(manifestEntry)
  renderBrowserContent()

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

  closeBrowser()
  window.scrollTo({ top: 0, behavior: 'auto' })

  document.title = `${siteContent.brand} | ${manifestEntry.versionNumber} ${manifestEntry.title}`
  stage.setAttribute('aria-labelledby', `tab-${manifestEntry.versionNumber}`)

  if (descriptionMeta) {
    descriptionMeta.setAttribute('content', manifestEntry.concept)
  }
}

function updateTabState(activeVersionNumber) {
  versionTabs.forEach((tab) => {
    const isActive = tab.dataset.versionTab === activeVersionNumber
    tab.classList.toggle('is-active', isActive)
    tab.setAttribute('aria-selected', String(isActive))
    tab.tabIndex = isActive ? 0 : -1
  })
}

function updateBrowserToggle(manifestEntry) {
  browserToggleCopy.innerHTML = `
    <small>直接切換 / 檔案庫</small>
    <strong>${manifestEntry.versionNumber} / ${manifestEntry.title}</strong>
  `
}

function renderBrowserContent() {
  const activeEntry = versionMap.get(appState.activeVersionNumber)
  const filteredVersions = getFilteredVersions()
  const nearbyVersions = getNearbyVersions(activeEntry.versionNumber)

  versionMeta.innerHTML = `
    <p class="lab-active">目前版本 <strong>${activeEntry.versionNumber}</strong> / ${activeEntry.title}</p>
    <p class="lab-concept">${activeEntry.concept}</p>
    <p class="lab-best-for"><strong>適合情境</strong> ${activeEntry.bestFor}</p>
    <p class="lab-source-line">研究族群：${activeEntry.sourceFamiliesConsulted.join(' / ')}</p>
    <div class="lab-traits">
      <span class="lab-chip">${activeEntry.styleFamily}</span>
      <span class="lab-chip">${activeEntry.useCaseEmphasis}</span>
      <span class="lab-chip">${activeEntry.status}</span>
    </div>
  `

  searchResults.textContent = appState.searchQuery
    ? `顯示 ${filteredVersions.length} / ${versions.length} 個版本`
    : `${versions.length} 個已註冊版本，可直接用上方標籤快切。`

  browserList.innerHTML = filteredVersions.length
    ? filteredVersions
        .map(
          (version) => `
            <button
              class="lab-browser-card ${version.versionNumber === activeEntry.versionNumber ? 'is-active' : ''}"
              type="button"
              data-browser-version="${version.versionNumber}"
              aria-current="${version.versionNumber === activeEntry.versionNumber ? 'true' : 'false'}"
            >
              <div class="lab-browser-card-head">
                <span>${version.versionNumber} / ${version.status}</span>
                <strong>${version.title}</strong>
              </div>
              <p class="lab-browser-card-concept">${version.concept}</p>
              <p class="lab-browser-card-bestfor"><strong>適合情境</strong> ${version.bestFor}</p>
              <div class="lab-browser-card-tags">
                <span class="lab-chip">${version.styleFamily}</span>
                ${version.keyTraits.map((trait) => `<span class="lab-chip">${trait}</span>`).join('')}
              </div>
            </button>
          `
        )
        .join('')
    : `
        <div class="lab-browser-empty">
          <strong>找不到符合條件的版本</strong>
          <p>試試版本號、標題、風格家族，或 3D / archive / narrative 這類關鍵字。</p>
        </div>
      `

  comparePanel.innerHTML = nearbyVersions.length
    ? `
        <div class="lab-compare-head">
          <div>
            <p class="lab-kicker">近鄰比較</p>
            <h3 class="lab-compare-title">快速對照相鄰版本</h3>
          </div>
          <p class="lab-compare-copy">不做笨重表格；只列出最有判別力的差異軸線，方便在手機與桌面都快速掃描。</p>
        </div>

        <div class="lab-compare-grid">
          ${nearbyVersions
            .map((version) => {
              const diffs = getVersionDiffs(activeEntry, version)

              return `
                <article class="lab-compare-card">
                  <div class="lab-compare-card-head">
                    <p class="lab-compare-card-kicker">${version.relationLabel}</p>
                    <h4>${version.versionNumber} / ${version.title}</h4>
                    <p>${version.bestFor}</p>
                  </div>

                  <div class="lab-browser-card-tags">
                    <span class="lab-chip">${version.styleFamily}</span>
                    ${version.keyTraits.map((trait) => `<span class="lab-chip">${trait}</span>`).join('')}
                  </div>

                  <ul class="lab-compare-list">
                    ${diffs
                      .map(
                        (diff) => `
                          <li>
                            <strong>${diff.label}</strong>
                            <span>${diff.otherValue}</span>
                          </li>
                        `
                      )
                      .join('')}
                  </ul>

                  <button class="lab-compare-action" type="button" data-browser-version="${version.versionNumber}">
                    切換到 ${version.versionNumber}
                  </button>
                </article>
              `
            })
            .join('')}
        </div>
      `
    : `
        <div class="lab-browser-empty">
          <strong>目前沒有可比較的相鄰版本</strong>
          <p>新增更多版本後，這裡會自動列出前後鄰近版本的差異摘要。</p>
        </div>
      `

  ;[...browserList.querySelectorAll('[data-browser-version]'), ...comparePanel.querySelectorAll('[data-browser-version]')].forEach(
    (button) => {
      button.addEventListener('click', () => {
        renderLabVersion(button.dataset.browserVersion)
      })
    }
  )
}

function getFilteredVersions() {
  const query = appState.searchQuery.toLowerCase()

  if (!query) {
    return versions
  }

  return versions.filter((version) => {
    const haystack = [
      version.versionNumber,
      version.title,
      version.concept,
      version.styleFamily,
      version.useCaseEmphasis,
      version.bestFor,
      version.navigationModel,
      version.motionLanguage,
      version.narrativeStructure,
      version.sceneTreatment,
      ...version.keyTraits,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })
}

function getNearbyVersions(activeVersionNumber) {
  const activeIndex = versions.findIndex((version) => version.versionNumber === activeVersionNumber)

  return [
    versions[activeIndex - 1] ? { ...versions[activeIndex - 1], relationLabel: '前一版' } : null,
    versions[activeIndex + 1] ? { ...versions[activeIndex + 1], relationLabel: '後一版' } : null,
  ].filter(Boolean)
}

function getVersionDiffs(activeEntry, compareEntry) {
  const diffs = COMPARISON_AXES.filter(({ key }) => activeEntry[key] !== compareEntry[key]).map(({ key, label }) => ({
    label,
    otherValue: compareEntry[key],
  }))

  return diffs.slice(0, 3)
}

function handleTabKeydown(event) {
  const currentIndex = versionTabs.indexOf(event.currentTarget)

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    renderLabVersion(event.currentTarget.dataset.versionTab)
    return
  }

  if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
    return
  }

  event.preventDefault()

  let targetIndex = currentIndex

  if (event.key === 'ArrowRight') {
    targetIndex = (currentIndex + 1) % versionTabs.length
  }

  if (event.key === 'ArrowLeft') {
    targetIndex = (currentIndex - 1 + versionTabs.length) % versionTabs.length
  }

  if (event.key === 'Home') {
    targetIndex = 0
  }

  if (event.key === 'End') {
    targetIndex = versionTabs.length - 1
  }

  versionTabs.forEach((tab, index) => {
    tab.tabIndex = index === targetIndex ? 0 : -1
  })
  versionTabs[targetIndex].focus()
}

function openBrowser() {
  appState.browserOpen = true
  syncBrowserVisibility()
  window.requestAnimationFrame(() => browserSearch.focus())
}

function closeBrowser({ restoreFocus = false } = {}) {
  if (!appState.browserOpen) {
    if (restoreFocus) {
      browserToggle.focus()
    }
    return
  }

  appState.browserOpen = false
  syncBrowserVisibility()

  if (restoreFocus) {
    browserToggle.focus()
  }
}

function syncBrowserVisibility() {
  browserToggle.setAttribute('aria-expanded', String(appState.browserOpen))
  dock.classList.toggle('is-open', appState.browserOpen)
  browserBackdrop.classList.toggle('is-open', appState.browserOpen)
  dock.setAttribute('aria-hidden', String(!appState.browserOpen))
  browserBackdrop.setAttribute('aria-hidden', String(!appState.browserOpen))
  document.body.classList.toggle('is-browser-open', appState.browserOpen)
}

function updateUrl(versionNumber) {
  const params = new URLSearchParams(window.location.search)
  params.set('v', versionNumber)
  const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
  window.history.replaceState({}, '', nextUrl)
}
