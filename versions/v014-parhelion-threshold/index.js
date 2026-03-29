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

const ARRIVAL_LINES = ['Poster-first launch', 'Warm horizon core', 'Destination-grade pacing']

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const procession = versions.slice().reverse()

  container.innerHTML = `
    <div class="version-shell version-shell-v014">
      <div class="parhelion-aurora" aria-hidden="true"></div>
      <div class="parhelion-grid" aria-hidden="true"></div>
      <div class="parhelion-beam" aria-hidden="true"></div>

      <header class="parhelion-header reveal is-visible">
        <div class="parhelion-brand">
          <p class="parhelion-code">Parhelion threshold / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Horizon Office</strong>
        </div>

        <nav class="parhelion-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Arrival</a>
          <a href="#procession" data-nav="procession">Procession</a>
          <a href="#atelier" data-nav="atelier">Atelier</a>
          <a href="#departure" data-nav="departure">Departure</a>
        </nav>

        <div class="parhelion-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="parhelion-page" id="version-content">
        <section class="parhelion-section parhelion-hero" id="top" data-section="top">
          <div class="parhelion-copy reveal is-visible">
            <p class="parhelion-kicker">Destination launch / version ${manifestEntry.versionNumber}</p>
            <div class="parhelion-arrival-strip">
              ${ARRIVAL_LINES.map((line) => `<span>${line}</span>`).join('')}
            </div>

            <h1>
              借高級首頁的
              <br />
              節奏，不借它們的殼。
            </h1>

            <p class="parhelion-intro">${manifestEntry.concept}</p>

            <div class="parhelion-actions">
              <a class="parhelion-button parhelion-button-primary" href="#procession">Browse editions</a>
              <a class="parhelion-button parhelion-button-secondary" href="#atelier">Read the method</a>
            </div>

            <dl class="parhelion-ledger">
              <div>
                <dt>Current edition</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Archive count</dt>
                <dd>${stats.versionCount} registered versions</dd>
              </div>
              <div>
                <dt>Release truth</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="parhelion-specs">
              <article>
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article>
                <span>Use case</span>
                <strong>${manifestEntry.useCaseEmphasis}</strong>
              </article>
              <article>
                <span>Motion language</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
            </div>
          </div>

          <div class="parhelion-stage reveal is-visible">
            <div class="parhelion-stage-frame">
              <div class="parhelion-stage-head">
                <span>Hero viewport</span>
                <strong>${manifestEntry.title}</strong>
                <i>${manifestEntry.styleFamily}</i>
              </div>

              <div class="parhelion-stage-window">
                <div class="parhelion-stage-glow" aria-hidden="true"></div>
                <canvas class="version-canvas parhelion-canvas" data-canvas aria-hidden="true"></canvas>

                <div class="parhelion-stage-caption">
                  <span>${manifestEntry.sceneTreatment}</span>
                  <strong>Threshold image</strong>
                </div>

                <div class="parhelion-stage-badge">
                  <span>Edition</span>
                  <strong>${manifestEntry.versionNumber}</strong>
                </div>
              </div>

              <div class="parhelion-trait-list">
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

        <section class="parhelion-section parhelion-procession" id="procession">
          <div class="parhelion-section-head reveal">
            <div>
              <p class="parhelion-section-label">Edition procession</p>
              <h2>版本改成一列列可掃描的目的地，而不是一排等價按鈕。</h2>
            </div>
            <p class="parhelion-section-copy">
              這一版把靈感網站常見的 destination pacing、poster-first hero 與 calm luxury spacing 抽成句法，再把整個 lab archive 變成一條真正可判斷的 procession。
            </p>
          </div>

          <div class="parhelion-procession-list">
            ${procession
              .map((item, index) => {
                const isCurrent = item.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="parhelion-item reveal ${isCurrent ? 'is-current' : ''}" href="${item.route}">
                    <span class="parhelion-item-index">${String(index + 1).padStart(2, '0')}</span>
                    <div class="parhelion-item-main">
                      <strong>${item.versionNumber} / ${item.title}</strong>
                      <p>${item.concept}</p>
                    </div>
                    <div class="parhelion-item-meta">
                      <span>${item.bestFor}</span>
                      <i>${isCurrent ? 'Current horizon' : item.styleFamily}</i>
                    </div>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="parhelion-section parhelion-atelier" id="atelier">
          <div class="parhelion-section-head reveal">
            <div>
              <p class="parhelion-section-label">Atelier spread</p>
              <h2>漂亮只是結果，真正該被保留下來的是構圖邏輯、滾動節奏與生成規則。</h2>
            </div>
            <p class="parhelion-section-copy">
              所以這一版沒有用 dashboard 卡片海來假裝高級。方法、實作與研究來源被放到同一個 spread，讓新版本的野心與可部署性同時留在前台。
            </p>
          </div>

          <div class="parhelion-atelier-grid">
            <section class="parhelion-manifesto reveal">
              <p class="parhelion-panel-label">Creative thesis</p>
              <h3>讓第一屏像一張會呼吸的海報，後面每段只做一件事。</h3>
              <div class="parhelion-chapter-list">
                ${content.chapters
                  .map(
                    (chapter) => `
                      <article class="parhelion-chapter">
                        <span>${chapter.step}</span>
                        <strong>${chapter.title}</strong>
                        <p>${chapter.body}</p>
                        <i>${chapter.note}</i>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="parhelion-sheet reveal">
              <p class="parhelion-panel-label">Build sequence</p>
              <div class="parhelion-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="parhelion-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="parhelion-sheet reveal">
              <p class="parhelion-panel-label">Execution detail</p>
              <div class="parhelion-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="parhelion-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="parhelion-notes">
              <article class="parhelion-note reveal">
                <p class="parhelion-panel-label">Source principles</p>
                <ul class="parhelion-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="parhelion-note reveal">
                <p class="parhelion-panel-label">Experience features</p>
                <ul class="parhelion-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="parhelion-note reveal">
                <p class="parhelion-panel-label">Performance guardrails</p>
                <ul class="parhelion-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="parhelion-section parhelion-departure" id="departure">
          <div class="parhelion-section-head reveal">
            <div>
              <p class="parhelion-section-label">Departure desk</p>
              <h2>收尾不是 footer，而像旅程結束前的 reference lounge。</h2>
            </div>
            <p class="parhelion-section-copy">
              我刻意保留來源與 lineage，因為真正好的改寫不是把 inspiration 藏起來，而是把它提煉成自己的系統，再誠實地留下一條可追溯的路。
            </p>
          </div>

          <div class="parhelion-departure-grid">
            <section class="parhelion-wall reveal">
              <p class="parhelion-panel-label">Reference signals</p>
              <div class="parhelion-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="parhelion-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>Open</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="parhelion-wall reveal">
              <p class="parhelion-panel-label">Assurance notes</p>
              <div class="parhelion-assurance-list">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="parhelion-assurance">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
              <div class="parhelion-family-strip">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v014')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    procession: root.querySelector('#procession'),
    atelier: root.querySelector('#atelier'),
    departure: root.querySelector('#departure'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createParhelionMotion({
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
        experience: sections.procession,
        stack: sections.atelier,
        references: sections.departure,
      },
      preset: scenePresets.orbitCinematic,
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

function createParhelionMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--arrival-progress', '0')
      root.style.setProperty('--procession-progress', '0')
      root.style.setProperty('--atelier-progress', '0')
      root.style.setProperty('--departure-progress', '0')
      return
    }

    root.style.setProperty('--arrival-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--procession-progress', getElementProgress(sections.procession).toFixed(3))
    root.style.setProperty('--atelier-progress', getElementProgress(sections.atelier).toFixed(3))
    root.style.setProperty('--departure-progress', getElementProgress(sections.departure).toFixed(3))
  }

  return {
    sync,
  }
}
