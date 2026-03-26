import './style.css'
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Clock,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  FogExp2,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PMREMGenerator,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  RingGeometry,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const repoUrl = 'https://github.com/okok147/Threejs'
const referenceUrls = {
  blueyard: 'https://www.awwwards.com/sites/blueyard',
  igloo: 'https://www.awwwards.com/igloo-inc-case-study.html',
  starAtlas: 'https://www.awwwards.com/sites/star-atlas',
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

document.querySelector('#app').innerHTML = `
  <div class="site-shell">
    <canvas class="webgl" data-canvas aria-hidden="true"></canvas>
    <div class="ambient ambient-left" aria-hidden="true"></div>
    <div class="ambient ambient-right" aria-hidden="true"></div>
    <div class="noise" aria-hidden="true"></div>

    <header class="site-header reveal is-visible">
      <a class="brand" href="#top">
        <span class="brand-mark"></span>
        <span>光軌</span>
      </a>

      <nav class="site-nav" aria-label="頁面導覽">
        <a href="#experience" data-nav="experience">Experience</a>
        <a href="#stack" data-nav="stack">Stack</a>
        <a href="#references" data-nav="references">References</a>
      </nav>

      <a class="header-link" href="${repoUrl}" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </header>

    <main class="page" id="top">
      <section class="hero">
        <div class="hero-gridlines" aria-hidden="true"></div>

        <div class="hero-inner">
          <div class="hero-copy reveal is-visible">
            <p class="eyebrow">Three.js cinematic landing page / 2026 reference build</p>
            <h1>
              <span>光軌</span>
              把 three.js 首頁做成可讀、可記住、可上線的敘事場景。
            </h1>
            <p class="lede">
              這一版不是單純把 WebGL 放進 hero，而是把 BlueYard、Igloo Inc、
              Star Atlas 這類得獎站常用的畫面語言，翻譯成一個乾淨、節制、可部署的單頁體驗。
            </p>

            <div class="actions">
              <a class="button button-primary" href="#experience">進入體驗</a>
              <a class="button button-secondary" href="${repoUrl}" target="_blank" rel="noreferrer">
                檢視原始碼
              </a>
            </div>
          </div>

          <aside class="hero-aside reveal is-visible" aria-label="Reference DNA">
            <p class="meta-title">Reference DNA</p>

            <div class="signal">
              <span>BlueYard</span>
              <p>取它的軌道感、宇宙導覽感與克制配色。</p>
            </div>

            <div class="signal">
              <span>Igloo Inc</span>
              <p>取它的滾動敘事節奏與場景先行的資訊編排。</p>
            </div>

            <div class="signal">
              <span>Star Atlas</span>
              <p>取它的世界觀氣氛與高對比 cinematic 首屏。</p>
            </div>
          </aside>
        </div>

        <div class="hero-footer reveal is-visible">
          <div class="hero-rail">
            <span>Poster-first hero</span>
            <span>Scroll-driven scene shift</span>
            <span>Restrained stack narrative</span>
          </div>

          <a class="scroll-cue" href="#experience">
            <span></span>
            向下滾動
          </a>
        </div>
      </section>

      <section class="story section" id="experience" data-section="experience">
        <div class="section-head story-head reveal">
          <div>
            <p class="section-label">Scroll Narrative</p>
            <h2>同一顆核心物件，隨著頁面進度切換三種閱讀狀態。</h2>
          </div>
          <p class="section-copy">
            這裡不靠切頁轉場，而是讓文字、鏡頭與光環一起移動。讀者會感覺自己正在穿過一個有方向感的介面，而不是翻一份靜態簡報。
          </p>
        </div>

        <div class="chapter-list">
          <article class="chapter reveal is-current" data-chapter="0">
            <span class="chapter-step">01 / ORBIT</span>
            <div class="chapter-copy">
              <h3>先把品牌做成海報，而不是功能清單。</h3>
              <p>
                第一屏只做一件事：讓品牌名稱、光軌主體與行動按鈕在同一個視覺節奏裡成立。
              </p>
            </div>
            <p class="chapter-note">大字品牌、窄文案欄、低噪音背景。</p>
          </article>

          <article class="chapter reveal" data-chapter="1">
            <span class="chapter-step">02 / DRIFT</span>
            <div class="chapter-copy">
              <h3>讓滾動變成鏡頭指令，而不是只推動內容往下。</h3>
              <p>
                中段開始，場景的光環、軌跡與相機會慢慢偏移，形成像案例影片一樣的運鏡感。
              </p>
            </div>
            <p class="chapter-note">場景位移、字幕跟隨、段落依序接管注意力。</p>
          </article>

          <article class="chapter reveal" data-chapter="2">
            <span class="chapter-step">03 / DEPLOY</span>
            <div class="chapter-copy">
              <h3>最後把創意收束成一個真的能上線的 repo。</h3>
              <p>
                體驗感做夠之後，落點要清楚，所以最後一段只保留 stack、參考來源與可部署狀態。
              </p>
            </div>
            <p class="chapter-note">不是炫技展示，而是能繼續迭代的起點。</p>
          </article>
        </div>
      </section>

      <section class="system section" id="stack" data-section="stack">
        <div class="system-layout">
          <div class="system-copy reveal">
            <p class="section-label">Implementation Stack</p>
            <h2>畫面像得獎站，但技術結構刻意保持薄。</h2>
            <p class="section-copy">
              我沒有直接把整套 stack 換成更重的框架，而是保留目前這個 repo 最適合的組合，讓 three.js 場景、文案層與部署流程全部維持可控。
            </p>

            <div class="metric-strip reveal">
              <div class="metric">
                <strong>3</strong>
                <span>scroll phases</span>
              </div>
              <div class="metric">
                <strong>1</strong>
                <span>scene core</span>
              </div>
              <div class="metric">
                <strong>auto</strong>
                <span>GitHub deploy</span>
              </div>
            </div>
          </div>

          <div class="system-lines">
            <article class="line-item reveal">
              <span>Scene Core</span>
              <strong>Three.js + 自訂幾何軌跡 + 粒子場</strong>
              <p>用單一核心物件、軌道、粒子帶與光環把畫面做厚，而不是用一堆模型撐滿場景。</p>
            </article>

            <article class="line-item reveal">
              <span>Page Layer</span>
              <strong>原生 HTML + CSS，讓版面保持高控制度</strong>
              <p>文字層不依賴 UI 框架，版面能更直接貼合 three.js 場景和 scroll 節奏。</p>
            </article>

            <article class="line-item reveal">
              <span>Delivery</span>
              <strong>Vite 建置，GitHub Actions 發佈 GitHub Pages</strong>
              <p>從本地開發到上線都留在同一個 repo 裡，不需要額外平台或 CMS 才能展示成品。</p>
            </article>
          </div>
        </div>
      </section>

      <section class="reference section" id="references" data-section="references">
        <div class="section-head reveal">
          <div>
            <p class="section-label">Reference Translation</p>
            <h2>不是照抄得獎站，而是抽出它們真正有效的骨架。</h2>
          </div>
          <p class="section-copy">
            這三個 reference 我都保留了原始連結，方便你之後繼續對照。這一版實作採的是它們的結構邏輯，不是複製視覺表層。
          </p>
        </div>

        <div class="reference-list">
          <a class="reference-row reveal" href="${referenceUrls.blueyard}" target="_blank" rel="noreferrer">
            <span>BlueYard</span>
            <div>
              <strong>把 3D 當成導覽系統，而不是背景動畫。</strong>
              <p>我把這種「軌道式資訊架構」轉成現在首頁的 hero 世界觀和中段章節節奏。</p>
            </div>
            <i>↗</i>
          </a>

          <a class="reference-row reveal" href="${referenceUrls.igloo}" target="_blank" rel="noreferrer">
            <span>Igloo Inc</span>
            <div>
              <strong>用滾動推動場景敘事，讓每一段都有鏡頭感。</strong>
              <p>我把這種敘事方式壓縮成更輕量的 scroll phases，保留戲劇性但不把專案做得過重。</p>
            </div>
            <i>↗</i>
          </a>

          <a class="reference-row reveal" href="${referenceUrls.starAtlas}" target="_blank" rel="noreferrer">
            <span>Star Atlas</span>
            <div>
              <strong>強世界觀、強對比、強第一印象。</strong>
              <p>我借的是它的氣氛密度與文案口吻，不是複製遊戲式 UI 元件。</p>
            </div>
            <i>↗</i>
          </a>
        </div>
      </section>

      <section class="closing section reveal">
        <p class="section-label">Ready To Ship</p>
        <h2>這個版本已經把參考研究、視覺翻譯、前端實作與部署串成同一條流程。</h2>
        <p class="section-copy">
          你現在拿到的不是 moodboard，而是一個已上線的起點。後面如果要換成品牌官網、產品發表頁或作品集，只要換文案與場景方向即可。
        </p>

        <div class="actions">
          <a class="button button-primary" href="${repoUrl}" target="_blank" rel="noreferrer">
            打開 GitHub
          </a>
          <a class="button button-secondary" href="https://okok147.github.io/Threejs/" target="_blank" rel="noreferrer">
            查看 Live Site
          </a>
        </div>
      </section>
    </main>
  </div>
`

const revealItems = [...document.querySelectorAll('.reveal:not(.is-visible)')]
const canvas = document.querySelector('[data-canvas]')
const chapterItems = [...document.querySelectorAll('.chapter')]
const navLinks = [...document.querySelectorAll('[data-nav]')]
const sections = {
  experience: document.querySelector('#experience'),
  stack: document.querySelector('#stack'),
  references: document.querySelector('#references'),
}

const revealCleanup = setupReveals(revealItems, reducedMotion)
const uiController = createUiController({ chapterItems, navLinks, sections })
const cleanups = [revealCleanup]

function addManagedEventListener(target, type, handler, options) {
  target.addEventListener(type, handler, options)
  cleanups.push(() => target.removeEventListener(type, handler, options))
}

if (canvas) {
  const sceneController = createScene(canvas, reducedMotion, sections)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      sceneController.stop()
      return
    }

    sceneController.start()
  }

  cleanups.push(() => sceneController.destroy())

  addManagedEventListener(window, 'resize', sceneController.handleResize)
  addManagedEventListener(window, 'resize', uiController.handleResize)
  addManagedEventListener(window, 'pointermove', sceneController.handlePointerMove, {
    passive: true,
  })
  addManagedEventListener(window, 'scroll', sceneController.handleScroll, { passive: true })
  addManagedEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
  addManagedEventListener(document, 'visibilitychange', handleVisibilityChange)

  sceneController.handleResize()
  sceneController.handleScroll()

  if (!document.hidden) {
    sceneController.start()
  }
} else {
  addManagedEventListener(window, 'resize', uiController.handleResize)
  addManagedEventListener(window, 'scroll', uiController.handleScroll, { passive: true })
}

uiController.handleScroll()

window.addEventListener(
  'pagehide',
  () => {
    while (cleanups.length) {
      const cleanup = cleanups.pop()
      cleanup?.()
    }
  },
  { once: true }
)

requestAnimationFrame(() => {
  document.body.classList.add('is-ready')
})

function setupReveals(elements, prefersReducedMotion) {
  if (prefersReducedMotion) {
    elements.forEach((element) => element.classList.add('is-visible'))
    return () => {}
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.18 }
  )

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${index * 80}ms`)
    observer.observe(element)
  })

  return () => observer.disconnect()
}

function createUiController({ chapterItems: items, navLinks: links, sections: trackedSections }) {
  const sectionOrder = ['experience', 'stack', 'references']

  function handleScroll() {
    const activeSection = getActiveSection(sectionOrder, trackedSections)
    const activeChapter = getActiveChapter(items)

    links.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.nav === activeSection)
    })

    items.forEach((item, index) => {
      item.classList.toggle('is-current', index === activeChapter)
    })
  }

  return {
    handleScroll,
    handleResize: handleScroll,
  }
}

function createScene(canvasElement, prefersReducedMotion, trackedSections) {
  const noop = {
    handlePointerMove: () => {},
    handleResize: () => {},
    handleScroll: () => {},
    start: () => {},
    stop: () => {},
    destroy: () => {},
  }

  let renderer

  try {
    renderer = new WebGLRenderer({
      canvas: canvasElement,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch (error) {
    document.documentElement.classList.add('no-webgl')
    return noop
  }

  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  const scene = new Scene()
  scene.fog = new FogExp2(0x050816, 0.055)

  const camera = new PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 80)
  const cameraTarget = new Vector3()
  const clock = new Clock()
  clock.stop()

  let elapsed = 0
  let isRunning = false
  let isDisposed = false
  let warmupPromise = null

  const motionState = {
    pointer: new Vector2(),
    pointerTarget: new Vector2(),
    scroll: 0,
    scrollTarget: 0,
    sections: {
      experience: 0,
      stack: 0,
      references: 0,
    },
  }

  const layout = {
    cameraX: -1.25,
    cameraY: 0.1,
    cameraZ: 8,
    worldX: 2.35,
    worldY: 0.15,
  }

  const world = new Group()
  scene.add(world)

  const pmremGenerator = new PMREMGenerator(renderer)
  const environmentScene = new RoomEnvironment()
  const environmentMap = pmremGenerator.fromScene(environmentScene, 0.05)
  scene.environment = environmentMap.texture
  environmentScene.dispose()
  pmremGenerator.dispose()

  const glowTexture = createGlowTexture()
  const aura = new Sprite(
    new SpriteMaterial({
      map: glowTexture,
      color: 0x79e4ff,
      transparent: true,
      opacity: 0.32,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  )
  aura.scale.set(8.4, 8.4, 1)
  world.add(aura)

  const warmAura = new Sprite(
    new SpriteMaterial({
      map: glowTexture,
      color: 0xf0c47b,
      transparent: true,
      opacity: 0.12,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  )
  warmAura.position.set(-0.4, 0.2, -0.2)
  warmAura.scale.set(4.8, 4.8, 1)
  world.add(warmAura)

  const coreGeometry = new IcosahedronGeometry(1.12, 2)
  const core = new Mesh(
    coreGeometry,
    new MeshStandardMaterial({
      color: 0xb7eeff,
      emissive: 0x1a3a78,
      emissiveIntensity: 1.2,
      roughness: 0.24,
      metalness: 0.12,
      envMapIntensity: 0.95,
      flatShading: true,
    })
  )
  world.add(core)

  const shell = new Mesh(
    new IcosahedronGeometry(1.42, 1),
    new MeshBasicMaterial({
      color: 0xdff7ff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    })
  )
  world.add(shell)

  const edges = new LineSegments(
    new EdgesGeometry(coreGeometry),
    new LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.25,
    })
  )
  world.add(edges)

  const halo = new Mesh(
    new TorusGeometry(2.05, 0.055, 24, 180),
    new MeshBasicMaterial({
      color: 0x82e8ff,
      transparent: true,
      opacity: 0.5,
    })
  )
  halo.rotation.x = 1.16
  halo.rotation.y = 0.28
  world.add(halo)

  const haloSecondary = new Mesh(
    new TorusGeometry(1.58, 0.018, 16, 180),
    new MeshBasicMaterial({
      color: 0xf0c47b,
      transparent: true,
      opacity: 0.9,
    })
  )
  haloSecondary.rotation.x = 2.02
  haloSecondary.rotation.z = 0.76
  world.add(haloSecondary)

  const portal = new Mesh(
    new RingGeometry(2.28, 2.62, 96),
    new MeshBasicMaterial({
      color: 0x8fe9ff,
      transparent: true,
      opacity: 0.16,
      side: DoubleSide,
    })
  )
  portal.rotation.x = 1.34
  portal.rotation.z = 0.12
  world.add(portal)

  const beam = new Mesh(
    new CylinderGeometry(0.18, 0.03, 7.2, 32, 1, true),
    new MeshBasicMaterial({
      color: 0x7fdfff,
      transparent: true,
      opacity: 0.06,
      side: DoubleSide,
    })
  )
  beam.rotation.z = 0.5
  beam.position.set(-0.35, -0.2, -0.8)
  world.add(beam)

  const trailCurve = new CatmullRomCurve3([
    new Vector3(-3.6, -0.1, -1.7),
    new Vector3(-1.8, 0.95, -0.5),
    new Vector3(0.7, 0.4, 0.4),
    new Vector3(3.1, -0.85, 1.35),
  ])

  const trail = new Mesh(
    new TubeGeometry(trailCurve, 140, 0.04, 18, false),
    new MeshBasicMaterial({
      color: 0x9befff,
      transparent: true,
      opacity: 0.32,
    })
  )
  trail.rotation.z = -0.08
  world.add(trail)

  const dustBand = createOrbitalDust()
  world.add(dustBand)

  const stars = createStarField()
  scene.add(stars)

  const satellites = []
  const satelliteGeometry = new SphereGeometry(0.11, 24, 24)
  const satelliteConfigs = [
    { radius: 2.6, speed: 0.78, phase: 0.3, yScale: 0.34, scale: 1, color: 0xf0c47b },
    { radius: 3.15, speed: 0.56, phase: 2.4, yScale: 0.54, scale: 0.72, color: 0x87e7ff },
    { radius: 2.82, speed: 1.02, phase: 4.8, yScale: 0.22, scale: 0.58, color: 0xbfc0ff },
  ]

  satelliteConfigs.forEach((config) => {
    const mesh = new Mesh(
      satelliteGeometry,
      new MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.55,
        roughness: 0.22,
        metalness: 0.08,
        envMapIntensity: 0.7,
      })
    )

    mesh.scale.setScalar(config.scale)
    world.add(mesh)
    satellites.push({ mesh, ...config })
  })

  scene.add(new AmbientLight(0x9bb5ff, 1.2))

  const keyLight = new PointLight(0x8ce9ff, 28, 28, 2)
  keyLight.position.set(4.5, 3.2, 5.8)
  scene.add(keyLight)

  const fillLight = new PointLight(0x223d89, 16, 22, 2)
  fillLight.position.set(-5, -2.4, 3.4)
  scene.add(fillLight)

  const warmLight = new PointLight(0xf0c47b, 10, 18, 2)
  warmLight.position.set(-0.8, 1.1, 3)
  scene.add(warmLight)

  function getAnimationTime() {
    return prefersReducedMotion ? 2.4 : elapsed
  }

  function handlePointerMove(event) {
    if (prefersReducedMotion) {
      return
    }

    motionState.pointerTarget.x = event.clientX / window.innerWidth - 0.5
    motionState.pointerTarget.y = event.clientY / window.innerHeight - 0.5
  }

  function handleScroll() {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight
    motionState.scrollTarget = pageHeight > 0 ? window.scrollY / pageHeight : 0

    Object.entries(trackedSections).forEach(([key, element]) => {
      motionState.sections[key] = getElementProgress(element)
      document.documentElement.style.setProperty(
        `--${key}-progress`,
        motionState.sections[key].toFixed(3)
      )
    })

    document.documentElement.style.setProperty('--scroll-progress', motionState.scrollTarget.toFixed(3))

    if (prefersReducedMotion && !isRunning) {
      renderFrame()
    }
  }

  function handleResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const compactLayout = width < 1100
    const mobileLayout = width < 760

    camera.aspect = width / height
    camera.fov = mobileLayout ? 46 : compactLayout ? 40 : 34
    camera.updateProjectionMatrix()

    layout.cameraX = mobileLayout ? 0 : compactLayout ? -0.2 : -1.25
    layout.cameraY = mobileLayout ? 0.9 : compactLayout ? 0.5 : 0.1
    layout.cameraZ = mobileLayout ? 9.2 : compactLayout ? 8.4 : 8
    layout.worldX = mobileLayout ? 0 : compactLayout ? 1.25 : 2.35
    layout.worldY = mobileLayout ? 1.55 : compactLayout ? 0.9 : 0.15

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

    if (prefersReducedMotion && !isRunning) {
      renderFrame()
    }
  }

  function renderFrame() {
    if (isDisposed) {
      return
    }

    if (!prefersReducedMotion) {
      elapsed += Math.min(clock.getDelta(), 0.05)
    }

    const animationTime = getAnimationTime()
    const experience = MathUtils.smoothstep(motionState.sections.experience, 0.06, 0.92)
    const stack = MathUtils.smoothstep(motionState.sections.stack, 0.08, 0.94)
    const references = MathUtils.smoothstep(motionState.sections.references, 0.08, 0.94)

    if (prefersReducedMotion) {
      motionState.pointer.set(0, 0)
      motionState.scroll = motionState.scrollTarget
    } else {
      motionState.pointer.lerp(motionState.pointerTarget, 0.06)
      motionState.scroll = MathUtils.lerp(motionState.scroll, motionState.scrollTarget, 0.08)
    }

    world.rotation.y =
      animationTime * 0.18 + motionState.pointer.x * 0.8 + experience * 1.05 + stack * 0.38
    world.rotation.x = Math.sin(animationTime * 0.32) * 0.07 + motionState.pointer.y * 0.28
    world.position.x = layout.worldX - experience * 0.55 - references * 0.35
    world.position.y =
      layout.worldY +
      Math.sin(animationTime * 0.72) * 0.15 -
      stack * 0.38 -
      motionState.scroll * 0.16
    world.position.z = -stack * 0.35

    core.rotation.x = animationTime * 0.26
    core.rotation.y = -animationTime * 0.34 + experience * 1.42
    core.scale.setScalar(1 + experience * 0.05 + references * 0.08)

    shell.rotation.y = animationTime * 0.14 + stack * 0.6
    shell.rotation.z = animationTime * 0.06
    shell.scale.setScalar(1 + stack * 0.1)

    edges.rotation.y = animationTime * 0.18
    halo.rotation.z = animationTime * 0.24 + experience * 1.15
    halo.scale.setScalar(1 + experience * 0.2 + references * 0.08)

    haloSecondary.rotation.y = -animationTime * 0.5 + stack * 1.2
    haloSecondary.scale.setScalar(1 + stack * 0.14)

    portal.rotation.z = animationTime * 0.08 + stack * 0.8
    portal.scale.setScalar(1 + stack * 0.22 + references * 0.16)
    portal.material.opacity = 0.12 + experience * 0.1 + references * 0.07

    beam.scale.y = 0.85 + stack * 0.35 + references * 0.22
    beam.material.opacity = 0.05 + stack * 0.05 + references * 0.04

    trail.rotation.y = animationTime * 0.14 + experience * 0.85
    trail.rotation.x = Math.sin(animationTime * 0.2) * 0.06
    trail.scale.setScalar(1 + references * 0.05)

    dustBand.rotation.y = animationTime * 0.05 + experience * 0.55
    dustBand.rotation.x = 1.02 - stack * 0.12
    dustBand.material.opacity =
      0.4 + Math.sin(animationTime * 0.6) * 0.04 + references * 0.04

    aura.material.opacity = 0.26 + Math.sin(animationTime * 1.2) * 0.04 + references * 0.06
    warmAura.material.opacity =
      0.09 + stack * 0.06 + Math.sin(animationTime * 0.9) * 0.02

    satellites.forEach((satellite) => {
      const angle = animationTime * satellite.speed + satellite.phase + experience * Math.PI * 2
      satellite.mesh.position.set(
        Math.cos(angle) * satellite.radius,
        Math.sin(angle * 1.2) * satellite.yScale - stack * 0.25,
        Math.sin(angle) * satellite.radius * 0.56 + references * 0.25
      )
    })

    stars.rotation.y = animationTime * 0.01
    stars.rotation.x = Math.sin(animationTime * 0.06) * 0.05

    camera.position.x = layout.cameraX + motionState.pointer.x * 0.85 - experience * 0.15
    camera.position.y =
      layout.cameraY - motionState.pointer.y * 0.42 - stack * 0.2 + references * 0.06
    camera.position.z = layout.cameraZ - experience * 0.22 + stack * 0.26
    camera.lookAt(cameraTarget.set(world.position.x * 0.16, world.position.y * 0.18, 0))

    renderer.render(scene, camera)
  }

  return {
    handlePointerMove,
    handleResize,
    handleScroll,
    async start() {
      if (isDisposed) {
        return
      }

      if (prefersReducedMotion) {
        renderFrame()
        return
      }

      if (isRunning) {
        return
      }

      if (!warmupPromise && typeof renderer.compileAsync === 'function') {
        warmupPromise = renderer.compileAsync(scene, camera).catch(() => {})
      }

      if (warmupPromise) {
        await warmupPromise
      }

      if (isDisposed || isRunning || document.hidden) {
        return
      }

      clock.start()
      renderer.setAnimationLoop(renderFrame)
      isRunning = true
    },
    stop() {
      if (!isRunning) {
        return
      }

      renderer.setAnimationLoop(null)
      clock.stop()
      isRunning = false
    },
    destroy() {
      if (isDisposed) {
        return
      }

      this.stop()
      isDisposed = true
      scene.environment = null
      disposeObjectTree(scene)
      environmentMap.dispose()
      renderer.dispose()

      if (typeof renderer.forceContextLoss === 'function') {
        renderer.forceContextLoss()
      }
    },
  }
}

function createGlowTexture() {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.06,
    size / 2,
    size / 2,
    size * 0.48
  )

  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.25, 'rgba(155,239,255,0.92)')
  gradient.addColorStop(0.58, 'rgba(37,92,196,0.38)')
  gradient.addColorStop(1, 'rgba(4,8,18,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function createOrbitalDust() {
  const count = 1800
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2
    const radius = 2.1 + (Math.random() - 0.5) * 0.8
    const spread = (Math.random() - 0.5) * 0.34

    positions[index * 3] = Math.cos(angle) * radius
    positions[index * 3 + 1] = spread
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.5
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  return new Points(
    geometry,
    new PointsMaterial({
      color: 0xbfeeff,
      size: 0.026,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
}

function createStarField() {
  const count = 1800
  const positions = new Float32Array(count * 3)

  for (let index = 0; index < count; index += 1) {
    const radius = 10 + Math.random() * 22
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[index * 3 + 1] = radius * Math.cos(phi)
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))

  return new Points(
    geometry,
    new PointsMaterial({
      color: 0xe9f7ff,
      size: 0.034,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
}

function getElementProgress(element) {
  if (!element) {
    return 0
  }

  const rect = element.getBoundingClientRect()
  const total = rect.height + window.innerHeight
  return clamp((window.innerHeight - rect.top) / total, 0, 1)
}

function getActiveSection(sectionOrder, trackedSections) {
  const threshold = window.innerHeight * 0.4
  let activeSection = sectionOrder[0]

  sectionOrder.forEach((key) => {
    const element = trackedSections[key]
    if (element && element.getBoundingClientRect().top <= threshold) {
      activeSection = key
    }
  })

  return activeSection
}

function getActiveChapter(items) {
  const focusLine = window.innerHeight * 0.45
  let activeIndex = 0
  let smallestDistance = Number.POSITIVE_INFINITY

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect()
    const center = rect.top + rect.height / 2
    const distance = Math.abs(center - focusLine)

    if (distance < smallestDistance) {
      smallestDistance = distance
      activeIndex = index
    }
  })

  return activeIndex
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function disposeObjectTree(object) {
  const textures = new Set()

  object.traverse((child) => {
    child.geometry?.dispose?.()

    if (Array.isArray(child.material)) {
      child.material.forEach((material) => disposeMaterial(material, textures))
      return
    }

    disposeMaterial(child.material, textures)
  })
}

function disposeMaterial(material, textures) {
  if (!material) {
    return
  }

  Object.values(material).forEach((value) => {
    if (!value?.isTexture || textures.has(value)) {
      return
    }

    textures.add(value)
    value.dispose()
  })

  material.dispose?.()
}
