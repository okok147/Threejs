import './styles.css'
import { createLifecycle, createSectionNavController, setupReveals } from '../../src/lib/page.js'
import { createLabScene, scenePresets } from '../../src/lib/scene.js'

export function renderVersion({ container, manifestEntry, content, stats }) {
  container.innerHTML = `
    <div class="version-shell version-shell-v001">
      <canvas class="version-canvas" data-canvas aria-hidden="true"></canvas>
      <div class="orbit-ambient orbit-ambient-left" aria-hidden="true"></div>
      <div class="orbit-ambient orbit-ambient-right" aria-hidden="true"></div>
      <div class="orbit-noise" aria-hidden="true"></div>

      <header class="orbit-header reveal is-visible">
        <a class="orbit-brand" href="#top">
          <span class="orbit-mark"></span>
          <span>${content.brand}</span>
        </a>

        <nav class="orbit-nav" aria-label="頁面導覽">
          <a href="#experience" data-nav="experience">Orbit</a>
          <a href="#stack" data-nav="stack">System</a>
          <a href="#references" data-nav="references">Archive</a>
        </nav>

        <a class="orbit-link" href="${content.repoUrl}" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </header>

      <main class="orbit-page" id="version-content">
        <section class="orbit-hero" id="top" data-section="top">
          <div class="orbit-gridlines" aria-hidden="true"></div>

          <div class="orbit-hero-inner">
            <div class="orbit-copy reveal is-visible">
              <p class="orbit-eyebrow">Version ${manifestEntry.versionNumber} / ${manifestEntry.title}</p>
              <h1>
                <span>${content.brand}</span>
                把 three.js 品牌首頁做成可閱讀、可部署、可留檔的 cinematic 基線。
              </h1>
              <p class="orbit-lede">${manifestEntry.concept}</p>

              <div class="orbit-actions">
                <a class="orbit-button orbit-button-primary" href="#experience">閱讀章節</a>
                <a class="orbit-button orbit-button-secondary" href="${content.liveUrl}" target="_blank" rel="noreferrer">
                  打開 Live Site
                </a>
              </div>
            </div>

            <aside class="orbit-aside reveal is-visible" aria-label="Source principles">
              <p class="orbit-meta-title">Source Principles</p>

              ${content.storySignals
                .map(
                  (signal) => `
                    <div class="orbit-signal">
                      <span>${signal.name}</span>
                      <p>${signal.detail}</p>
                    </div>
                  `
                )
                .join('')}
            </aside>
          </div>

          <div class="orbit-hero-footer reveal is-visible">
            <div class="orbit-rail">
              <span>${manifestEntry.styleFamily}</span>
              <span>${manifestEntry.useCaseEmphasis}</span>
              <span>${stats.versionCount} published versions</span>
            </div>

            <a class="orbit-scroll-cue" href="#experience">
              <span></span>
              向下滾動
            </a>
          </div>
        </section>

        <section class="orbit-section orbit-story" id="experience">
          <div class="orbit-section-head reveal">
            <div>
              <p class="orbit-section-label">Scroll Narrative</p>
              <h2>用單一核心物件，帶著整頁文字穿過三個閱讀狀態。</h2>
            </div>
            <p class="orbit-section-copy">
              這一版的目的不是把功能全部擠進首頁，而是先建立一個世界觀型首頁的敘事母板。
            </p>
          </div>

          <div class="orbit-chapter-list">
            ${content.chapters
              .map(
                (chapter) => `
                  <article class="orbit-chapter reveal">
                    <span class="orbit-chapter-step">${chapter.step}</span>
                    <div class="orbit-chapter-copy">
                      <h3>${chapter.title}</h3>
                      <p>${chapter.body}</p>
                    </div>
                    <p class="orbit-chapter-note">${chapter.note}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="orbit-section orbit-system" id="stack">
          <div class="orbit-system-layout">
            <div class="orbit-system-copy reveal">
              <p class="orbit-section-label">Implementation Stack</p>
              <h2>風格重，但技術結構刻意保持薄。</h2>
              <p class="orbit-section-copy">
                這一版保留最小可控的前端結構，確保這個 cinematic 版本會成為之後所有版本的穩定起點。
              </p>

              <div class="orbit-metrics reveal">
                <div class="orbit-metric">
                  <strong>${stats.versionCount}</strong>
                  <span>registered versions</span>
                </div>
                <div class="orbit-metric">
                  <strong>1</strong>
                  <span>shared content layer</span>
                </div>
                <div class="orbit-metric">
                  <strong>3D</strong>
                  <span>scene preset system</span>
                </div>
              </div>
            </div>

            <div class="orbit-system-lines">
              ${content.implementationLines
                .map(
                  (line) => `
                    <article class="orbit-line-item reveal">
                      <span>${line.label}</span>
                      <strong>${line.title}</strong>
                      <p>${line.body}</p>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>
        </section>

        <section class="orbit-section orbit-reference" id="references">
          <div class="orbit-section-head reveal">
            <div>
              <p class="orbit-section-label">Research Archive</p>
              <h2>不是照抄成品站，而是把可信來源抽成可重用原理。</h2>
            </div>
            <p class="orbit-section-copy">
              從這一輪開始，研究來源、風格論點與版本資訊都會直接進入 lab registry，而不是留在腦中。
            </p>
          </div>

          <div class="orbit-reference-list">
            ${content.referenceSignals
              .map(
                (reference) => `
                  <a class="orbit-reference-row reveal" href="${reference.url}" target="_blank" rel="noreferrer">
                    <span>${reference.name}</span>
                    <div>
                      <strong>${reference.description}</strong>
                      <p>這個版本把它轉譯成排版節奏、頁內導覽與場景尺寸控制。</p>
                    </div>
                    <i>↗</i>
                  </a>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="orbit-closing reveal">
          <p class="orbit-section-label">Archive Status</p>
          <h2>v001 已被註冊成不可覆蓋的品牌敘事基線。</h2>
          <p class="orbit-section-copy">
            後續版本可以完全翻轉排版、色彩與互動，但不會再把這一版直接蓋掉。
          </p>

          <div class="orbit-actions">
            <a class="orbit-button orbit-button-primary" href="${content.repoUrl}" target="_blank" rel="noreferrer">
              打開 GitHub
            </a>
            <a class="orbit-button orbit-button-secondary" href="${content.liveUrl}" target="_blank" rel="noreferrer">
              查看 Live Site
            </a>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v001')
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
    chapterItems: [...root.querySelectorAll('.orbit-chapter')],
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
