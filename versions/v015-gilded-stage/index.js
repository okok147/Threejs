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

const HERO_LINES = ['Make the entry feel earned.', 'Make the archive feel collectible.', 'Make the lab feel deployable.']

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const salonEntries = buildSalonEntries(versions)

  container.innerHTML = `
    <div class="version-shell version-shell-v015">
      <div class="gilded-veil" aria-hidden="true"></div>
      <div class="gilded-beam" aria-hidden="true"></div>
      <div class="gilded-noise" aria-hidden="true"></div>

      <header class="gilded-header reveal is-visible">
        <div class="gilded-brand">
          <p class="gilded-code">Gilded Stage / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Private Salon</strong>
        </div>

        <nav class="gilded-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Arrival</a>
          <a href="#salon" data-nav="salon">Salon</a>
          <a href="#method" data-nav="method">Method</a>
          <a href="#patron" data-nav="patron">Patronage</a>
        </nav>

        <div class="gilded-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="gilded-page" id="version-content">
        <section class="gilded-section gilded-hero" id="top" data-section="top">
          <div class="gilded-copy reveal is-visible">
            <p class="gilded-kicker">Private preview / version ${manifestEntry.versionNumber}</p>

            <div class="gilded-manifesto">
              ${HERO_LINES.map((line) => `<span>${line}</span>`).join('')}
            </div>

            <h1>把版本實驗室升級成一個值得停留、挑選與回訪的 showcase salon。</h1>
            <p class="gilded-intro">${manifestEntry.concept}</p>

            <div class="gilded-actions">
              <a class="gilded-button gilded-button-primary" href="#salon">Enter the salon</a>
              <a class="gilded-button gilded-button-secondary" href="#patron">Read the ledger</a>
            </div>

            <dl class="gilded-ledger">
              <div>
                <dt>Current edition</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Archive</dt>
                <dd>${stats.versionCount} registered versions</dd>
              </div>
              <div>
                <dt>Release truth</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="gilded-specs">
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

          <div class="gilded-stage reveal is-visible">
            <div class="gilded-stage-head">
              <span>Salon stage</span>
              <strong>${manifestEntry.title}</strong>
              <i>${manifestEntry.styleFamily}</i>
            </div>

            <div class="gilded-stage-window">
              <div class="gilded-stage-glow" aria-hidden="true"></div>
              <canvas class="version-canvas gilded-canvas" data-canvas aria-hidden="true"></canvas>

              <div class="gilded-stage-card gilded-stage-card-ticket">
                <span>Scene profile</span>
                <strong>${manifestEntry.sceneTreatment}</strong>
              </div>

              <div class="gilded-stage-card gilded-stage-card-release">
                <span>Release</span>
                <strong>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</strong>
              </div>
            </div>

            <div class="gilded-traits">
              ${manifestEntry.keyTraits
                .map(
                  (trait, index) => `
                    <article style="--trait-index:${index}">
                      <span>${String(index + 1).padStart(2, '0')}</span>
                      <strong>${trait}</strong>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="gilded-section gilded-salon" id="salon">
          <div class="gilded-section-head reveal">
            <div>
              <p class="gilded-section-label">Salon registry</p>
              <h2>版本不再只是 tab，而像一排值得比較的 rooms，每一間都有明確角色與進場理由。</h2>
            </div>
            <p class="gilded-section-copy">
              這一版借的是高端 hospitality 與展演入口頁的節奏。先把主舞台建立，再把整個 archive 排成可掃描、可切換、但不廉價的 salon lineup。
            </p>
          </div>

          <div class="gilded-salon-list">
            ${salonEntries
              .map((entry, index) => {
                const isCurrent = entry.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="gilded-salon-item reveal ${isCurrent ? 'is-current' : ''}" href="${entry.route}">
                    <span class="gilded-salon-index">${String(index + 1).padStart(2, '0')}</span>
                    <div class="gilded-salon-copy">
                      <strong>${entry.versionNumber} / ${entry.title}</strong>
                      <p>${entry.concept}</p>
                    </div>
                    <div class="gilded-salon-meta">
                      <span>${entry.bestFor}</span>
                      <strong>${isCurrent ? 'Current salon' : entry.styleFamily}</strong>
                    </div>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="gilded-section gilded-method" id="method">
          <div class="gilded-section-head reveal">
            <div>
              <p class="gilded-section-label">House method</p>
              <h2>高級感若沒有秩序與證據，只會剩下昂貴的空氣。這裡把生成規則、實作與驗證全部攤開。</h2>
            </div>
            <p class="gilded-section-copy">
              這一版刻意把「句法」放在前面。hero 的戲劇感只是入口，真正讓頁面站得住的是可重複的 research、scene preset、tokens 與 registry discipline。
            </p>
          </div>

          <div class="gilded-method-grid">
            <section class="gilded-panel reveal">
              <p class="gilded-panel-label">Build sequence</p>
              <div class="gilded-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="gilded-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="gilded-panel reveal">
              <p class="gilded-panel-label">Execution ledger</p>
              <div class="gilded-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="gilded-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="gilded-side-stack">
              <article class="gilded-note reveal">
                <p class="gilded-panel-label">Source principles</p>
                <ul class="gilded-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="gilded-note reveal">
                <p class="gilded-panel-label">Feature emphasis</p>
                <ul class="gilded-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="gilded-section gilded-patron" id="patron">
          <div class="gilded-section-head reveal">
            <div>
              <p class="gilded-section-label">Patron ledger</p>
              <h2>尾段像會員手冊與收藏紀錄，而不是普通 footer，讓 references、performance 與 lineage 都留在同一個世界觀裡。</h2>
            </div>
            <p class="gilded-section-copy">
              這裡把來源、性能與 archive notes 整合成可以被信任的 closing ledger。頁面最後仍然在講價值與秩序，而不是突然掉回制式收尾。
            </p>
          </div>

          <div class="gilded-patron-grid">
            <section class="gilded-panel reveal">
              <p class="gilded-panel-label">Reference ledger</p>
              <div class="gilded-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="gilded-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>Open</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="gilded-panel reveal">
              <p class="gilded-panel-label">Performance & archive</p>
              <div class="gilded-dual-stack">
                <div class="gilded-mini-list">
                  ${manifestEntry.performanceNotes
                    .map(
                      (note) => `
                        <article>
                          <span>Performance</span>
                          <p>${note}</p>
                        </article>
                      `
                    )
                    .join('')}
                </div>

                <div class="gilded-mini-list">
                  ${content.archiveNotes
                    .map(
                      (note) => `
                        <article>
                          <span>Archive note</span>
                          <strong>${note.title}</strong>
                          <p>${note.body}</p>
                        </article>
                      `
                    )
                    .join('')}
                </div>
              </div>

              <div class="gilded-materials">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v015')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    salon: root.querySelector('#salon'),
    method: root.querySelector('#method'),
    patron: root.querySelector('#patron'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createGildedMotion({
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
        collection: sections.salon,
        atelier: sections.method,
        service: sections.patron,
      },
      preset: scenePresets.gildedStage,
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

function createGildedMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--gilded-hero-progress', '0')
      root.style.setProperty('--gilded-salon-progress', '0')
      root.style.setProperty('--gilded-method-progress', '0')
      root.style.setProperty('--gilded-patron-progress', '0')
      return
    }

    root.style.setProperty('--gilded-hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--gilded-salon-progress', getElementProgress(sections.salon).toFixed(3))
    root.style.setProperty('--gilded-method-progress', getElementProgress(sections.method).toFixed(3))
    root.style.setProperty('--gilded-patron-progress', getElementProgress(sections.patron).toFixed(3))
  }

  return { sync }
}

function buildSalonEntries(versions) {
  return versions.slice().reverse()
}
