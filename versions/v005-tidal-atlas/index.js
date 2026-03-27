import './styles.css'
import { createLifecycle, createSectionNavController, setupReveals } from '../../src/lib/page.js'
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

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  container.innerHTML = `
    <div class="version-shell version-shell-v005">
      <div class="atlas-contours" aria-hidden="true"></div>
      <div class="atlas-grain" aria-hidden="true"></div>
      <div class="atlas-vignette" aria-hidden="true"></div>

      <header class="atlas-header reveal is-visible">
        <a class="atlas-brand" href="#top">
          <span class="atlas-brand-mark"></span>
          <span>${content.brand}</span>
        </a>

        <nav class="atlas-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Chart</a>
          <a href="#experience" data-nav="experience">Currents</a>
          <a href="#stack" data-nav="stack">Soundings</a>
          <a href="#references" data-nav="references">Beacons</a>
        </nav>

        <div class="atlas-header-meta">
          <span>Edition ${manifestEntry.versionNumber}</span>
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="atlas-page" id="version-content">
        <section class="atlas-hero" id="top" data-section="top">
          <div class="atlas-hero-copy reveal is-visible">
            <p class="atlas-kicker">Tidal atlas / version ${manifestEntry.versionNumber}</p>
            <h1>
              把版本實驗室翻成潮汐圖譜，
              <span>讓每個版本像航道、測深點與海流一起被閱讀。</span>
            </h1>
            <p class="atlas-intro">${manifestEntry.concept}</p>

            <div class="atlas-actions">
              <a class="atlas-button atlas-button-primary" href="#experience">閱讀航道</a>
              <a class="atlas-button atlas-button-secondary" href="#references">查看 beacon room</a>
            </div>

            <dl class="atlas-ledger">
              <div>
                <dt>Current atlas</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Best for</dt>
                <dd>${manifestEntry.bestFor}</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <ul class="atlas-traits">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </div>

          <div class="atlas-stage reveal is-visible">
            <div class="atlas-chart-frame">
              <div class="atlas-chart-rose" aria-hidden="true"></div>
              <div class="atlas-chart-grid" aria-hidden="true"></div>
              <canvas class="version-canvas atlas-canvas" data-canvas aria-hidden="true"></canvas>

              <div class="atlas-chart-overlay">
                <p class="atlas-kicker">Sea glass core</p>
                <strong>${manifestEntry.styleFamily}</strong>
                <p>${manifestEntry.sceneTreatment}</p>
              </div>
            </div>

            <div class="atlas-stage-notes">
              <div>
                <span>Published routes</span>
                <strong>${stats.versionCount}</strong>
              </div>
              <div>
                <span>Navigation</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </div>
              <div>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="atlas-section atlas-routes" id="experience">
          <div class="atlas-section-head reveal">
            <div>
              <p class="atlas-section-label">Current routes</p>
              <h2>版本不再只是清單，而是一組彼此不同的航道與閱讀流向。</h2>
            </div>
            <p class="atlas-section-copy">
              v005 把 version switching 改寫成航海圖桌語言：先讀 route 的用途、敘事與場景，再決定往哪個介面世界航行。
            </p>
          </div>

          <div class="atlas-route-list">
            ${versions
              .map((version, index) => {
                const isCurrent = version.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="atlas-route-row reveal ${isCurrent ? 'is-current' : ''}" href="${version.route}">
                    <span class="atlas-route-order">${String(index + 1).padStart(2, '0')}</span>
                    <div class="atlas-route-main">
                      <strong>${version.versionNumber} / ${version.title}</strong>
                      <p>${version.styleFamily}</p>
                    </div>
                    <div class="atlas-route-meta">
                      <span>Best for</span>
                      <strong>${version.bestFor}</strong>
                    </div>
                    <div class="atlas-route-meta">
                      <span>Narrative</span>
                      <strong>${version.narrativeStructure}</strong>
                    </div>
                    <i>${isCurrent ? 'Current tide' : 'Open route'}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="atlas-section atlas-soundings" id="stack">
          <div class="atlas-section-head reveal">
            <div>
              <p class="atlas-section-label">Soundings</p>
              <h2>方法、UX 與效能被寫成測深紀錄，讓這一版不只是海圖表面。</h2>
            </div>
            <p class="atlas-section-copy">
              這個版本把方法論翻成 annotation corridor：左邊是航行步驟與實作線，右邊是 source principles、UX 線索與 performance depth。
            </p>
          </div>

          <div class="atlas-sounding-grid">
            <div class="atlas-sounding-sheet reveal">
              <p class="atlas-panel-label">Method corridor</p>
              <div class="atlas-step-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="atlas-step">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </div>

            <div class="atlas-sounding-sheet reveal">
              <p class="atlas-panel-label">Implementation sounding</p>
              <div class="atlas-line-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="atlas-line">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </div>

            <aside class="atlas-annotation-stack">
              <article class="atlas-note reveal">
                <p class="atlas-panel-label">Source principles</p>
                <ul class="atlas-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="atlas-note reveal">
                <p class="atlas-panel-label">Notable UX</p>
                <ul class="atlas-bullet-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="atlas-note reveal">
                <p class="atlas-panel-label">Performance depth</p>
                <ul class="atlas-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="atlas-section atlas-beacons" id="references">
          <div class="atlas-section-head reveal">
            <div>
              <p class="atlas-section-label">Beacon room</p>
              <h2>研究來源、feature track 與 archive note 像燈塔一樣固定可見，避免航道只剩氣氛。</h2>
            </div>
            <p class="atlas-section-copy">
              這一版的藝術方向來自海圖與潮汐圖譜，但導航感仍由可信來源與版本家族結構維持，不靠裝飾性 nautical props 撐場。
            </p>
          </div>

          <div class="atlas-beacon-grid">
            <div class="atlas-beacon-list">
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="atlas-beacon reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                      <i>↗</i>
                    </a>
                  `
                )
                .join('')}
            </div>

            <div class="atlas-track-stack">
              <article class="atlas-track-panel reveal">
                <p class="atlas-panel-label">Feature tracks</p>
                <div class="atlas-track-list">
                  ${content.featureTracks
                    .map(
                      (track) => `
                        <div class="atlas-track">
                          <span>${track.family}</span>
                          <strong>${track.name}</strong>
                          <p>${track.summary}</p>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </article>

              <article class="atlas-track-panel reveal">
                <p class="atlas-panel-label">Archive notes</p>
                <div class="atlas-track-list">
                  ${content.archiveNotes
                    .map(
                      (note) => `
                        <div class="atlas-track">
                          <strong>${note.title}</strong>
                          <p>${note.body}</p>
                        </div>
                      `
                    )
                    .join('')}
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v005')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    experience: root.querySelector('#experience'),
    stack: root.querySelector('#stack'),
    references: root.querySelector('#references'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const canvas = root.querySelector('[data-canvas]')

  if (canvas) {
    const sceneController = createLabScene({
      canvas,
      prefersReducedMotion,
      trackedSections: {
        experience: sections.experience,
        stack: sections.stack,
        references: sections.references,
      },
      preset: scenePresets.tidalAtlas,
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
    lifecycle.addEventListener(window, 'pointermove', sceneController.handlePointerMove, {
      passive: true,
    })
    lifecycle.addEventListener(window, 'scroll', sceneController.handleScroll, { passive: true })
    lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
    lifecycle.addEventListener(document, 'visibilitychange', handleVisibilityChange)

    sceneController.handleResize()
    sceneController.handleScroll()

    if (!document.hidden) {
      sceneController.start()
    }
  } else {
    lifecycle.addEventListener(window, 'resize', uiController.handleResize)
    lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
  }

  uiController.handleScroll()

  requestAnimationFrame(() => {
    root.classList.add('is-ready')
  })

  return () => lifecycle.destroy()
}
