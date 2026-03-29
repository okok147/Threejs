import './styles.css'
import { createLifecycle, createSectionNavController, getElementProgress, setupReveals } from '../../src/lib/page.js'
import { createLabScene, scenePresets } from '../../src/lib/scene.js'

const RELEASE_LABELS = {
  'local-only': '僅本地',
  'committed-not-pushed': '已提交未推送',
  'pushed-main': '已推送 main',
  'deployed-preview': '預覽已部署',
  'deployed-production': '正式已部署',
  'live-verified': '已線上驗證',
  blocked: '發布受阻',
}

const HOUSE_CODES = ['Edition drop', 'Calibrated launch', 'Ready to dispatch']

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const collection = buildCollection(versions)

  container.innerHTML = `
    <div class="version-shell version-shell-v013">
      <div class="runway-grain" aria-hidden="true"></div>
      <div class="runway-fold" aria-hidden="true"></div>
      <div class="runway-inkline" aria-hidden="true"></div>

      <header class="runway-header reveal is-visible">
        <div class="runway-brand">
          <p class="runway-code">Meridian runway / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Collection House</strong>
        </div>

        <nav class="runway-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Launch</a>
          <a href="#collection" data-nav="collection">Collection</a>
          <a href="#atelier" data-nav="atelier">Atelier</a>
          <a href="#service" data-nav="service">Service</a>
        </nav>

        <div class="runway-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="runway-page" id="version-content">
        <section class="runway-section runway-hero" id="top" data-section="top">
          <div class="runway-stage reveal is-visible">
            <div class="runway-stage-sheet">
              <div class="runway-stage-head">
                <span>Hero product</span>
                <strong>${manifestEntry.title}</strong>
                <i>${manifestEntry.styleFamily}</i>
              </div>

              <div class="runway-stage-window">
                <div class="runway-stage-light" aria-hidden="true"></div>
                <canvas class="version-canvas runway-canvas" data-canvas aria-hidden="true"></canvas>

                <div class="runway-stage-ticket">
                  <span>Edition</span>
                  <strong>${manifestEntry.versionNumber}</strong>
                  <i>Ready now</i>
                </div>

                <div class="runway-stage-caption">
                  <span>${manifestEntry.sceneTreatment}</span>
                  <strong>Meridian launch image</strong>
                </div>
              </div>

              <div class="runway-stage-meta">
                ${manifestEntry.keyTraits
                  .map(
                    (trait, index) => `
                      <article style="--meta-index:${index}">
                        <span>Trait ${String(index + 1).padStart(2, '0')}</span>
                        <strong>${trait}</strong>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>

          <div class="runway-buy reveal is-visible">
            <p class="runway-kicker">Collection drop / version ${manifestEntry.versionNumber}</p>
            <h1>把版本實驗室包裝成一個可以被下單的主打商品。</h1>
            <p class="runway-intro">${manifestEntry.concept}</p>

            <div class="runway-marquee">
              ${HOUSE_CODES.map((code) => `<span>${code}</span>`).join('')}
            </div>

            <div class="runway-actions">
              <a class="runway-button runway-button-primary" href="#collection">Shop the collection</a>
              <a class="runway-button runway-button-secondary" href="#service">Read the care guide</a>
            </div>

            <dl class="runway-ledger">
              <div>
                <dt>Current drop</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Archive stock</dt>
                <dd>${stats.versionCount} registered editions</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="runway-spec-grid">
              <article>
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article>
                <span>Use case</span>
                <strong>${manifestEntry.useCaseEmphasis}</strong>
              </article>
              <article>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
            </div>
          </div>
        </section>

        <section class="runway-section runway-collection" id="collection">
          <div class="runway-section-head reveal">
            <div>
              <p class="runway-section-label">Collection shelf</p>
              <h2>版本在這裡不是 archive list，而是一整季可以被挑選的 editions。</h2>
            </div>
            <p class="runway-section-copy">
              這一版借的是 product-launch 與 luxury commerce 的閱讀方式。先讓主打款站穩，再把整個版本家族排成可比較、可切換的 collection shelf。
            </p>
          </div>

          <div class="runway-collection-list">
            ${collection
              .map((item, index) => {
                const isCurrent = item.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="runway-item reveal ${isCurrent ? 'is-current' : ''}" href="${item.route}">
                    <span class="runway-item-index">${String(index + 1).padStart(2, '0')}</span>
                    <div class="runway-item-copy">
                      <strong>${item.versionNumber} / ${item.title}</strong>
                      <p>${item.concept}</p>
                    </div>
                    <div class="runway-item-fit">
                      <span>${item.bestFor}</span>
                      <strong>${isCurrent ? 'Current drop' : 'Open edition'}</strong>
                    </div>
                    <i>${item.styleFamily}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="runway-section runway-atelier" id="atelier">
          <div class="runway-section-head reveal">
            <div>
              <p class="runway-section-label">Atelier notes</p>
              <h2>這不是把產品頁外觀直接套上來，而是把方法、材質與規格也翻成可出售的語言。</h2>
            </div>
            <p class="runway-section-copy">
              shared content、scene preset 與 release truth 都被重寫成 launch brief。購物化介面如果沒有結構與規則支撐，只會剩一層表面包裝。
            </p>
          </div>

          <div class="runway-atelier-grid">
            <section class="runway-sheet reveal">
              <p class="runway-panel-label">Build sequence</p>
              <div class="runway-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="runway-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="runway-sheet reveal">
              <p class="runway-panel-label">Specification sheet</p>
              <div class="runway-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="runway-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="runway-notes">
              <article class="runway-note reveal">
                <p class="runway-panel-label">House principles</p>
                <ul class="runway-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="runway-note reveal">
                <p class="runway-panel-label">Launch features</p>
                <ul class="runway-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="runway-note reveal">
                <p class="runway-panel-label">Care guide</p>
                <ul class="runway-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="runway-section runway-service" id="service">
          <div class="runway-section-head reveal">
            <div>
              <p class="runway-section-label">Service & dispatch</p>
              <h2>尾段像售後與品牌手冊，不像普通 footer，讓 references 與 lineage 繼續留在商品語境裡。</h2>
            </div>
            <p class="runway-section-copy">
              這裡把 reference links、archive notes 與 source families 改寫成 care card、dispatch note 與 house material tags，讓頁面最後一段仍然維持同一個商業世界觀。
            </p>
          </div>

          <div class="runway-service-grid">
            <section class="runway-wall reveal">
              <p class="runway-panel-label">Reference desk</p>
              <div class="runway-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="runway-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>Open</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="runway-wall reveal">
              <p class="runway-panel-label">House assurances</p>
              <div class="runway-assurance-list">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="runway-assurance">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
              <div class="runway-materials">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v013')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    collection: root.querySelector('#collection'),
    atelier: root.querySelector('#atelier'),
    service: root.querySelector('#service'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createRunwayMotion({
    root,
    sections,
    prefersReducedMotion,
  })

  const canvas = root.querySelector('[data-canvas]')

  if (canvas) {
    const sceneController = createLabScene({
      canvas,
      prefersReducedMotion,
      trackedSections: {
        collection: sections.collection,
        atelier: sections.atelier,
        service: sections.service,
      },
      preset: scenePresets.meridianRunway,
    })

    const handleVisibilityChange = () => {
      if (document.hidden) {
        sceneController.stop()
        return
      }

      sceneController.start()
    }

    lifecycle.addCleanup(() => sceneController.destroy())
    lifecycle.addEventListener(window, 'resize', sceneController.handleResize)
    lifecycle.addEventListener(window, 'resize', uiController.handleResize)
    lifecycle.addEventListener(window, 'resize', motionController.sync)
    lifecycle.addEventListener(window, 'pointermove', sceneController.handlePointerMove, {
      passive: true,
    })
    lifecycle.addEventListener(window, 'scroll', sceneController.handleScroll, { passive: true })
    lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
    lifecycle.addEventListener(window, 'scroll', motionController.sync, { passive: true })
    lifecycle.addEventListener(document, 'visibilitychange', handleVisibilityChange)

    sceneController.handleResize()
    sceneController.handleScroll()

    if (!document.hidden) {
      sceneController.start()
    }
  } else {
    lifecycle.addEventListener(window, 'resize', uiController.handleResize)
    lifecycle.addEventListener(window, 'resize', motionController.sync)
    lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
    lifecycle.addEventListener(window, 'scroll', motionController.sync, { passive: true })
  }

  uiController.handleScroll()
  motionController.sync()

  requestAnimationFrame(() => {
    root.classList.add('is-ready')
  })

  return () => lifecycle.destroy()
}

function createRunwayMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--runway-hero-progress', '0')
      root.style.setProperty('--runway-collection-progress', '0')
      root.style.setProperty('--runway-atelier-progress', '0')
      root.style.setProperty('--runway-service-progress', '0')
      return
    }

    root.style.setProperty('--runway-hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--runway-collection-progress', getElementProgress(sections.collection).toFixed(3))
    root.style.setProperty('--runway-atelier-progress', getElementProgress(sections.atelier).toFixed(3))
    root.style.setProperty('--runway-service-progress', getElementProgress(sections.service).toFixed(3))
  }

  return {
    sync,
  }
}

function buildCollection(versions) {
  return versions.slice().reverse()
}
