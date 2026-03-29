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

const CREED_LINES = ['Make it sharp.', 'Make it strange.', 'Make it stay.']

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const selections = buildSelections(versions)

  container.innerHTML = `
    <div class="version-shell version-shell-v012">
      <div class="doctrine-grid" aria-hidden="true"></div>
      <div class="doctrine-glow" aria-hidden="true"></div>
      <div class="doctrine-band" aria-hidden="true"></div>

      <header class="doctrine-header reveal is-visible">
        <div class="doctrine-brand">
          <p class="doctrine-code">Detail doctrine / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Selected Editions</strong>
        </div>

        <nav class="doctrine-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Creed</a>
          <a href="#works" data-nav="works">Works</a>
          <a href="#method" data-nav="method">Method</a>
          <a href="#close" data-nav="close">Close</a>
        </nav>

        <div class="doctrine-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="doctrine-page" id="version-content">
        <section class="doctrine-section doctrine-hero" id="top" data-section="top">
          <div class="doctrine-copy reveal is-visible">
            <p class="doctrine-kicker">Creed edition / version ${manifestEntry.versionNumber}</p>
            <div class="doctrine-creed">
              ${CREED_LINES.map((line) => `<span>${line}</span>`).join('')}
            </div>
            <p class="doctrine-intro">${manifestEntry.concept}</p>

            <div class="doctrine-actions">
              <a class="doctrine-button doctrine-button-primary" href="#works">View selected works</a>
              <a class="doctrine-button doctrine-button-secondary" href="#close">Read the references</a>
            </div>

            <dl class="doctrine-ledger">
              <div>
                <dt>Current edition</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Archive size</dt>
                <dd>${stats.versionCount} versions</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="doctrine-copy-grid">
              <article>
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article>
                <span>Style family</span>
                <strong>${manifestEntry.styleFamily}</strong>
              </article>
              <article>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
            </div>
          </div>

          <div class="doctrine-stage reveal is-visible">
            <div class="doctrine-stage-frame">
              <div class="doctrine-stage-head">
                <span>Hero stage</span>
                <strong>Persistent core</strong>
                <i>${manifestEntry.sceneTreatment}</i>
              </div>

              <div class="doctrine-stage-window">
                <div class="doctrine-stage-sheen" aria-hidden="true"></div>
                <canvas class="version-canvas doctrine-canvas" data-canvas aria-hidden="true"></canvas>
                <div class="doctrine-stage-caption">
                  <span>${manifestEntry.versionNumber}</span>
                  <strong>${manifestEntry.title}</strong>
                </div>
              </div>

              <div class="doctrine-traits">
                ${manifestEntry.keyTraits
                  .map(
                    (trait, index) => `
                      <article style="--trait-index:${index}">
                        <span>Trait ${String(index + 1).padStart(2, '0')}</span>
                        <strong>${trait}</strong>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="doctrine-section doctrine-works" id="works">
          <div class="doctrine-section-head reveal">
            <div>
              <p class="doctrine-section-label">Selected works</p>
              <h2>把版本清單做成得獎 portfolio 的長列，而不是縮成一排等價 tab。</h2>
            </div>
            <p class="doctrine-section-copy">
              這裡直接借用 award portfolio 的閱讀方式。每一列都像一件作品條目，先給 title、concept 與 best-for，再決定要不要切進去。
            </p>
          </div>

          <div class="doctrine-work-list">
            ${selections
              .map((selection, index) => {
                const isCurrent = selection.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="doctrine-work reveal ${isCurrent ? 'is-current' : ''}" href="${selection.route}">
                    <span class="doctrine-work-index">${String(index + 1).padStart(2, '0')}</span>
                    <div class="doctrine-work-copy">
                      <strong>${selection.versionNumber} / ${selection.title}</strong>
                      <p>${selection.concept}</p>
                    </div>
                    <div class="doctrine-work-meta">
                      <span>${selection.bestFor}</span>
                      <i>${isCurrent ? 'Current edition' : selection.styleFamily}</i>
                    </div>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="doctrine-section doctrine-method" id="method">
          <div class="doctrine-section-head reveal">
            <div>
              <p class="doctrine-section-label">Operating method</p>
              <h2>得獎站的外型可以借，但真正留下來的是句法、節奏與可重複的生成規則。</h2>
            </div>
            <p class="doctrine-section-copy">
              這一段把方法論直接前台化，避免新版本只剩視覺移植。研究、生成、實作與驗證都還是這個 lab 的硬骨架。
            </p>
          </div>

          <div class="doctrine-method-grid">
            <section class="doctrine-sheet reveal">
              <p class="doctrine-panel-label">Build sequence</p>
              <div class="doctrine-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="doctrine-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="doctrine-sheet reveal">
              <p class="doctrine-panel-label">Execution detail</p>
              <div class="doctrine-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="doctrine-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="doctrine-notes">
              <article class="doctrine-note reveal">
                <p class="doctrine-panel-label">Source principles</p>
                <ul class="doctrine-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="doctrine-note reveal">
                <p class="doctrine-panel-label">Feature emphasis</p>
                <ul class="doctrine-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="doctrine-note reveal">
                <p class="doctrine-panel-label">Performance</p>
                <ul class="doctrine-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="doctrine-section doctrine-close" id="close">
          <div class="doctrine-section-head reveal">
            <div>
              <p class="doctrine-section-label">Reference close</p>
              <h2>最後不是 footer，而像 portfolio 結尾的 credits，讓參考與 lineage 明確留下來。</h2>
            </div>
            <p class="doctrine-section-copy">
              我這次確實借了線上得獎站的閱讀姿態，但要保留的是能轉譯成這個 repo 的結構與節奏。這一段把來源、archive note 與家族關係說清楚。
            </p>
          </div>

          <div class="doctrine-close-grid">
            <section class="doctrine-wall reveal">
              <p class="doctrine-panel-label">Reference links</p>
              <div class="doctrine-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="doctrine-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>↗</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="doctrine-wall reveal">
              <p class="doctrine-panel-label">Archive notes</p>
              <div class="doctrine-archive-list">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="doctrine-archive-card">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
              <div class="doctrine-family-strip">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v012')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    works: root.querySelector('#works'),
    method: root.querySelector('#method'),
    close: root.querySelector('#close'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createDoctrineMotion({
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
        works: sections.works,
        method: sections.method,
        close: sections.close,
      },
      preset: scenePresets.detailDoctrine,
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

function createDoctrineMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--hero-progress', '0')
      root.style.setProperty('--works-progress', '0')
      root.style.setProperty('--method-progress', '0')
      root.style.setProperty('--close-progress', '0')
      return
    }

    root.style.setProperty('--hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--works-progress', getElementProgress(sections.works).toFixed(3))
    root.style.setProperty('--method-progress', getElementProgress(sections.method).toFixed(3))
    root.style.setProperty('--close-progress', getElementProgress(sections.close).toFixed(3))
  }

  return {
    sync,
  }
}

function buildSelections(versions) {
  return versions.slice().reverse()
}
