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

const TRANSIT_LINES = [
  {
    code: 'A',
    name: 'Launch Arc',
    tone: 'amber',
    thesis: '世界觀、編輯與策展型首頁',
  },
  {
    code: 'B',
    name: 'Systems Loop',
    tone: 'mint',
    thesis: '控制、圖譜與信號型介面',
  },
  {
    code: 'C',
    name: 'Stage Express',
    tone: 'rose',
    thesis: '表演、海報與實驗式 front stage',
  },
]

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const transitLines = buildTransitLines(versions)
  const activeLine = findLineForVersion(transitLines, manifestEntry.versionNumber)

  container.innerHTML = `
    <div class="version-shell version-shell-v009">
      <div class="concourse-grid" aria-hidden="true"></div>
      <div class="concourse-ambient-lines" aria-hidden="true"></div>
      <div class="concourse-signal-wash" aria-hidden="true"></div>

      <header class="concourse-header reveal is-visible">
        <div class="concourse-brand">
          <p class="concourse-code">Network concourse / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} Transit Laboratory</strong>
        </div>

        <nav class="concourse-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Departure</a>
          <a href="#experience" data-nav="experience">Interchange</a>
          <a href="#stack" data-nav="stack">Service</a>
          <a href="#references" data-nav="references">Terminal</a>
        </nav>

        <div class="concourse-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="concourse-page" id="version-content">
        <section class="concourse-section concourse-hero" id="top" data-section="top">
          <div class="concourse-board reveal is-visible">
            <div class="concourse-board-top">
              <p class="concourse-kicker">Departure board / version ${manifestEntry.versionNumber}</p>
              <span class="concourse-line-tag is-${activeLine.tone}">${activeLine.code} / ${activeLine.name}</span>
            </div>

            <h1>
              把版本實驗室改寫成
              <span>一座先看轉乘邏輯、再決定去哪個介面世界的都會站體。</span>
            </h1>
            <p class="concourse-intro">${manifestEntry.concept}</p>

            <div class="concourse-actions">
              <a class="concourse-button concourse-button-primary" href="#experience">查看轉乘圖</a>
              <a class="concourse-button concourse-button-secondary" href="#references">前往 terminal notices</a>
            </div>

            <dl class="concourse-ledger">
              <div>
                <dt>Current platform</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Network size</dt>
                <dd>${stats.versionCount} published stops</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="concourse-hero-grid">
              <article class="concourse-info-card">
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article class="concourse-info-card">
                <span>Navigation</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </article>
              <article class="concourse-info-card">
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
            </div>

            <ul class="concourse-traits">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </div>

          <div class="concourse-stage reveal is-visible">
            <div class="concourse-platform-frame">
              <div class="concourse-platform-header">
                <span>Platform viewport</span>
                <strong>Live signal lantern</strong>
                <i>Arrivals respond to scroll progress</i>
              </div>

              <div class="concourse-platform-window">
                <div class="concourse-platform-grid" aria-hidden="true"></div>
                <canvas class="version-canvas concourse-canvas" data-canvas aria-hidden="true"></canvas>
              </div>

              <div class="concourse-platform-meta">
                <article>
                  <span>Route family</span>
                  <strong>${manifestEntry.styleFamily}</strong>
                </article>
                <article>
                  <span>Scene role</span>
                  <strong>${manifestEntry.sceneTreatment}</strong>
                </article>
              </div>
            </div>

            <div class="concourse-stage-legend">
              ${transitLines
                .map(
                  (line) => `
                    <article class="concourse-stage-line is-${line.tone}">
                      <span>${line.code}</span>
                      <strong>${line.name}</strong>
                      <p>${line.thesis}</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="concourse-section concourse-interchange" id="experience">
          <div class="concourse-section-head reveal">
            <div>
              <p class="concourse-section-label">Interchange map</p>
              <h2>版本在這裡不是排序清單，而是需要選線、轉乘、再進站的 route network。</h2>
            </div>
            <p class="concourse-section-copy">
              這一版把使用者角色改成旅客。你先判斷自己要去哪一種介面世界，再從線路、站名與轉乘節點做版本切換，而不是直接看一排平等卡片。
            </p>
          </div>

          <div class="concourse-network-grid">
            <aside class="concourse-panel reveal">
              <p class="concourse-panel-label">Wayfinding logic</p>
              <div class="concourse-decision-list">
                <article>
                  <span>01</span>
                  <strong>先選線，而不是先看外觀。</strong>
                  <p>每條線先揭露一種閱讀姿態，讓使用者先完成一次方向判斷。</p>
                </article>
                <article>
                  <span>02</span>
                  <strong>每站只給足夠決策資訊。</strong>
                  <p>stop card 只保留 title、best for 與 style family，維持 progressive disclosure。</p>
                </article>
                <article>
                  <span>03</span>
                  <strong>current stop 要像月台，而不是 badge。</strong>
                  <p>現在版本被視作 active platform，整頁的敘事與 signal tone 都以它為主。</p>
                </article>
              </div>
            </aside>

            <div class="concourse-line-map">
              ${transitLines
                .map(
                  (line) => `
                    <section class="concourse-line reveal is-${line.tone}">
                      <div class="concourse-line-head">
                        <span class="concourse-line-badge">${line.code}</span>
                        <div>
                          <strong>${line.name}</strong>
                          <p>${line.thesis}</p>
                        </div>
                      </div>

                      <div class="concourse-stop-list">
                        ${line.stops
                          .map((version) => {
                            const isCurrent = version.versionNumber === manifestEntry.versionNumber
                            return `
                              <a class="concourse-stop ${isCurrent ? 'is-current' : ''}" href="${version.route}">
                                <span class="concourse-stop-node" aria-hidden="true"></span>
                                <div class="concourse-stop-copy">
                                  <div class="concourse-stop-head">
                                    <strong>${version.versionNumber} / ${version.title}</strong>
                                    <i>${isCurrent ? 'Current platform' : 'Open platform'}</i>
                                  </div>
                                  <p>${version.bestFor}</p>
                                  <small>${version.styleFamily}</small>
                                </div>
                              </a>
                            `
                          })
                          .join('')}
                      </div>
                    </section>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="concourse-section concourse-service" id="stack">
          <div class="concourse-section-head reveal">
            <div>
              <p class="concourse-section-label">Service bulletins</p>
              <h2>方法、工程與效能不再像文件附錄，而是像站務通告與班次表一樣被前台化。</h2>
            </div>
            <p class="concourse-section-copy">
              這一段把實驗室治理語言翻成 transit ops：什麼時候進站、什麼訊息該先看、哪些訊號要一致，全部都用班表與 notice board 的節奏來讀。
            </p>
          </div>

          <div class="concourse-service-grid">
            <section class="concourse-board-panel reveal">
              <p class="concourse-panel-label">Platform instructions</p>
              <div class="concourse-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="concourse-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="concourse-board-panel reveal">
              <p class="concourse-panel-label">Ops timetable</p>
              <div class="concourse-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="concourse-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="concourse-notice-stack">
              <article class="concourse-notice reveal">
                <p class="concourse-panel-label">Source principles</p>
                <ul class="concourse-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="concourse-notice reveal">
                <p class="concourse-panel-label">Feature emphasis</p>
                <ul class="concourse-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="concourse-notice reveal">
                <p class="concourse-panel-label">Performance</p>
                <ul class="concourse-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="concourse-section concourse-terminal" id="references">
          <div class="concourse-section-head reveal">
            <div>
              <p class="concourse-section-label">Terminal notices</p>
              <h2>最後一站不是 footer，而是把研究來源、archive rule 與 consulted families 一起做成出口系統。</h2>
            </div>
            <p class="concourse-section-copy">
              真正的 transit interface 不只會把人送到目的地，也會在出口前確認最後一輪方向感。這裡把 references、archive note 與 source family 一起留在 terminal wall。
            </p>
          </div>

          <div class="concourse-terminal-grid">
            <section class="concourse-terminal-panel reveal">
              <p class="concourse-panel-label">Wayfinding references</p>
              <div class="concourse-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="concourse-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>↗</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="concourse-terminal-panel reveal">
              <p class="concourse-panel-label">Exit wall</p>
              <div class="concourse-exit-grid">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="concourse-exit-card">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>

              <div class="concourse-family-strip">
                ${manifestEntry.sourceFamiliesConsulted
                  .map((family) => `<span>${family}</span>`)
                  .join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v009')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 70))

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

  const motionController = createConcourseMotion({
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
        experience: sections.experience,
        stack: sections.stack,
        references: sections.references,
      },
      preset: scenePresets.networkConcourse,
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

function createConcourseMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--hero-progress', '0')
      root.style.setProperty('--map-progress', '0')
      root.style.setProperty('--service-progress', '0')
      root.style.setProperty('--terminal-progress', '0')
      return
    }

    root.style.setProperty('--hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--map-progress', getElementProgress(sections.experience).toFixed(3))
    root.style.setProperty('--service-progress', getElementProgress(sections.stack).toFixed(3))
    root.style.setProperty('--terminal-progress', getElementProgress(sections.references).toFixed(3))
  }

  return {
    sync,
  }
}

function buildTransitLines(versions) {
  const chunkSize = Math.max(1, Math.ceil(versions.length / TRANSIT_LINES.length))

  return TRANSIT_LINES.map((line, index) => ({
    ...line,
    stops: versions.slice(index * chunkSize, (index + 1) * chunkSize),
  })).filter((line) => line.stops.length)
}

function findLineForVersion(lines, versionNumber) {
  return lines.find((line) => line.stops.some((stop) => stop.versionNumber === versionNumber)) ?? lines[0]
}
