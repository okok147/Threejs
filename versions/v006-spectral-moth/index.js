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
    <div class="version-shell version-shell-v006">
      <div class="moth-noise" aria-hidden="true"></div>
      <div class="moth-dot-grid" aria-hidden="true"></div>
      <div class="moth-vignette" aria-hidden="true"></div>

      <header class="moth-header reveal is-visible">
        <a class="moth-brand" href="#top">
          <span class="moth-brand-mark"></span>
          <span>${content.brand} / ${manifestEntry.versionNumber}</span>
        </a>

        <nav class="moth-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Specimen</a>
          <a href="#experience" data-nav="experience">Pack</a>
          <a href="#stack" data-nav="stack">Decay</a>
          <a href="#references" data-nav="references">Field</a>
        </nav>

        <div class="moth-header-meta">
          <span>${manifestEntry.title}</span>
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="moth-page" id="version-content">
        <section class="moth-hero" id="top" data-section="top">
          <div class="moth-copy reveal is-visible">
            <p class="moth-kicker">Monochrome glitch fauna / version ${manifestEntry.versionNumber}</p>
            <h1>
              讓版本實驗室變成一隻
              <span>在像素裡形成又崩解的夜蛾。</span>
            </h1>
            <p class="moth-intro">${manifestEntry.concept}</p>

            <div class="moth-actions">
              <a class="moth-button moth-button-primary" href="#experience">掃描版本殘影</a>
              <a class="moth-button moth-button-secondary" href="#references">打開 white-noise field</a>
            </div>

            <dl class="moth-ledger">
              <div>
                <dt>Specimen</dt>
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

            <ul class="moth-traits">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </div>

          <div class="moth-stage reveal is-visible">
            <div class="moth-stage-frame">
              <div class="moth-stage-grid" aria-hidden="true"></div>
              <div class="moth-stage-fragments moth-stage-fragments-left" aria-hidden="true"></div>
              <div class="moth-stage-fragments moth-stage-fragments-right" aria-hidden="true"></div>
              <canvas class="version-canvas moth-canvas" data-canvas aria-hidden="true"></canvas>

              <div class="moth-stage-caption">
                <p class="moth-kicker">Signal animal</p>
                <strong>${manifestEntry.styleFamily}</strong>
                <p>${manifestEntry.sceneTreatment}</p>
              </div>
            </div>

            <div class="moth-stage-readout">
              <div>
                <span>Published forms</span>
                <strong>${stats.versionCount}</strong>
              </div>
              <div>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </div>
              <div>
                <span>Route logic</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </div>
            </div>
          </div>
        </section>

        <section class="moth-band reveal">
          <div>
            <span>Specimen code</span>
            <strong>${manifestEntry.versionNumber}</strong>
          </div>
          <div>
            <span>Species</span>
            <strong>Spectral moth</strong>
          </div>
          <div>
            <span>Signal state</span>
            <strong>forming / dispersing</strong>
          </div>
          <div>
            <span>Theme</span>
            <strong>${manifestEntry.useCaseEmphasis}</strong>
          </div>
        </section>

        <section class="moth-section moth-pack" id="experience">
          <div class="moth-section-head reveal">
            <div>
              <p class="moth-section-label">Pack index</p>
              <h2>每個版本都像一種不同物種的殘影，被同一條白噪掃描線橫切。</h2>
            </div>
            <p class="moth-section-copy">
              v006 不再用 atlas、展櫃或控制台閱讀版本，而是把它們壓成高對比 strips；你先感受 silhouette，再判斷要不要靠近細節。
            </p>
          </div>

          <div class="moth-route-stack">
            ${versions
              .map((version, index) => {
                const isCurrent = version.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="moth-route-strip reveal ${isCurrent ? 'is-current' : ''}" href="${version.route}">
                    <span class="moth-route-order">${String(index + 1).padStart(2, '0')}</span>
                    <strong>${version.versionNumber} / ${version.title}</strong>
                    <p>${version.bestFor}</p>
                    <i>${isCurrent ? 'Current specimen' : 'Open specimen'}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="moth-section moth-decay" id="stack">
          <div class="moth-section-head reveal">
            <div>
              <p class="moth-section-label">Decay log</p>
              <h2>方法、實作與 UX 被拆成 field strips，像訊號腐蝕留下的記錄帶。</h2>
            </div>
            <p class="moth-section-copy">
              這一版保留同一份資料，但把閱讀節奏換成黑白 field log：左邊看生成流程，中間看實作線，右側則是 source principle 與性能邊界。
            </p>
          </div>

          <div class="moth-log-grid">
            <section class="moth-column reveal">
              <p class="moth-column-label">Formation</p>
              ${content.methodSteps
                .map(
                  (step) => `
                    <article class="moth-strip">
                      <span>${step.label}</span>
                      <strong>${step.title}</strong>
                      <p>${step.detail}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <section class="moth-column reveal">
              <p class="moth-column-label">Build lines</p>
              ${content.implementationLines
                .map(
                  (line) => `
                    <article class="moth-strip">
                      <span>${line.label}</span>
                      <strong>${line.title}</strong>
                      <p>${line.body}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <aside class="moth-column reveal">
              <p class="moth-column-label">Boundary notes</p>
              <article class="moth-strip">
                <span>Source principles</span>
                <ul class="moth-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>
              <article class="moth-strip">
                <span>Notable UX</span>
                <ul class="moth-bullet-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>
              <article class="moth-strip">
                <span>Performance</span>
                <ul class="moth-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="moth-section moth-field" id="references">
          <div class="moth-section-head reveal">
            <div>
              <p class="moth-section-label">White-noise field</p>
              <h2>參考來源與版本家族在最後被壓成一片訊號場，不讓頁面只剩海報感。</h2>
            </div>
            <p class="moth-section-copy">
              主視覺再強，研究與 lineage 還是要可追蹤；所以最後一段不是 CTA 大卡，而是一組 references、feature tracks 與 archive note 的噪訊索引。
            </p>
          </div>

          <div class="moth-field-grid">
            <div class="moth-reference-list">
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="moth-reference reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                    </a>
                  `
                )
                .join('')}
            </div>

            <div class="moth-archive-stack">
              <section class="moth-column reveal">
                <p class="moth-column-label">Feature lineage</p>
                ${content.featureTracks
                  .map(
                    (track) => `
                      <article class="moth-strip">
                        <span>${track.family}</span>
                        <strong>${track.name}</strong>
                        <p>${track.summary}</p>
                      </article>
                    `
                  )
                  .join('')}
              </section>

              <section class="moth-column reveal">
                <p class="moth-column-label">Recovery notes</p>
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="moth-strip">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v006')
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
      preset: scenePresets.spectralMoth,
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
