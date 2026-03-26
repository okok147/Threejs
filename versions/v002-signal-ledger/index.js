import './styles.css'
import { createLifecycle, createSectionNavController, setupReveals } from '../../src/lib/page.js'
import { createLabScene, scenePresets } from '../../src/lib/scene.js'

export function renderVersion({ container, manifestEntry, content }) {
  container.innerHTML = `
    <div class="version-shell version-shell-v002">
      <canvas class="version-canvas" data-canvas aria-hidden="true"></canvas>
      <div class="ledger-film" aria-hidden="true"></div>
      <div class="ledger-grid" aria-hidden="true"></div>

      <header class="ledger-header reveal is-visible">
        <div class="ledger-brand-block">
          <p class="ledger-issue">Issue ${manifestEntry.versionNumber}</p>
          <a class="ledger-brand" href="#top">${manifestEntry.title}</a>
        </div>

        <nav class="ledger-nav" aria-label="頁面導覽">
          <a href="#experience" data-nav="experience">Collection</a>
          <a href="#stack" data-nav="stack">Method</a>
          <a href="#references" data-nav="references">Archive</a>
        </nav>

        <a class="ledger-link" href="${content.liveUrl}" target="_blank" rel="noreferrer">
          Live Site
        </a>
      </header>

      <main class="ledger-page" id="version-content">
        <section class="ledger-hero" id="top" data-section="top">
          <div class="ledger-hero-copy reveal is-visible">
            <p class="ledger-kicker">Three.js editorial atlas / version ${manifestEntry.versionNumber}</p>
            <h1>${content.brand} 把作品集做成能翻閱的訊號帳冊。</h1>
            <p class="ledger-intro">${manifestEntry.concept}</p>

            <div class="ledger-actions">
              <a class="ledger-button ledger-button-primary" href="#experience">查看版本條目</a>
              <a class="ledger-button ledger-button-secondary" href="${content.repoUrl}" target="_blank" rel="noreferrer">
                檢視原始碼
              </a>
            </div>
          </div>

          <aside class="ledger-aside reveal is-visible" aria-label="Issue notes">
            <p class="ledger-aside-label">Issue notes</p>

            <div class="ledger-note">
              <span>Style family</span>
              <p>${manifestEntry.styleFamily}</p>
            </div>

            <div class="ledger-note">
              <span>Use case</span>
              <p>${manifestEntry.useCaseEmphasis}</p>
            </div>

            <div class="ledger-note">
              <span>Notable UX</span>
              <p>${manifestEntry.notableUxIdeas[0]}</p>
            </div>
          </aside>
        </section>

        <section class="ledger-section ledger-collection" id="experience">
          <div class="ledger-section-head reveal">
            <div>
              <p class="ledger-label">Collection</p>
              <h2>一個版本對應一種閱讀情境，而不是同一頁裡混雜所有語言。</h2>
            </div>
            <p class="ledger-copy">
              這一版把風格差異變成可掃描的條目，讓使用者能從版本號、風格家族與使用情境直接理解差異。
            </p>
          </div>

          <div class="ledger-track-list">
            ${content.featureTracks
              .map(
                (track, index) => `
                  <article class="ledger-track reveal">
                    <span class="ledger-track-index">${String(index + 1).padStart(2, '0')}</span>
                    <div class="ledger-track-copy">
                      <h3>${track.name}</h3>
                      <p>${track.summary}</p>
                    </div>
                    <div class="ledger-track-meta">
                      <strong>${track.family}</strong>
                      <span>${track.fit}</span>
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="ledger-section ledger-method" id="stack">
          <div class="ledger-method-layout">
            <div class="ledger-method-intro reveal">
              <p class="ledger-label">Method</p>
              <h2>這不是新造型而已，而是風格演化流程。</h2>
              <p class="ledger-copy">
                每個版本都會留下 manifest、tokens、研究輸出與快照，避免風格探索退化成一次性的主觀改稿。
              </p>
            </div>

            <div class="ledger-method-steps">
              ${content.methodSteps
                .map(
                  (step) => `
                    <article class="ledger-step reveal">
                      <span>${step.label}</span>
                      <strong>${step.title}</strong>
                      <p>${step.detail}</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="ledger-section ledger-archive" id="references">
          <div class="ledger-section-head reveal">
            <div>
              <p class="ledger-label">Archive</p>
              <h2>把研究來源與版本治理一起放進前台。</h2>
            </div>
            <p class="ledger-copy">
              v002 把頁內導覽、研究來源與版本規則一起變成閱讀內容，讓作品集同時也是方法論文件。
            </p>
          </div>

          <div class="ledger-archive-grid">
            <div class="ledger-archive-notes">
              ${content.archiveNotes
                .map(
                  (note) => `
                    <article class="ledger-archive-note reveal">
                      <h3>${note.title}</h3>
                      <p>${note.body}</p>
                    </article>
                  `
                )
                .join('')}
            </div>

            <div class="ledger-reference-list">
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="ledger-reference reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                      <i>↗</i>
                    </a>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v002')
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
      preset: scenePresets.signalLedger,
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
