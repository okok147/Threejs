import './style.css'
import {
  AdditiveBlending,
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Clock,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

const repoUrl = 'https://github.com/okok147/Threejs'
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
        <span>光軌 / THREE.JS</span>
      </a>
      <a class="header-link" href="${repoUrl}" target="_blank" rel="noreferrer">
        GitHub
      </a>
    </header>

    <main class="page" id="top">
      <section class="hero section">
        <div class="hero-copy reveal is-visible">
          <p class="hero-brand">光軌</p>
          <p class="eyebrow">簡單 three.js 網站</p>
          <h1>只用一個發光物件，做出乾淨而有存在感的首頁。</h1>
          <p class="lede">
            這是一個輕量單頁網站，包含即時 WebGL 場景、細緻視差，與可直接部署到
            GitHub Pages 的流程。
          </p>
          <div class="actions">
            <a class="button button-primary" href="#details">查看結構</a>
            <a class="button button-secondary" href="${repoUrl}" target="_blank" rel="noreferrer">
              打開原始碼
            </a>
          </div>
        </div>

        <aside class="hero-meta reveal is-visible" aria-label="互動資訊">
          <p class="meta-kicker">互動摘要</p>
          <div class="meta-row">
            <span>滑鼠</span>
            <p>鏡頭與幾何會跟著游標緩慢偏移，避免畫面太死。</p>
          </div>
          <div class="meta-row">
            <span>滾動</span>
            <p>光環、衛星與段落會依頁面進度產生細微位移。</p>
          </div>
          <div class="meta-row">
            <span>部署</span>
            <p>推送到 main 後，GitHub Actions 會自動建置並發布 Pages。</p>
          </div>
        </aside>
      </section>

      <section class="details section" id="details">
        <div class="section-head reveal">
          <div>
            <p class="section-label">互動重點</p>
            <h2>這個頁面沒有堆功能，而是把動態集中在三個必要的手勢。</h2>
          </div>
          <p class="section-copy">
            第一屏像海報，後續段落只負責解釋互動、技術與部署方式，避免把體驗做成示範牆。
          </p>
        </div>

        <div class="feature-list">
          <article class="feature reveal">
            <span class="feature-number">01</span>
            <h3>游標漂移</h3>
            <p>相機不是直接跟著滑鼠跑，而是帶著阻尼慢慢追上，畫面更穩。</p>
          </article>
          <article class="feature reveal">
            <span class="feature-number">02</span>
            <h3>場景呼吸</h3>
            <p>主體、光環與衛星以不同速度旋轉，讓畫面保持深度與節奏。</p>
          </article>
          <article class="feature reveal">
            <span class="feature-number">03</span>
            <h3>捲動節奏</h3>
            <p>背景物件與文字在滾動時產生細小落差，頁面不會像靜態截圖。</p>
          </article>
        </div>
      </section>

      <section class="build section">
        <div class="build-copy reveal">
          <p class="section-label">技術與部署</p>
          <h2>前端結構保持很薄，方便改字、換場景，然後直接上 GitHub。</h2>
          <p class="section-copy">
            網站只用 Vite、three.js 與原生 CSS，沒有多餘框架負擔，也讓後續擴充很直接。
          </p>
        </div>

        <div class="build-list">
          <article class="build-item reveal">
            <span>技術堆疊</span>
            <strong>Vite + three.js + 原生 CSS</strong>
            <p>保留最少依賴，建置、調整與部署都很直接。</p>
          </article>
          <article class="build-item reveal">
            <span>場景策略</span>
            <strong>單一主物件 + 粒子星點 + 發光光環</strong>
            <p>在視覺有記憶點的同時，把渲染成本壓在合理範圍內。</p>
          </article>
          <article class="build-item reveal">
            <span>發布方式</span>
            <strong>GitHub Actions 自動部署 Pages</strong>
            <p>每次推送 main 都會重新建置，站點可以自動更新。</p>
          </article>
        </div>
      </section>

      <section class="closing section reveal">
        <p class="section-label">已可上線</p>
        <h2>這個專案現在可以直接推上 GitHub，並發佈成可公開瀏覽的網站。</h2>
        <a class="button button-primary" href="${repoUrl}" target="_blank" rel="noreferrer">
          前往 GitHub 倉庫
        </a>
        <p class="footer-note">如果要換成你的品牌，只需要改文案、色盤與場景參數。</p>
      </section>
    </main>
  </div>
`

const revealItems = [...document.querySelectorAll('.reveal:not(.is-visible)')]
const canvas = document.querySelector('[data-canvas]')

setupReveals(revealItems, reducedMotion)

if (canvas) {
  const sceneController = createScene(canvas, reducedMotion)

  window.addEventListener('resize', sceneController.handleResize)
  window.addEventListener('pointermove', sceneController.handlePointerMove, {
    passive: true,
  })
  window.addEventListener('scroll', sceneController.handleScroll, { passive: true })

  sceneController.handleResize()
  sceneController.handleScroll()
  sceneController.start()
}

requestAnimationFrame(() => {
  document.body.classList.add('is-ready')
})

function setupReveals(elements, prefersReducedMotion) {
  if (prefersReducedMotion) {
    elements.forEach((element) => element.classList.add('is-visible'))
    return
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
    element.style.setProperty('--reveal-delay', `${index * 90}ms`)
    observer.observe(element)
  })
}

function createScene(canvasElement, prefersReducedMotion) {
  const noop = {
    handlePointerMove: () => {},
    handleResize: () => {},
    handleScroll: () => {},
    start: () => {},
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  const scene = new Scene()
  const camera = new PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 60)
  const cameraTarget = new Vector3()
  const clock = new Clock()

  const motionState = {
    pointer: new Vector2(),
    pointerTarget: new Vector2(),
    scroll: 0,
    scrollTarget: 0,
  }

  const orbitGroup = new Group()
  scene.add(orbitGroup)

  const glowTexture = createGlowTexture()
  const aura = new Sprite(
    new SpriteMaterial({
      map: glowTexture,
      color: 0x69deff,
      transparent: true,
      opacity: 0.48,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  )
  aura.scale.set(6.6, 6.6, 1)
  orbitGroup.add(aura)

  const coreGeometry = new IcosahedronGeometry(1.24, 1)
  const core = new Mesh(
    coreGeometry,
    new MeshStandardMaterial({
      color: 0x96f0ff,
      emissive: 0x17336f,
      emissiveIntensity: 1.35,
      roughness: 0.18,
      metalness: 0.08,
      flatShading: true,
    })
  )
  orbitGroup.add(core)

  const shell = new Mesh(
    new IcosahedronGeometry(1.5, 1),
    new MeshBasicMaterial({
      color: 0xdaf6ff,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    })
  )
  orbitGroup.add(shell)

  const edges = new LineSegments(
    new EdgesGeometry(coreGeometry),
    new LineBasicMaterial({
      color: 0xf7fcff,
      transparent: true,
      opacity: 0.38,
    })
  )
  orbitGroup.add(edges)

  const halo = new Mesh(
    new TorusGeometry(1.95, 0.05, 18, 160),
    new MeshBasicMaterial({
      color: 0x84e5ff,
      transparent: true,
      opacity: 0.55,
    })
  )
  halo.rotation.x = 1.14
  halo.rotation.y = 0.38
  orbitGroup.add(halo)

  const accentRing = new Mesh(
    new TorusGeometry(1.58, 0.015, 12, 160),
    new MeshBasicMaterial({
      color: 0xf0c47b,
      transparent: true,
      opacity: 0.9,
    })
  )
  accentRing.rotation.x = 1.9
  accentRing.rotation.z = 0.78
  orbitGroup.add(accentRing)

  const satellites = []
  const satelliteGeometry = new SphereGeometry(0.12, 24, 24)
  const satelliteConfigs = [
    { radius: 2.45, speed: 0.8, phase: 0.35, yScale: 0.35, scale: 0.95, color: 0xf0c47b },
    { radius: 3.05, speed: 0.55, phase: 2.2, yScale: 0.5, scale: 0.7, color: 0x8feaff },
    { radius: 2.75, speed: 1.05, phase: 4.6, yScale: 0.25, scale: 0.55, color: 0xbabaff },
  ]

  satelliteConfigs.forEach((config) => {
    const mesh = new Mesh(
      satelliteGeometry,
      new MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.08,
      })
    )

    mesh.scale.setScalar(config.scale)
    orbitGroup.add(mesh)
    satellites.push({ mesh, ...config })
  })

  const starCount = 1400
  const starPositions = new Float32Array(starCount * 3)

  for (let index = 0; index < starCount; index += 1) {
    const radius = 8 + Math.random() * 18
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)

    starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
    starPositions[index * 3 + 1] = radius * Math.cos(phi)
    starPositions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
  }

  const stars = new Points(
    new BufferGeometry(),
    new PointsMaterial({
      color: 0xe4f6ff,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    })
  )
  stars.geometry.setAttribute('position', new BufferAttribute(starPositions, 3))
  scene.add(stars)

  scene.add(new AmbientLight(0x88a6ff, 1.25))

  const keyLight = new PointLight(0x83eaff, 22, 22, 2)
  keyLight.position.set(3.4, 2.8, 5.2)
  scene.add(keyLight)

  const fillLight = new PointLight(0x203a7c, 18, 24, 2)
  fillLight.position.set(-4.6, -1.8, 3.5)
  scene.add(fillLight)

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
    document.documentElement.style.setProperty(
      '--scroll-progress',
      motionState.scrollTarget.toFixed(3)
    )
  }

  function handleResize() {
    const width = window.innerWidth
    const height = window.innerHeight
    const compactLayout = width < 980

    camera.aspect = width / height
    camera.fov = compactLayout ? 54 : 44
    camera.position.set(compactLayout ? 0 : -0.6, compactLayout ? 0.2 : 0.3, compactLayout ? 7.4 : 6.2)
    camera.updateProjectionMatrix()

    orbitGroup.position.set(compactLayout ? 0 : 1.75, compactLayout ? -0.45 : 0.1, 0)

    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
  }

  function renderFrame() {
    const elapsed = clock.getElapsedTime()
    const compactLayout = window.innerWidth < 980

    if (prefersReducedMotion) {
      motionState.pointer.set(0, 0)
      motionState.scroll = motionState.scrollTarget
    } else {
      motionState.pointer.lerp(motionState.pointerTarget, 0.06)
      motionState.scroll = MathUtils.lerp(motionState.scroll, motionState.scrollTarget, 0.08)
    }

    orbitGroup.rotation.y = elapsed * 0.28 + motionState.pointer.x * 0.7 + motionState.scroll * 0.95
    orbitGroup.rotation.x = Math.sin(elapsed * 0.45) * 0.1 + motionState.pointer.y * 0.32
    orbitGroup.position.y =
      (compactLayout ? -0.45 : 0.1) + Math.sin(elapsed * 0.9) * 0.16 - motionState.scroll * 0.9

    halo.rotation.z = elapsed * 0.24 + motionState.scroll * 1.4
    accentRing.rotation.y = elapsed * 0.62
    shell.rotation.y = -elapsed * 0.18
    edges.rotation.y = elapsed * 0.24
    aura.material.opacity = 0.42 + Math.sin(elapsed * 1.6) * 0.06

    satellites.forEach((satellite) => {
      const angle = elapsed * satellite.speed + satellite.phase + motionState.scroll * Math.PI * 2
      satellite.mesh.position.set(
        Math.cos(angle) * satellite.radius,
        Math.sin(angle * 1.15) * satellite.yScale,
        Math.sin(angle) * satellite.radius * 0.58
      )
    })

    stars.rotation.y = elapsed * 0.014
    stars.rotation.x = Math.sin(elapsed * 0.08) * 0.08

    camera.position.x = (compactLayout ? 0 : -0.6) + motionState.pointer.x * 0.9
    camera.position.y =
      (compactLayout ? 0.2 : 0.3) - motionState.pointer.y * 0.55 - motionState.scroll * 0.42
    camera.lookAt(cameraTarget.set(orbitGroup.position.x * 0.14, orbitGroup.position.y * 0.18, 0))

    renderer.render(scene, camera)
    requestAnimationFrame(renderFrame)
  }

  return {
    handlePointerMove,
    handleResize,
    handleScroll,
    start() {
      renderFrame()
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
  gradient.addColorStop(0.22, 'rgba(154,239,255,0.95)')
  gradient.addColorStop(0.58, 'rgba(45,96,186,0.42)')
  gradient.addColorStop(1, 'rgba(5,8,22,0)')

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  return new CanvasTexture(canvas)
}
