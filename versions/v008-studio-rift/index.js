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
  const tickerItems = [
    manifestEntry.versionNumber,
    'Studio Rift',
    'Cold open',
    'Cast stack',
    'Breakdown fragments',
    'Exit log',
  ]

  container.innerHTML = `
    <div class="version-shell version-shell-v008">
      <div class="rift-atmosphere" aria-hidden="true">
        <div class="rift-noise"></div>
        <div class="rift-grid"></div>
        <div class="rift-glow"></div>
      </div>

      <main class="rift-page" id="version-content">
        <aside class="rift-scene-rail reveal is-visible">
          <p class="rift-code">Experimental studio interface / ${manifestEntry.versionNumber}</p>
          <nav class="rift-scene-nav" aria-label="Scene navigation">
            <a href="#top" data-nav="top">
              <span>01</span>
              <i>Open</i>
            </a>
            <a href="#experience" data-nav="experience">
              <span>02</span>
              <i>Cast</i>
            </a>
            <a href="#stack" data-nav="stack">
              <span>03</span>
              <i>Breakdown</i>
            </a>
            <a href="#references" data-nav="references">
              <span>04</span>
              <i>Exit</i>
            </a>
          </nav>

          <div class="rift-rail-links">
            <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
            <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
          </div>
        </aside>

        <section class="rift-act rift-act-open" id="top" data-section="top">
          <div class="rift-open-copy reveal is-visible">
            <p class="rift-kicker">Cold open / version ${manifestEntry.versionNumber}</p>
            <h1>
              把版本實驗室拆成
              <span>像創作工具裂開後留下的前台。</span>
            </h1>
            <p class="rift-intro">${manifestEntry.concept}</p>

            <div class="rift-actions">
              <a class="rift-button rift-button-primary" href="#experience">切到 cast stack</a>
              <a class="rift-button rift-button-secondary" href="#references">跳到 exit log</a>
            </div>

            <dl class="rift-ledger">
              <div>
                <dt>Version</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Published forms</dt>
                <dd>${stats.versionCount}</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <ul class="rift-traits">
              ${manifestEntry.keyTraits.map((trait) => `<li>${trait}</li>`).join('')}
            </ul>
          </div>

          <div class="rift-open-stage reveal is-visible">
            <div class="rift-stage-frame">
              <div class="rift-stage-grid" aria-hidden="true"></div>
              <div class="rift-slab rift-slab-a" aria-hidden="true"></div>
              <div class="rift-slab rift-slab-b" aria-hidden="true"></div>
              <div class="rift-slab rift-slab-c" aria-hidden="true"></div>
              <div class="rift-stage-line rift-stage-line-a" aria-hidden="true"></div>
              <div class="rift-stage-line rift-stage-line-b" aria-hidden="true"></div>
              <div class="rift-stage-line rift-stage-line-c" aria-hidden="true"></div>

              <div class="rift-stage-time">00 / no orbit / page-scrubbed motion</div>
              <div class="rift-stage-word rift-stage-word-main" aria-hidden="true">RIFT</div>
              <div class="rift-stage-word rift-stage-word-secondary" aria-hidden="true">STUDIO</div>
              <div class="rift-stage-word rift-stage-word-tertiary" aria-hidden="true">CUT 008</div>

              <div class="rift-stage-script">
                <p class="rift-kicker">Stage treatment</p>
                <strong>${manifestEntry.styleFamily}</strong>
                <p>${manifestEntry.sceneTreatment}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="rift-act rift-act-cast" id="experience">
          <div class="rift-act-head reveal">
            <div>
              <p class="rift-act-label">Cast stack</p>
              <h2>版本在這裡不是 tabs，而是一疊被切斜、帶時間碼的場景卡帶。</h2>
            </div>
            <p class="rift-act-copy">
              這一幕把版本切換從熟悉的 browser list 拆成戲劇化 cast stack。你看的是各版本如何進場、互相壓疊，而不是一張張規矩的 panel。
            </p>
          </div>

          <div class="rift-cast-stack">
            ${versions
              .map((version, index) => {
                const isCurrent = version.versionNumber === manifestEntry.versionNumber
                return `
                  <a class="rift-cast-strip reveal ${isCurrent ? 'is-current' : ''}" href="${version.route}">
                    <span class="rift-cast-order">${String(index + 1).padStart(2, '0')}</span>
                    <strong>${version.versionNumber} / ${version.title}</strong>
                    <p>${version.bestFor}</p>
                    <i>${isCurrent ? 'Current cut' : 'Open cut'}</i>
                  </a>
                `
              })
              .join('')}
          </div>
        </section>

        <section class="rift-act rift-act-breakdown" id="stack">
          <div class="rift-act-head reveal">
            <div>
              <p class="rift-act-label">Breakdown fragments</p>
              <h2>方法、工程與原理不再被排成安靜欄位，而是像工具 palette 一樣散落在場域裡。</h2>
            </div>
            <p class="rift-act-copy">
              這不是另一個 dashboard。v008 把實驗室的 method、implementation 與 feature emphasis 都拆成 clipped fragments，讓讀法更像 scrub timeline，而不是讀文件。
            </p>
          </div>

          <div class="rift-fragment-grid">
            <section class="rift-fragment rift-fragment-method reveal">
              <p class="rift-fragment-label">Cue fragments</p>
              ${content.methodSteps
                .map(
                  (step) => `
                    <article class="rift-fragment-item">
                      <span>${step.label}</span>
                      <strong>${step.title}</strong>
                      <p>${step.detail}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <section class="rift-fragment rift-fragment-build reveal">
              <p class="rift-fragment-label">Build fragments</p>
              ${content.implementationLines
                .map(
                  (line) => `
                    <article class="rift-fragment-item">
                      <span>${line.label}</span>
                      <strong>${line.title}</strong>
                      <p>${line.body}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <aside class="rift-fragment rift-fragment-system reveal">
              <p class="rift-fragment-label">System notes</p>
              <article class="rift-fragment-item">
                <span>Source principles</span>
                <ul class="rift-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>
              <article class="rift-fragment-item">
                <span>Notable features</span>
                <ul class="rift-bullet-list">
                  ${manifestEntry.notableFeatureIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>
              <article class="rift-fragment-item">
                <span>Performance</span>
                <ul class="rift-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="rift-act rift-act-exit" id="references">
          <div class="rift-exit-ticker" aria-hidden="true">
            <div class="rift-exit-ticker-track">
              ${[...tickerItems, ...tickerItems, ...tickerItems]
                .map((item) => `<span>${item}</span>`)
                .join('')}
            </div>
          </div>

          <div class="rift-act-head reveal">
            <div>
              <p class="rift-act-label">Exit log</p>
              <h2>最後不是平穩收尾，而是一個把 references、lineage 與 archive 原則一起吐出來的出口畫面。</h2>
            </div>
            <p class="rift-act-copy">
              實驗頁如果只在第一幕厲害，後面就會垮掉。所以 v008 的最後一幕把 source、feature lineage 與 archive rule 也做成同一套語法，不退回普通 footer。
            </p>
          </div>

          <div class="rift-exit-grid">
            <section class="rift-exit-column reveal">
              <p class="rift-fragment-label">Reference beams</p>
              ${content.referenceSignals
                .map(
                  (reference) => `
                    <a class="rift-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                      <span>${reference.name}</span>
                      <strong>${reference.description}</strong>
                    </a>
                  `
                )
                .join('')}
            </section>

            <section class="rift-exit-column reveal">
              <p class="rift-fragment-label">Feature lineage</p>
              ${content.featureTracks
                .map(
                  (track) => `
                    <article class="rift-fragment-item">
                      <span>${track.family}</span>
                      <strong>${track.name}</strong>
                      <p>${track.summary}</p>
                    </article>
                  `
                )
                .join('')}
            </section>

            <section class="rift-exit-column reveal">
              <p class="rift-fragment-label">Archive notes</p>
              ${content.archiveNotes
                .map(
                  (note) => `
                    <article class="rift-fragment-item">
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

  const root = container.querySelector('.version-shell-v008')
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

  const motionController = createRiftMotion({
    root,
    sections,
    prefersReducedMotion,
  })

  lifecycle.addEventListener(window, 'resize', uiController.handleResize)
  lifecycle.addEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
  lifecycle.addEventListener(window, 'resize', motionController.sync)
  lifecycle.addEventListener(window, 'scroll', motionController.sync, { passive: true })

  uiController.handleScroll()
  motionController.sync()

  requestAnimationFrame(() => {
    root.classList.add('is-ready')
  })

  return () => lifecycle.destroy()
}

function createRiftMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--open-progress', '0')
      root.style.setProperty('--cast-progress', '0')
      root.style.setProperty('--break-progress', '0')
      root.style.setProperty('--exit-progress', '0')
      return
    }

    root.style.setProperty('--open-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--cast-progress', getElementProgress(sections.experience).toFixed(3))
    root.style.setProperty('--break-progress', getElementProgress(sections.stack).toFixed(3))
    root.style.setProperty('--exit-progress', getElementProgress(sections.references).toFixed(3))
  }

  return {
    sync,
  }
}
