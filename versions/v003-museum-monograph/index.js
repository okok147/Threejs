import './styles.css'
import { createLifecycle, createSectionNavController, setupReveals } from '../../src/lib/page.js'
import { createLabScene, scenePresets } from '../../src/lib/scene.js'

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  container.innerHTML = `
    <div class="version-shell version-shell-v003">
      <canvas class="version-canvas" data-canvas aria-hidden="true"></canvas>
      <div class="monograph-frame" aria-hidden="true"></div>
      <div class="monograph-glow" aria-hidden="true"></div>
      <div class="monograph-grain" aria-hidden="true"></div>

      <header class="monograph-header reveal is-visible">
        <a class="monograph-brand" href="#top">
          <span class="monograph-brand-mark"></span>
          <span>${content.brand}</span>
        </a>

        <div class="monograph-header-meta">
          <span>Exhibit ${manifestEntry.versionNumber}</span>
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Live Site</a>
        </div>
      </header>

      <nav class="monograph-rail reveal is-visible" aria-label="頁面導覽">
        <a href="#top" data-nav="top">
          <span>00</span>
          <strong>Prelude</strong>
        </a>
        <a href="#experience" data-nav="experience">
          <span>01</span>
          <strong>Plates</strong>
        </a>
        <a href="#stack" data-nav="stack">
          <span>02</span>
          <strong>Register</strong>
        </a>
        <a href="#references" data-nav="references">
          <span>03</span>
          <strong>Study</strong>
        </a>
      </nav>

      <main class="monograph-page" id="version-content">
        <section class="monograph-hero" id="top" data-section="top">
          <div class="monograph-hero-copy reveal is-visible">
            <p class="monograph-kicker">Museum monograph / version ${manifestEntry.versionNumber}</p>
            <h1>
              <span>${content.brand}</span>
              把 three.js 版本實驗室翻成策展型作品敘事。
            </h1>
            <p class="monograph-lede">${manifestEntry.concept}</p>

            <div class="monograph-actions">
              <a class="monograph-button monograph-button-primary" href="#experience">閱讀展件註腳</a>
              <a class="monograph-button monograph-button-secondary" href="#references">查看版本牆</a>
            </div>
          </div>

          <aside class="monograph-curator-card reveal is-visible" aria-label="Curator note">
            <p class="monograph-card-label">Curator note</p>
            <h2>${manifestEntry.title}</h2>
            <p class="monograph-card-copy">${manifestEntry.styleFamily}</p>

            <dl class="monograph-definition-list">
              <div>
                <dt>Use case</dt>
                <dd>${manifestEntry.useCaseEmphasis}</dd>
              </div>
              <div>
                <dt>Distinct cue</dt>
                <dd>${manifestEntry.notableUxIdeas[0]}</dd>
              </div>
              <div>
                <dt>Registry</dt>
                <dd>${stats.versionCount} published versions</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section class="monograph-section monograph-plates" id="experience">
          <div class="monograph-section-head reveal">
            <div>
              <p class="monograph-label">Exhibition plates</p>
              <h2>把同一份內容拆成可閱讀的策展註腳，而不是重複堆疊功能卡片。</h2>
            </div>
            <p class="monograph-copy">
              這一版不把 3D 當成鋪滿全頁的 spectacle，而是當成被照明的展件；文字則像展場標牌與作品說明。
            </p>
          </div>

          <div class="monograph-plate-list">
            ${content.chapters
              .map(
                (chapter) => `
                  <article class="monograph-plate reveal">
                    <span class="monograph-plate-step">${chapter.step}</span>
                    <div class="monograph-plate-copy">
                      <h3>${chapter.title}</h3>
                      <p>${chapter.body}</p>
                    </div>
                    <p class="monograph-plate-note">${chapter.note}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="monograph-section monograph-register" id="stack">
          <div class="monograph-section-head reveal">
            <div>
              <p class="monograph-label">Specimen register</p>
              <h2>技術與互動被寫成檔案卡，讓版本 identity 與實作品質一起被保存。</h2>
            </div>
            <p class="monograph-copy">
              這一版把 implementation lines、UX 想法與 performance notes 拆成兩種閱讀層次：展件說明與館藏登錄。
            </p>
          </div>

          <div class="monograph-register-grid">
            <div class="monograph-register-sheet">
              ${content.implementationLines
                .map(
                  (line) => `
                    <article class="monograph-register-entry reveal">
                      <span>${line.label}</span>
                      <strong>${line.title}</strong>
                      <p>${line.body}</p>
                    </article>
                  `
                )
                .join('')}
            </div>

            <div class="monograph-note-stack">
              <article class="monograph-note-card reveal">
                <p class="monograph-card-label">Notable UX</p>
                <ul class="monograph-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="monograph-note-card reveal">
                <p class="monograph-card-label">Performance notes</p>
                <ul class="monograph-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section class="monograph-section monograph-study" id="references">
          <div class="monograph-section-head reveal">
            <div>
              <p class="monograph-label">Study room</p>
              <h2>研究來源與版本家族直接進頁，讓這個版本像一本可切換的展覽型索引。</h2>
            </div>
            <p class="monograph-copy">
              版本切換器仍然存在，但頁面內也直接展示 lineage，避免風格實驗只剩下外層 dock 能被看見。
            </p>
          </div>

          <div class="monograph-study-grid">
            <div class="monograph-reference-list">
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="monograph-reference reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                      <i>↗</i>
                    </a>
                  `
                )
                .join('')}
            </div>

            <aside class="monograph-version-wall reveal" aria-label="Version wall">
              <p class="monograph-card-label">Version wall</p>
              <div class="monograph-version-list">
                ${versions
                  .map(
                    (version) => `
                      <a
                        class="monograph-version-row ${version.versionNumber === manifestEntry.versionNumber ? 'is-current' : ''}"
                        href="${version.route}"
                      >
                        <span>${version.versionNumber}</span>
                        <div>
                          <strong>${version.title}</strong>
                          <p>${version.styleFamily}</p>
                        </div>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v003')
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
      preset: scenePresets.museumMonograph,
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
