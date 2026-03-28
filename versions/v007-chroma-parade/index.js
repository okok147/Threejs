import './styles.css'
import { createLifecycle, createSectionNavController, getElementProgress, setupReveals } from '../../src/lib/page.js'

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
  const marqueeItems = [
    manifestEntry.versionNumber,
    manifestEntry.title,
    'Daylight stage',
    'Mask reveal',
    'Procession lane',
    'Afterglow archive',
  ]

  container.innerHTML = `
    <div class="version-shell version-shell-v007">
      <div class="parade-atmosphere" aria-hidden="true">
        <div class="parade-aura parade-aura-coral"></div>
        <div class="parade-aura parade-aura-lime"></div>
        <div class="parade-aura parade-aura-blue"></div>
        <div class="parade-grid"></div>
      </div>

      <header class="parade-header reveal is-visible">
        <a class="parade-brand" href="#top">
          <span class="parade-brand-mark"></span>
          <span>${content.brand} / ${manifestEntry.versionNumber}</span>
        </a>

        <nav class="parade-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">Overture</a>
          <a href="#experience" data-nav="experience">Procession</a>
          <a href="#stack" data-nav="stack">Score</a>
          <a href="#references" data-nav="references">Afterglow</a>
        </nav>

        <div class="parade-header-meta">
          <span>${manifestEntry.title}</span>
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="parade-page" id="version-content">
        <section class="parade-hero" id="top" data-section="top">
          <div class="parade-copy reveal is-visible">
            <p class="parade-kicker">Daylight performance system / version ${manifestEntry.versionNumber}</p>
            <h1>
              把版本實驗室做成一場
              <span>高彩、分層、會巡遊的網頁劇場。</span>
            </h1>
            <p class="parade-intro">${manifestEntry.concept}</p>

            <div class="parade-actions">
              <a class="parade-button parade-button-primary" href="#experience">進入 procession lane</a>
              <a class="parade-button parade-button-secondary" href="#references">打開 afterglow archive</a>
            </div>

            <dl class="parade-ledger">
              <div>
                <dt>Version</dt>
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

            <ul class="parade-traits">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </div>

          <div class="parade-stage reveal is-visible">
            <div class="parade-stage-window">
              <div class="parade-stage-grid" aria-hidden="true"></div>
              <div class="parade-stage-veil parade-stage-veil-a" aria-hidden="true"></div>
              <div class="parade-stage-veil parade-stage-veil-b" aria-hidden="true"></div>
              <div class="parade-stage-veil parade-stage-veil-c" aria-hidden="true"></div>
              <div class="parade-stage-word parade-stage-word-a" aria-hidden="true">GLARE</div>
              <div class="parade-stage-word parade-stage-word-b" aria-hidden="true">RIBBON</div>
              <div class="parade-stage-word parade-stage-word-c" aria-hidden="true">INDEX</div>

              <div class="parade-stage-badge">No orbit, all page motion</div>

              <div class="parade-stage-script">
                <p class="parade-kicker">Stage treatment</p>
                <strong>${manifestEntry.styleFamily}</strong>
                <p>${manifestEntry.sceneTreatment}</p>
              </div>
            </div>

            <div class="parade-stage-readout">
              <div>
                <span>Published forms</span>
                <strong>${stats.versionCount}</strong>
              </div>
              <div>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </div>
              <div>
                <span>Navigation</span>
                <strong>${manifestEntry.navigationModel}</strong>
              </div>
            </div>

            <div class="parade-marquee" aria-hidden="true">
              <div class="parade-marquee-track">
                ${[...marqueeItems, ...marqueeItems]
                  .map((item) => `<span>${item}</span>`)
                  .join('')}
              </div>
            </div>
          </div>
        </section>

        <section class="parade-band reveal">
          <div>
            <span>Palette</span>
            <strong>daylight chroma</strong>
          </div>
          <div>
            <span>Rhythm</span>
            <strong>curtain -> lane -> score</strong>
          </div>
          <div>
            <span>Behavior</span>
            <strong>parallax veils & marquee drift</strong>
          </div>
          <div>
            <span>Scene rule</span>
            <strong>no orbit-led centerpiece</strong>
          </div>
        </section>

        <section class="parade-section parade-procession" id="experience">
          <div class="parade-section-head reveal">
            <div>
              <p class="parade-section-label">Procession lane</p>
              <h2>版本不再是卡片牆，而是一列會從舞台側面經過的表演隊形。</h2>
            </div>
            <p class="parade-section-copy">
              這一版把切換邏輯改寫成橫向巡遊。你不是在翻 panels，而是在判斷哪一個世界值得走近，哪一個應該留在背景節奏裡。
            </p>
          </div>

          <div class="parade-lane-note reveal">
            <span>Use horizontal scroll</span>
            <p>桌機可用觸控板橫滑或 Shift + 滾輪，手機則直接左右滑動版本隊列。</p>
          </div>

          <div class="parade-lane" data-procession-lane>
            ${versions
              .map((version, index) => {
                const isCurrent = version.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="parade-route-card reveal ${isCurrent ? 'is-current' : ''}" href="${version.route}">
                    <span class="parade-route-order">${String(index + 1).padStart(2, '0')}</span>
                    <strong>${version.versionNumber}</strong>
                    <h3>${version.title}</h3>
                    <p>${version.bestFor}</p>
                    <div class="parade-route-meta">
                      <span>${version.styleFamily}</span>
                      <i>${isCurrent ? 'Current world' : 'Open world'}</i>
                    </div>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="parade-section parade-score" id="stack">
          <div class="parade-section-head reveal">
            <div>
              <p class="parade-section-label">Score sheets</p>
              <h2>把方法、工程與 art direction 排成同一份節目總譜，而不是拆成零碎模組。</h2>
            </div>
            <p class="parade-section-copy">
              Stunning 不是把動效越堆越多，而是讓每一層都知道自己在服務哪一種節奏。這版把 research、implementation 與 boundary notes 全部收進一份可讀的 score。
            </p>
          </div>

          <div class="parade-score-grid">
            <section class="parade-panel reveal">
              <p class="parade-panel-label">Cue sheet</p>
              ${content.methodSteps
                .map(
                  (step) => `
                    <article class="parade-sheet">
                      <span>${step.label}</span>
                      <strong>${step.title}</strong>
                      <p>${step.detail}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <section class="parade-panel reveal">
              <p class="parade-panel-label">Build score</p>
              ${content.implementationLines
                .map(
                  (line) => `
                    <article class="parade-sheet">
                      <span>${line.label}</span>
                      <strong>${line.title}</strong>
                      <p>${line.body}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <aside class="parade-panel reveal">
              <p class="parade-panel-label">Direction notes</p>
              <article class="parade-sheet">
                <span>Source principles</span>
                <ul class="parade-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>
              <article class="parade-sheet">
                <span>Feature emphasis</span>
                <ul class="parade-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>
              <article class="parade-sheet">
                <span>Performance</span>
                <ul class="parade-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="parade-section parade-afterglow" id="references">
          <div class="parade-section-head reveal">
            <div>
              <p class="parade-section-label">Afterglow archive</p>
              <h2>最後一段不是收尾 CTA，而是把 research lineage、references 與 archive note 一起點亮。</h2>
            </div>
            <p class="parade-section-copy">
              一個夠強的首頁不能只在首屏驚艷，還要在結尾留下方向。afterglow 把來源、版本家族與治理原則一起留在舞台上。
            </p>
          </div>

          <div class="parade-afterglow-grid">
            <section class="parade-panel reveal">
              <p class="parade-panel-label">Reference beams</p>
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="parade-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                    </a>
                  `
                )
                .join('')}
            </section>

            <section class="parade-panel reveal">
              <p class="parade-panel-label">Feature lineage</p>
              ${content.featureTracks
                .map(
                  (track) => `
                    <article class="parade-sheet">
                      <span>${track.family}</span>
                      <strong>${track.name}</strong>
                      <p>${track.summary}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <section class="parade-panel reveal">
              <p class="parade-panel-label">Archive notes</p>
              ${content.archiveNotes
                .map(
                  (note) => `
                    <article class="parade-sheet">
                      <span>${manifestEntry.versionNumber}</span>
                      <strong>${note.title}</strong>
                      <p>${note.body}</p>
                    </article>
                  `
                )
                .join('')}
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v007')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const lane = root.querySelector('[data-procession-lane]')

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 90))

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

  const motionController = createParadeMotion({
    root,
    sections,
    lane,
    prefersReducedMotion,
  })

  lifecycle.addEventListener(window, 'resize', uiController.handleResize)
  lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
  lifecycle.addEventListener(window, 'resize', motionController.sync)
  lifecycle.addEventListener(window, 'scroll', motionController.sync, { passive: true })

  if (lane) {
    lifecycle.addEventListener(lane, 'scroll', motionController.sync, { passive: true })
  }

  uiController.handleScroll()
  motionController.sync()

  requestAnimationFrame(() => {
    root.classList.add('is-ready')
  })

  return () => lifecycle.destroy()
}

function createParadeMotion({ root, sections, lane, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--hero-progress', '0')
      root.style.setProperty('--procession-progress', '0')
      root.style.setProperty('--score-progress', '0')
      root.style.setProperty('--afterglow-progress', '0')
      root.style.setProperty('--lane-progress', '0')
      return
    }

    root.style.setProperty('--hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--procession-progress', getElementProgress(sections.experience).toFixed(3))
    root.style.setProperty('--score-progress', getElementProgress(sections.stack).toFixed(3))
    root.style.setProperty('--afterglow-progress', getElementProgress(sections.references).toFixed(3))

    const laneRange = lane ? Math.max(lane.scrollWidth - lane.clientWidth, 1) : 1
    const laneProgress = lane ? lane.scrollLeft / laneRange : 0
    root.style.setProperty('--lane-progress', laneProgress.toFixed(3))
  }

  return {
    sync,
  }
}
