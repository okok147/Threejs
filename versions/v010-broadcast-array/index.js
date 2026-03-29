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

const CHANNELS = [
  {
    code: 'CH-A',
    name: 'Prime Feed',
    tone: 'crimson',
    thesis: '品牌、世界觀與公開發表型版本。',
  },
  {
    code: 'CH-B',
    name: 'Depth Feed',
    tone: 'amber',
    thesis: '深讀、方法、策展與檔案型版本。',
  },
  {
    code: 'CH-C',
    name: 'Late Feed',
    tone: 'ice',
    thesis: '高實驗性、強節奏與語言破壞型版本。',
  },
]

export function renderVersion({ container, manifestEntry, content, versions = [], stats }) {
  const channels = buildChannels(versions)
  const activeChannel = findChannelForVersion(channels, manifestEntry.versionNumber)
  const tickerText = buildTickerText(manifestEntry, activeChannel, stats.versionCount)

  container.innerHTML = `
    <div class="version-shell version-shell-v010">
      <div class="broadcast-grid" aria-hidden="true"></div>
      <div class="broadcast-noise" aria-hidden="true"></div>
      <div class="broadcast-beam" aria-hidden="true"></div>

      <header class="broadcast-header reveal is-visible">
        <div class="broadcast-brand">
          <p class="broadcast-code">Broadcast array / ${manifestEntry.versionNumber}</p>
          <strong>${content.brand} On-Air Registry</strong>
        </div>

        <nav class="broadcast-nav" aria-label="頁面導覽">
          <a href="#top" data-nav="top">On Air</a>
          <a href="#lineup" data-nav="lineup">Lineup</a>
          <a href="#protocol" data-nav="protocol">Protocol</a>
          <a href="#credits" data-nav="credits">Credits</a>
        </nav>

        <div class="broadcast-header-links">
          <a href="${content.repoUrl}" target="_blank" rel="noreferrer">GitHub</a>
          <a href="${content.liveUrl}" target="_blank" rel="noreferrer">Hosted</a>
        </div>
      </header>

      <main class="broadcast-page" id="version-content">
        <section class="broadcast-section broadcast-hero" id="top" data-section="top">
          <div class="broadcast-copy reveal is-visible">
            <div class="broadcast-copy-head">
              <span class="broadcast-live-chip">LIVE</span>
              <span class="broadcast-channel-tag is-${activeChannel.tone}">
                ${activeChannel.code} / ${activeChannel.name}
              </span>
            </div>

            <p class="broadcast-kicker">On-air board / version ${manifestEntry.versionNumber}</p>
            <h1>
              把版本實驗室改寫成
              <span>一個正在播送的前端節目表。</span>
            </h1>
            <p class="broadcast-intro">${manifestEntry.concept}</p>

            <div class="broadcast-actions">
              <a class="broadcast-button broadcast-button-primary" href="#lineup">查看節目排程</a>
              <a class="broadcast-button broadcast-button-secondary" href="#credits">打開 closing crawl</a>
            </div>

            <dl class="broadcast-ledger">
              <div>
                <dt>Now airing</dt>
                <dd>${manifestEntry.versionNumber} / ${manifestEntry.title}</dd>
              </div>
              <div>
                <dt>Channel role</dt>
                <dd>${activeChannel.name}</dd>
              </div>
              <div>
                <dt>Release</dt>
                <dd>${RELEASE_LABELS[manifestEntry.releaseStatus] ?? manifestEntry.releaseStatus}</dd>
              </div>
            </dl>

            <div class="broadcast-copy-grid">
              <article>
                <span>Best for</span>
                <strong>${manifestEntry.bestFor}</strong>
              </article>
              <article>
                <span>Motion</span>
                <strong>${manifestEntry.motionLanguage}</strong>
              </article>
              <article>
                <span>Scene</span>
                <strong>${manifestEntry.sceneTreatment}</strong>
              </article>
            </div>
          </div>

          <div class="broadcast-stage reveal is-visible">
            <div class="broadcast-monitor">
              <div class="broadcast-monitor-head">
                <span>Studio monitor</span>
                <strong>Transmission core</strong>
                <i>${manifestEntry.styleFamily}</i>
              </div>

              <div class="broadcast-monitor-window">
                <div class="broadcast-monitor-chroma" aria-hidden="true"></div>
                <div class="broadcast-monitor-scanlines" aria-hidden="true"></div>
                <canvas class="version-canvas broadcast-canvas" data-canvas aria-hidden="true"></canvas>

                <div class="broadcast-lower-third">
                  <span>${manifestEntry.versionNumber}</span>
                  <strong>${manifestEntry.title}</strong>
                  <i>${manifestEntry.useCaseEmphasis}</i>
                </div>
              </div>
            </div>

            <div class="broadcast-cue-stack">
              ${manifestEntry.keyTraits
                .map(
                  (trait, index) => `
                    <article class="broadcast-cue-card is-${index === 0 ? activeChannel.tone : index === 1 ? 'amber' : 'ice'}">
                      <span>cue ${String(index + 1).padStart(2, '0')}</span>
                      <strong>${trait}</strong>
                    </article>
                  `
                )
                .join('')}
            </div>
          </div>

          <div class="broadcast-ticker" aria-hidden="true">
            <div class="broadcast-ticker-track">
              <span>${tickerText}</span>
              <span>${tickerText}</span>
            </div>
          </div>
        </section>

        <section class="broadcast-section broadcast-lineup" id="lineup">
          <div class="broadcast-section-head reveal">
            <div>
              <p class="broadcast-section-label">Program lineup</p>
              <h2>版本不再像平鋪卡片，而像一張有主頻道、時段與收視節奏的 rundown。</h2>
            </div>
            <p class="broadcast-section-copy">
              在這個版本裡，切換不是挑一張設計圖，而是先讀現在播什麼、下一個該切去哪個時段，再決定要進哪一種介面語言。
            </p>
          </div>

          <div class="broadcast-channel-list">
            ${channels
              .map(
                (channel) => `
                  <section class="broadcast-channel reveal is-${channel.tone}">
                    <div class="broadcast-channel-head">
                      <span>${channel.code}</span>
                      <div>
                        <strong>${channel.name}</strong>
                        <p>${channel.thesis}</p>
                      </div>
                    </div>

                    <div class="broadcast-slot-list">
                      ${channel.slots
                        .map((slot) => {
                          const isCurrent = slot.versionNumber === manifestEntry.versionNumber
                          return `
                            <a class="broadcast-slot ${isCurrent ? 'is-current' : ''}" href="${slot.route}">
                              <span class="broadcast-slot-time">${slot.time}</span>
                              <div class="broadcast-slot-copy">
                                <strong>${slot.versionNumber} / ${slot.title}</strong>
                                <p>${slot.bestFor}</p>
                                <small>${slot.styleFamily}</small>
                              </div>
                              <i>${isCurrent ? 'ON AIR' : 'QUEUE'}</i>
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
        </section>

        <section class="broadcast-section broadcast-protocol" id="protocol">
          <div class="broadcast-section-head reveal">
            <div>
              <p class="broadcast-section-label">Signal standards</p>
              <h2>方法、實作與可讀性被改寫成播控規程，而不是躲在 repo 角落的附錄。</h2>
            </div>
            <p class="broadcast-section-copy">
              這裡把研究、生成、註冊與效能翻成 cue stack、standard sheet 與 guardrail notes，讓 broadcast 語言從首屏一路延續到工程細節。
            </p>
          </div>

          <div class="broadcast-protocol-grid">
            <section class="broadcast-sheet reveal">
              <p class="broadcast-panel-label">Cue stack</p>
              <div class="broadcast-row-list">
                ${content.methodSteps
                  .map(
                    (step) => `
                      <article class="broadcast-row">
                        <span>${step.label}</span>
                        <strong>${step.title}</strong>
                        <p>${step.detail}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="broadcast-sheet reveal">
              <p class="broadcast-panel-label">Standard sheet</p>
              <div class="broadcast-row-list">
                ${content.implementationLines
                  .map(
                    (line) => `
                      <article class="broadcast-row">
                        <span>${line.label}</span>
                        <strong>${line.title}</strong>
                        <p>${line.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <aside class="broadcast-notes">
              <article class="broadcast-note reveal">
                <p class="broadcast-panel-label">Source principles</p>
                <ul class="broadcast-bullet-list">
                  ${manifestEntry.sourcePrinciples.map((principle) => `<li>${principle}</li>`).join('')}
                </ul>
              </article>

              <article class="broadcast-note reveal">
                <p class="broadcast-panel-label">UX emphasis</p>
                <ul class="broadcast-bullet-list">
                  ${manifestEntry.notableUxIdeas.map((idea) => `<li>${idea}</li>`).join('')}
                </ul>
              </article>

              <article class="broadcast-note reveal">
                <p class="broadcast-panel-label">Performance</p>
                <ul class="broadcast-bullet-list">
                  ${manifestEntry.performanceNotes.map((note) => `<li>${note}</li>`).join('')}
                </ul>
              </article>
            </aside>
          </div>
        </section>

        <section class="broadcast-section broadcast-credits" id="credits">
          <div class="broadcast-section-head reveal">
            <div>
              <p class="broadcast-section-label">Closing crawl</p>
              <h2>片尾不是收尾，而是把參考來源、版本譜系與 archive note 一次滾到前景。</h2>
            </div>
            <p class="broadcast-section-copy">
              broadcast 介面最後要留下可信的 credits。這裡把 reference links、archive principles 與 consulted families 都做成可讀的 closing crawl，而不是一句「更多見 README」。
            </p>
          </div>

          <div class="broadcast-credits-grid">
            <section class="broadcast-credit-wall reveal">
              <p class="broadcast-panel-label">Reference feed</p>
              <div class="broadcast-reference-list">
                ${content.referenceSignals
                  .map(
                    (reference) => `
                      <a class="broadcast-reference" href="${reference.url}" target="_blank" rel="noreferrer">
                        <span>${reference.name}</span>
                        <strong>${reference.description}</strong>
                        <i>↗</i>
                      </a>
                    `
                  )
                  .join('')}
              </div>
            </section>

            <section class="broadcast-credit-wall reveal">
              <p class="broadcast-panel-label">Archive crawl</p>
              <div class="broadcast-archive-list">
                ${content.archiveNotes
                  .map(
                    (note) => `
                      <article class="broadcast-archive-card">
                        <span>${manifestEntry.versionNumber}</span>
                        <strong>${note.title}</strong>
                        <p>${note.body}</p>
                      </article>
                    `
                  )
                  .join('')}
              </div>

              <div class="broadcast-family-strip">
                ${manifestEntry.sourceFamiliesConsulted.map((family) => `<span>${family}</span>`).join('')}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  `

  const root = container.querySelector('.version-shell-v010')
  const lifecycle = createLifecycle()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    root.classList.add('is-reduced-motion')
  }

  lifecycle.addCleanup(setupReveals([...root.querySelectorAll('.reveal:not(.is-visible)')], prefersReducedMotion, 80))

  const sections = {
    top: root.querySelector('[data-section="top"]'),
    lineup: root.querySelector('#lineup'),
    protocol: root.querySelector('#protocol'),
    credits: root.querySelector('#credits'),
  }

  const uiController = createSectionNavController({
    navLinks: [...root.querySelectorAll('[data-nav]')],
    sections,
  })

  const motionController = createBroadcastMotion({
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
        lineup: sections.lineup,
        protocol: sections.protocol,
        credits: sections.credits,
      },
      preset: scenePresets.broadcastArray,
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

function createBroadcastMotion({ root, sections, prefersReducedMotion }) {
  function sync() {
    if (prefersReducedMotion) {
      root.style.setProperty('--hero-progress', '0')
      root.style.setProperty('--lineup-progress', '0')
      root.style.setProperty('--protocol-progress', '0')
      root.style.setProperty('--credits-progress', '0')
      return
    }

    root.style.setProperty('--hero-progress', getElementProgress(sections.top).toFixed(3))
    root.style.setProperty('--lineup-progress', getElementProgress(sections.lineup).toFixed(3))
    root.style.setProperty('--protocol-progress', getElementProgress(sections.protocol).toFixed(3))
    root.style.setProperty('--credits-progress', getElementProgress(sections.credits).toFixed(3))
  }

  return {
    sync,
  }
}

function buildChannels(versions) {
  const chunkSize = Math.max(1, Math.ceil(versions.length / CHANNELS.length))

  return CHANNELS.map((channel, channelIndex) => ({
    ...channel,
    slots: versions
      .slice(channelIndex * chunkSize, (channelIndex + 1) * chunkSize)
      .map((version, slotIndex) => ({
        ...version,
        time: formatBroadcastTime(channelIndex, slotIndex),
      })),
  })).filter((channel) => channel.slots.length)
}

function findChannelForVersion(channels, versionNumber) {
  return channels.find((channel) => channel.slots.some((slot) => slot.versionNumber === versionNumber)) ?? channels[0]
}

function formatBroadcastTime(channelIndex, slotIndex) {
  const totalMinutes = 19 * 60 + channelIndex * 9 + slotIndex * 13
  const hours = Math.floor(totalMinutes / 60) % 24
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

function buildTickerText(manifestEntry, activeChannel, versionCount) {
  const traits = manifestEntry.keyTraits.join(' / ')
  return `${manifestEntry.versionNumber} ${manifestEntry.title}  •  ${activeChannel.name}  •  ${traits}  •  ${versionCount} registered versions  •  ${manifestEntry.bestFor}`
}
