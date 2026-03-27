import './styles.css'
import { createLifecycle, createSectionNavController, setupReveals } from '../../src/lib/page.js'
import { createLabScene, scenePresets } from '../../src/lib/scene.js'

const STATUS_LABELS = {
  stable: '穩定',
  experimental: '實驗中',
  draft: '草稿',
  archived: '封存',
  blocked: '受阻',
}

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
    <div class="version-shell version-shell-v004">
      <div class="deck-grid" aria-hidden="true"></div>
      <div class="deck-noise" aria-hidden="true"></div>

      <header class="deck-header reveal is-visible">
        <a class="deck-brand" href="#top">
          <span class="deck-brand-mark"></span>
          <span>${content.brand}</span>
        </a>

        <nav class="deck-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Live Scope</a>
          <a href="#experience" data-nav="experience">Modes</a>
          <a href="#stack" data-nav="stack">Verification</a>
          <a href="#references" data-nav="references">Signals</a>
        </nav>

        <div class="deck-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="deck-page" id="version-content">
        <section class="deck-hero" id="top" data-section="top">
          <aside class="deck-panel deck-command-panel reveal is-visible" aria-label="Mode command">
            <p class="deck-panel-label">Operator mode</p>
            <h1>${content.brand} 把版本實驗室翻成可操作的觀測控制桌。</h1>
            <p class="deck-intro">${manifestEntry.concept}</p>

            <div class="deck-actions">
              <a class="deck-button deck-button-primary" href="#experience">切換模式</a>
              <a class="deck-button deck-button-secondary" href="#stack">查看驗證紀錄</a>
            </div>

            <dl class="deck-definition-list">
              <div>
                <dt>Current mode</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>${STATUS_LABELS[manifestEntry.status] ?? manifestEntry.status}</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <ul class="deck-trait-list">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </aside>

          <div class="deck-scope reveal is-visible">
            <div class="deck-scope-frame">
              <canvas class="version-canvas" data-canvas aria-hidden="true"></canvas>
              <div class="deck-scope-ring" aria-hidden="true"></div>
              <div class="deck-scope-crosshair" aria-hidden="true"></div>
              <div class="deck-scope-scan" aria-hidden="true"></div>

              <div class="deck-scope-overlay">
                <p class="deck-kicker">Instrument deck / version ${manifestEntry.versionNumber}</p>
                <strong>${manifestEntry.styleFamily}</strong>
                <p>${manifestEntry.bestFor}</p>
              </div>
            </div>

            <div class="deck-scope-footer">
              <div class="deck-scope-metric">
                <span>Published modes</span>
                <strong>${stats.versionCount}</strong>
              </div>
              <div class="deck-scope-metric">
                <span>Navigation model</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </div>
              <div class="deck-scope-metric">
                <span>Motion profile</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </div>
            </div>
          </div>

          <aside class="deck-panel deck-inspector reveal is-visible" aria-label="Mode inspector">
            <p class="deck-panel-label">Inspector</p>
            <div class="deck-inspector-item">
              <span>Use case</span>
              <strong>${manifestEntry.useCaseEmphasis}</strong>
            </div>
            <div class="deck-inspector-item">
              <span>Scene</span>
              <strong>${manifestEntry.sceneTreatment}</strong>
            </div>
            <div class="deck-inspector-item">
              <span>Narrative</span>
              <strong>${manifestEntry.narrativeStructure}</strong>
            </div>
            <div class="deck-inspector-item">
              <span>Primary cue</span>
              <strong>${manifestEntry.notableUxIdeas[0]}</strong>
            </div>
          </aside>
        </section>

        <section class="deck-section deck-modes" id="experience">
          <div class="deck-section-head reveal">
            <div>
              <p class="deck-section-label">Mode registry</p>
              <h2>把所有版本當成操作模式，而不是繼續堆另一批敘事卡片。</h2>
            </div>
            <p class="deck-section-copy">
              v004 的主角不是單一長篇故事，而是版本切換本身。使用者可以先掃描模式、用途、場景處理與發布狀態，再決定要進哪一版。
            </p>
          </div>

          <div class="deck-mode-list" role="list">
            ${versions
              .map((version) => {
                const isCurrent = version.versionNumber === manifestEntry.versionNumber
                return `
                  <a
                    class="deck-mode-row reveal ${isCurrent ? 'is-current' : ''}"
                    href="${version.route}"
                    role="listitem"
                  >
                    <span class="deck-mode-id">${version.versionNumber}</span>
                    <div class="deck-mode-summary">
                      <strong>${version.title}</strong>
                      <p>${version.styleFamily}</p>
                    </div>
                    <div class="deck-mode-detail">
                      <span>Best for</span>
                      <strong>${version.bestFor}</strong>
                    </div>
                    <div class="deck-mode-detail">
                      <span>Scene</span>
                      <strong>${version.sceneTreatment}</strong>
                    </div>
                    <div class="deck-mode-detail">
                      <span>Release</span>
                      <strong>${RELEASE_LABELS[version.releaseStatus] ?? version.releaseStatus}</strong>
                    </div>
                    <i>${isCurrent ? 'Current' : 'Open'}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="deck-section deck-verification" id="stack">
          <div class="deck-section-head reveal">
            <div>
              <p class="deck-section-label">Verification log</p>
              <h2>把方法、實作與效能紀錄並排成 operator log，而不是藏在 repo 深處。</h2>
            </div>
            <p class="deck-section-copy">
              這一版把 lab 的驗證邏輯前台化：一邊看工作流程，一邊看實作線與 performance notes，閱讀姿態從敘事轉成操作與判斷。
            </p>
          </div>

          <div class="deck-log-board">
            <article class="deck-log-panel reveal">
              <p class="deck-panel-label">Method stack</p>
              <div class="deck-step-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <div class="deck-step">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </article>

            <article class="deck-log-panel reveal">
              <p class="deck-panel-label">Implementation lines</p>
              <div class="deck-line-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <div class="deck-line">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </div>
                    `
                  )
                  .join('')}
              </div>
            </article>

            <article class="deck-log-panel reveal">
              <p class="deck-panel-label">Performance notes</p>
              <ul class="deck-bullet-list">
                ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
              </ul>
            </article>
          </div>
        </section>

        <section class="deck-section deck-library" id="references">
          <div class="deck-section-head reveal">
            <div>
              <p class="deck-section-label">Signal library</p>
              <h2>研究來源、原則與 UX 線索維持可見，讓控制台不是只有表面酷感。</h2>
            </div>
            <p class="deck-section-copy">
              儀表台語言很容易滑向裝飾化科幻介面，因此 v004 直接把可信來源與 source principles 放進頁內，確保這個版本仍是可維護的 lab 成員。
            </p>
          </div>

          <div class="deck-library-grid">
            <div class="deck-signal-list">
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="deck-signal-row reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                      <i>↗</i>
                    </a>
                  `
                )
                .join('')}
            </div>

            <aside class="deck-library-side">
              <article class="deck-log-panel reveal">
                <p class="deck-panel-label">Source principles</p>
                <ul class="deck-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="deck-log-panel reveal">
                <p class="deck-panel-label">Notable UX</p>
                <ul class="deck-bullet-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v004')
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
      preset: scenePresets.instrumentDeck,
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
