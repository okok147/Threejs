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

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const levels = buildLevels(versions)
  const activeLevel = levels.find((level) => level.versionNumber === manifestEntry.versionNumber) ?? levels.at(-1)

  container.innerHTML = `
    <div class="version-shell version-shell-v011">
      <div class="lightwell-grid" aria-hidden="true"></div>
      <div class="lightwell-glow" aria-hidden="true"></div>
      <div class="lightwell-columns" aria-hidden="true"></div>

      <header class="lightwell-header reveal is-visible">
        <div class="lightwell-brand">
          <p class="lightwell-code">Lightwell archive / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Vertical Registry</strong>
        </div>

        <nav class="lightwell-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Skylight</a>
          <a href="#index" data-nav="index">Levels</a>
          <a href="#protocol" data-nav="protocol">Material</a>
          <a href="#courtyard" data-nav="courtyard">Courtyard</a>
        </nav>

        <div class="lightwell-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="lightwell-page" id="version-content">
        <section class="lightwell-section lightwell-hero" id="top" data-section="top">
          <div class="lightwell-copy reveal is-visible">
            <p class="lightwell-kicker">Skylight foyer / version ${manifestEntry.versionNumber}</p>
            <h1>
              把版本實驗室改寫成
              <span>一座會把版本吊掛進光井裡的中庭。</span>
            </h1>
            <p class="lightwell-intro">${manifestEntry.concept}</p>

            <div class="lightwell-actions">
              <a class="lightwell-button lightwell-button-primary" href="#index">查看樓層索引</a>
              <a class="lightwell-button lightwell-button-secondary" href="#courtyard">前往 courtyard notes</a>
            </div>

            <dl class="lightwell-ledger">
              <div>
                <dt>Current level</dt>
                <dd>${activeLevel.label}</dd>
              </div>
              <div>
                <dt>Archive height</dt>
                <dd>${stats.versionCount} registered levels</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="lightwell-copy-grid">
              <article>
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article>
                <span>Navigation</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </article>
              <article>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
            </div>
          </div>

          <div class="lightwell-stage reveal is-visible">
            <div class="lightwell-frame">
              <div class="lightwell-frame-head">
                <span>Skylight chamber</span>
                <strong>Vertical signal core</strong>
                <i>${manifestEntry.styleFamily}</i>
              </div>

              <div class="lightwell-frame-window">
                <div class="lightwell-frame-beams" aria-hidden="true"></div>
                <canvas class="version-canvas lightwell-canvas" data-canvas aria-hidden="true"></canvas>

                <div class="lightwell-hangers">
                  ${levels
                    .slice(-4)
                    .reverse()
                    .map(
                      (level, index) => `
                        <span class="lightwell-hanger ${level.versionNumber === manifestEntry.versionNumber ? 'is-current' : ''}" style="--hanger-offset:${index}">
                          ${level.label}
                        </span>
                      `
                    )
                    .join('')}
                </div>
              </div>

              <div class="lightwell-traits">
                ${manifestEntry.keyTraits
                  .map(
                    (trait) => `
                      <article>
                        <span>Trait</span>
                        <strong>${trait}</strong>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="lightwell-section lightwell-index" id="index">
          <div class="lightwell-section-head reveal">
            <div>
              <p class="lightwell-section-label">Level index</p>
              <h2>版本不再像路線或節目表，而像一座垂直建築裡可直接對位的樓層。</h2>
            </div>
            <p class="lightwell-section-copy">
              這一版把切換感改成「選層」。你先理解哪一層適合當前閱讀姿態，再從吊掛標識與樓層摘要進入對應版本。
            </p>
          </div>

          <div class="lightwell-level-list">
            ${levels
              .slice()
              .reverse()
              .map((level) => {
                const isCurrent = level.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="lightwell-level reveal ${isCurrent ? 'is-current' : ''}" href="${level.route}">
                    <span class="lightwell-level-mark">${level.label}</span>
                    <div class="lightwell-level-copy">
                      <strong>${level.versionNumber} / ${level.title}</strong>
                      <p>${level.bestFor}</p>
                    </div>
                    <i>${isCurrent ? 'Current landing' : level.styleFamily}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="lightwell-section lightwell-protocol" id="protocol">
          <div class="lightwell-section-head reveal">
            <div>
              <p class="lightwell-section-label">Material protocol</p>
              <h2>方法與實作被翻成材料、構件與吊掛規則，而不是獨立漂浮的功能卡。</h2>
            </div>
            <p class="lightwell-section-copy">
              在這裡，shared content、scene preset 與 performance guardrail 都被當成建築構件來讀。每一層能成立，是因為光井、欄網與結構語法先站穩。
            </p>
          </div>

          <div class="lightwell-protocol-grid">
            <section class="lightwell-slab reveal">
              <p class="lightwell-panel-label">Construction sequence</p>
              <div class="lightwell-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="lightwell-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="lightwell-slab reveal">
              <p class="lightwell-panel-label">Fabrication notes</p>
              <div class="lightwell-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="lightwell-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="lightwell-notes">
              <article class="lightwell-note reveal">
                <p class="lightwell-panel-label">Source principles</p>
                <ul class="lightwell-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="lightwell-note reveal">
                <p class="lightwell-panel-label">UX emphasis</p>
                <ul class="lightwell-bullet-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="lightwell-note reveal">
                <p class="lightwell-panel-label">Performance</p>
                <ul class="lightwell-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="lightwell-section lightwell-courtyard" id="courtyard">
          <div class="lightwell-section-head reveal">
            <div>
              <p class="lightwell-section-label">Courtyard notes</p>
              <h2>最後一區不是 footer，而像中庭邊緣的石牆，把參考與 archive rules 都留在光線能照到的地方。</h2>
            </div>
            <p class="lightwell-section-copy">
              references、family lineage 與 archive note 在這裡不再像補充資料，而像建築邊界的刻字。它們是這個版本能被再次回讀的理由。
            </p>
          </div>

          <div class="lightwell-courtyard-grid">
            <section class="lightwell-wall reveal">
              <p class="lightwell-panel-label">Reference wall</p>
              <div class="lightwell-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="lightwell-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>↗</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="lightwell-wall reveal">
              <p class="lightwell-panel-label">Archive inscription</p>
              <div class="lightwell-archive-list">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="lightwell-archive-card">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>

              <div class="lightwell-family-strip">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v011')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    index: root.querySelector('#index'),
    protocol: root.querySelector('#protocol'),
    courtyard: root.querySelector('#courtyard'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createLightwellMotion({
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
        index: sections.index,
        protocol: sections.protocol,
        courtyard: sections.courtyard,
      },
      preset: scenePresets.lightwellArchive,
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

function createLightwellMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--hero-progress', '0')
      root.style.setProperty('--index-progress', '0')
      root.style.setProperty('--protocol-progress', '0')
      root.style.setProperty('--courtyard-progress', '0')
      return
    }

    root.style.setProperty('--hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--index-progress', getElementProgress(sections.index).toFixed(3))
    root.style.setProperty('--protocol-progress', getElementProgress(sections.protocol).toFixed(3))
    root.style.setProperty('--courtyard-progress', getElementProgress(sections.courtyard).toFixed(3))
  }

  return {
    sync,
  }
}

function buildLevels(versions) {
  return versions.map((version) => ({
    ...version,
    label: `LVL ${String(Number(version.versionNumber.slice(1))).padStart(2, '0')}`,
  }))
}
