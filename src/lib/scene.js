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
import { getElementProgress } from './page.js'

export const scenePresets = {
  orbitCinematic: {
    toneMappingExposure: 1.08,
    fog: { color: 0x050816, density: 0.055 },
    glowStops: [
      [0, 'rgba(255,255,255,1)'],
      [0.25, 'rgba(155,239,255,0.92)'],
      [0.58, 'rgba(37,92,196,0.38)'],
      [1, 'rgba(4,8,18,0)'],
    ],
    motion: {
      pointer: 1,
      drift: 1,
      experience: 1,
      stack: 1,
      references: 1,
    },
    layout: {
      desktop: { fov: 34, cameraX: -1.25, cameraY: 0.1, cameraZ: 8, worldX: 2.35, worldY: 0.15 },
      compact: { fov: 40, cameraX: -0.2, cameraY: 0.5, cameraZ: 8.4, worldX: 1.25, worldY: 0.9 },
      mobile: { fov: 46, cameraX: 0, cameraY: 0.9, cameraZ: 9.2, worldX: 0, worldY: 1.55 },
    },
    aura: { color: 0x79e4ff, opacity: 0.32, scale: 8.4 },
    warmAura: { color: 0xf0c47b, opacity: 0.12, scale: 4.8, position: [-0.4, 0.2, -0.2] },
    core: {
      color: 0xb7eeff,
      emissive: 0x1a3a78,
      emissiveIntensity: 1.2,
      roughness: 0.24,
      metalness: 0.12,
      envMapIntensity: 0.95,
    },
    shell: { color: 0xdff7ff, opacity: 0.12 },
    edges: { color: 0xffffff, opacity: 0.25 },
    halo: { color: 0x82e8ff, opacity: 0.5 },
    haloSecondary: { color: 0xf0c47b, opacity: 0.9 },
    portal: { color: 0x8fe9ff, opacity: 0.16 },
    beam: { color: 0x7fdfff, opacity: 0.06 },
    trail: { color: 0x9befff, opacity: 0.32 },
    dust: { color: 0xbfeeff, size: 0.026, opacity: 0.42 },
    stars: { color: 0xe9f7ff, size: 0.034, opacity: 0.9 },
    satellites: [
      { radius: 2.6, speed: 0.78, phase: 0.3, yScale: 0.34, scale: 1, color: 0xf0c47b },
      { radius: 3.15, speed: 0.56, phase: 2.4, yScale: 0.54, scale: 0.72, color: 0x87e7ff },
      { radius: 2.82, speed: 1.02, phase: 4.8, yScale: 0.22, scale: 0.58, color: 0xbfc0ff },
    ],
    lights: {
      ambient: { color: 0x9bb5ff, intensity: 1.2 },
      key: { color: 0x8ce9ff, intensity: 28, distance: 28, decay: 2, position: [4.5, 3.2, 5.8] },
      fill: { color: 0x223d89, intensity: 16, distance: 22, decay: 2, position: [-5, -2.4, 3.4] },
      warm: { color: 0xf0c47b, intensity: 10, distance: 18, decay: 2, position: [-0.8, 1.1, 3] },
    },
  },
  signalLedger: {
    toneMappingExposure: 1.02,
    fog: { color: 0xe8dcc4, density: 0.036 },
    glowStops: [
      [0, 'rgba(255,248,234,0.95)'],
      [0.26, 'rgba(232,176,110,0.78)'],
      [0.62, 'rgba(74,104,78,0.28)'],
      [1, 'rgba(240,230,212,0)'],
    ],
    motion: {
      pointer: 0.52,
      drift: 0.74,
      experience: 0.64,
      stack: 0.78,
      references: 0.86,
    },
    layout: {
      desktop: { fov: 32, cameraX: 0.7, cameraY: 0.25, cameraZ: 8.6, worldX: 3.4, worldY: 0.65 },
      compact: { fov: 36, cameraX: 0.3, cameraY: 0.5, cameraZ: 8.8, worldX: 2.4, worldY: 0.95 },
      mobile: { fov: 46, cameraX: 0, cameraY: 1.2, cameraZ: 9.6, worldX: 0, worldY: 1.8 },
    },
    aura: { color: 0xe6b173, opacity: 0.24, scale: 7.8 },
    warmAura: { color: 0x334c3b, opacity: 0.16, scale: 5.2, position: [-0.5, 0.35, -0.25] },
    core: {
      color: 0x20352a,
      emissive: 0x7a5838,
      emissiveIntensity: 0.7,
      roughness: 0.46,
      metalness: 0.1,
      envMapIntensity: 0.7,
    },
    shell: { color: 0xd0b48c, opacity: 0.16 },
    edges: { color: 0x6e5337, opacity: 0.18 },
    halo: { color: 0xc47d47, opacity: 0.34 },
    haloSecondary: { color: 0x30463a, opacity: 0.55 },
    portal: { color: 0x816444, opacity: 0.1 },
    beam: { color: 0x2d4a39, opacity: 0.08 },
    trail: { color: 0x5d6a57, opacity: 0.22 },
    dust: { color: 0x887053, size: 0.024, opacity: 0.28 },
    stars: { color: 0x6d715d, size: 0.03, opacity: 0.52 },
    satellites: [
      { radius: 2.4, speed: 0.62, phase: 0.1, yScale: 0.2, scale: 0.92, color: 0xd8ae79 },
      { radius: 3.05, speed: 0.48, phase: 2.7, yScale: 0.46, scale: 0.68, color: 0x445948 },
      { radius: 2.66, speed: 0.88, phase: 5.1, yScale: 0.16, scale: 0.56, color: 0x8a6c4a },
    ],
    lights: {
      ambient: { color: 0xf0e3cc, intensity: 1.65 },
      key: { color: 0xe3b16e, intensity: 22, distance: 28, decay: 2, position: [4.7, 3.2, 5.6] },
      fill: { color: 0x526253, intensity: 10, distance: 22, decay: 2, position: [-4.8, -2.4, 3.8] },
      warm: { color: 0x7f5739, intensity: 12, distance: 18, decay: 2, position: [-1, 1.2, 3.4] },
    },
  },
  museumMonograph: {
    toneMappingExposure: 0.96,
    fog: { color: 0x0d0c09, density: 0.05 },
    glowStops: [
      [0, 'rgba(255,247,231,0.98)'],
      [0.24, 'rgba(220,187,132,0.78)'],
      [0.62, 'rgba(92,120,110,0.24)'],
      [1, 'rgba(11,10,8,0)'],
    ],
    motion: {
      pointer: 0.28,
      drift: 0.48,
      experience: 0.54,
      stack: 0.46,
      references: 0.62,
    },
    layout: {
      desktop: { fov: 31, cameraX: 0.92, cameraY: 0.28, cameraZ: 8.9, worldX: 4.2, worldY: 0.55 },
      compact: { fov: 36, cameraX: 0.5, cameraY: 0.52, cameraZ: 9.1, worldX: 3.08, worldY: 0.92 },
      mobile: { fov: 46, cameraX: 0, cameraY: 1.15, cameraZ: 9.7, worldX: 0, worldY: 1.7 },
    },
    aura: { color: 0xf4d8a8, opacity: 0.18, scale: 7.6 },
    warmAura: { color: 0x647468, opacity: 0.14, scale: 5.5, position: [-0.45, 0.28, -0.3] },
    core: {
      color: 0xd8c6a4,
      emissive: 0x433220,
      emissiveIntensity: 0.62,
      roughness: 0.34,
      metalness: 0.18,
      envMapIntensity: 0.84,
    },
    shell: { color: 0xf5ebd4, opacity: 0.12 },
    edges: { color: 0xe9d3a7, opacity: 0.18 },
    halo: { color: 0xe0c28b, opacity: 0.26 },
    haloSecondary: { color: 0x708173, opacity: 0.48 },
    portal: { color: 0xe6d4b1, opacity: 0.08 },
    beam: { color: 0x8b9b8f, opacity: 0.05 },
    trail: { color: 0xc6b089, opacity: 0.18 },
    dust: { color: 0x8d7d65, size: 0.023, opacity: 0.24 },
    stars: { color: 0xd4c1a2, size: 0.028, opacity: 0.32 },
    satellites: [
      { radius: 2.3, speed: 0.52, phase: 0.24, yScale: 0.16, scale: 0.84, color: 0xe0c28b },
      { radius: 2.94, speed: 0.38, phase: 2.1, yScale: 0.34, scale: 0.64, color: 0x6f8274 },
      { radius: 2.56, speed: 0.68, phase: 4.6, yScale: 0.14, scale: 0.52, color: 0xb79b6b },
    ],
    lights: {
      ambient: { color: 0xf4ead7, intensity: 1.36 },
      key: { color: 0xe5c187, intensity: 18, distance: 28, decay: 2, position: [4.4, 3.1, 5.4] },
      fill: { color: 0x5d7064, intensity: 8, distance: 22, decay: 2, position: [-4.7, -2.2, 3.6] },
      warm: { color: 0x8f6941, intensity: 10, distance: 18, decay: 2, position: [-0.9, 1.1, 3.2] },
    },
  },
}

export function createLabScene({ canvas, prefersReducedMotion, trackedSections, preset }) {
  const settings = preset
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
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch (error) {
    canvas.closest('.version-shell')?.classList.add('no-webgl')
    return noop
  }

  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = settings.toneMappingExposure
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))

  const scene = new Scene()
  scene.fog = new FogExp2(settings.fog.color, settings.fog.density)

  const camera = new PerspectiveCamera(34, window.innerWidth / window.innerHeight, 0.1, 80)
  const cameraTarget = new Vector3()
  const clock = new Clock()
  clock.stop()

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
    cameraX: 0,
    cameraY: 0,
    cameraZ: 0,
    worldX: 0,
    worldY: 0,
  }

  let elapsed = 0
  let isRunning = false
  let isDisposed = false
  let warmupPromise = null

  const world = new Group()
  scene.add(world)

  const pmremGenerator = new PMREMGenerator(renderer)
  const environmentScene = new RoomEnvironment()
  const environmentMap = pmremGenerator.fromScene(environmentScene, 0.05)
  scene.environment = environmentMap.texture
  environmentScene.dispose()
  pmremGenerator.dispose()

  const glowTexture = createGlowTexture(settings.glowStops)
  const aura = new Sprite(
    new SpriteMaterial({
      map: glowTexture,
      color: settings.aura.color,
      transparent: true,
      opacity: settings.aura.opacity,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  )
  aura.scale.set(settings.aura.scale, settings.aura.scale, 1)
  world.add(aura)

  const warmAura = new Sprite(
    new SpriteMaterial({
      map: glowTexture,
      color: settings.warmAura.color,
      transparent: true,
      opacity: settings.warmAura.opacity,
      blending: AdditiveBlending,
      depthWrite: false,
    })
  )
  warmAura.position.set(...settings.warmAura.position)
  warmAura.scale.set(settings.warmAura.scale, settings.warmAura.scale, 1)
  world.add(warmAura)

  const coreGeometry = new IcosahedronGeometry(1.12, 2)
  const core = new Mesh(
    coreGeometry,
    new MeshStandardMaterial({
      color: settings.core.color,
      emissive: settings.core.emissive,
      emissiveIntensity: settings.core.emissiveIntensity,
      roughness: settings.core.roughness,
      metalness: settings.core.metalness,
      envMapIntensity: settings.core.envMapIntensity,
      flatShading: true,
    })
  )
  world.add(core)

  const shell = new Mesh(
    new IcosahedronGeometry(1.42, 1),
    new MeshBasicMaterial({
      color: settings.shell.color,
      wireframe: true,
      transparent: true,
      opacity: settings.shell.opacity,
    })
  )
  world.add(shell)

  const edges = new LineSegments(
    new EdgesGeometry(coreGeometry),
    new LineBasicMaterial({
      color: settings.edges.color,
      transparent: true,
      opacity: settings.edges.opacity,
    })
  )
  world.add(edges)

  const halo = new Mesh(
    new TorusGeometry(2.05, 0.055, 24, 180),
    new MeshBasicMaterial({
      color: settings.halo.color,
      transparent: true,
      opacity: settings.halo.opacity,
    })
  )
  halo.rotation.x = 1.16
  halo.rotation.y = 0.28
  world.add(halo)

  const haloSecondary = new Mesh(
    new TorusGeometry(1.58, 0.018, 16, 180),
    new MeshBasicMaterial({
      color: settings.haloSecondary.color,
      transparent: true,
      opacity: settings.haloSecondary.opacity,
    })
  )
  haloSecondary.rotation.x = 2.02
  haloSecondary.rotation.z = 0.76
  world.add(haloSecondary)

  const portal = new Mesh(
    new RingGeometry(2.28, 2.62, 96),
    new MeshBasicMaterial({
      color: settings.portal.color,
      transparent: true,
      opacity: settings.portal.opacity,
      side: DoubleSide,
    })
  )
  portal.rotation.x = 1.34
  portal.rotation.z = 0.12
  world.add(portal)

  const beam = new Mesh(
    new CylinderGeometry(0.18, 0.03, 7.2, 32, 1, true),
    new MeshBasicMaterial({
      color: settings.beam.color,
      transparent: true,
      opacity: settings.beam.opacity,
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
      color: settings.trail.color,
      transparent: true,
      opacity: settings.trail.opacity,
    })
  )
  trail.rotation.z = -0.08
  world.add(trail)

  const dustBand = createOrbitalDust(settings.dust)
  world.add(dustBand)

  const stars = createStarField(settings.stars)
  scene.add(stars)

  const satellites = []
  const satelliteGeometry = new SphereGeometry(0.11, 24, 24)

  settings.satellites.forEach((config) => {
    const mesh = new Mesh(
      satelliteGeometry,
      new MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.45,
        roughness: 0.22,
        metalness: 0.08,
        envMapIntensity: 0.7,
      })
    )

    mesh.scale.setScalar(config.scale)
    world.add(mesh)
    satellites.push({ mesh, ...config })
  })

  scene.add(new AmbientLight(settings.lights.ambient.color, settings.lights.ambient.intensity))
  scene.add(createPointLight(settings.lights.key))
  scene.add(createPointLight(settings.lights.fill))
  scene.add(createPointLight(settings.lights.warm))

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
    const compactLayout = width < 1120
    const mobileLayout = width < 760
    const profile = mobileLayout ? settings.layout.mobile : compactLayout ? settings.layout.compact : settings.layout.desktop

    camera.aspect = width / height
    camera.fov = profile.fov
    camera.updateProjectionMatrix()

    layout.cameraX = profile.cameraX
    layout.cameraY = profile.cameraY
    layout.cameraZ = profile.cameraZ
    layout.worldX = profile.worldX
    layout.worldY = profile.worldY

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

    const motion = settings.motion

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
      animationTime * 0.18 * motion.drift +
      motionState.pointer.x * 0.8 * motion.pointer +
      experience * 1.05 * motion.experience +
      stack * 0.38 * motion.stack
    world.rotation.x =
      Math.sin(animationTime * 0.32 * motion.drift) * 0.07 +
      motionState.pointer.y * 0.28 * motion.pointer
    world.position.x = layout.worldX - experience * 0.55 * motion.experience - references * 0.35 * motion.references
    world.position.y =
      layout.worldY +
      Math.sin(animationTime * 0.72 * motion.drift) * 0.15 -
      stack * 0.38 * motion.stack -
      motionState.scroll * 0.16
    world.position.z = -stack * 0.35 * motion.stack

    core.rotation.x = animationTime * 0.26 * motion.drift
    core.rotation.y = -animationTime * 0.34 * motion.drift + experience * 1.42 * motion.experience
    core.scale.setScalar(1 + experience * 0.05 + references * 0.08 * motion.references)

    shell.rotation.y = animationTime * 0.14 * motion.drift + stack * 0.6 * motion.stack
    shell.rotation.z = animationTime * 0.06 * motion.drift
    shell.scale.setScalar(1 + stack * 0.1 * motion.stack)

    edges.rotation.y = animationTime * 0.18 * motion.drift
    halo.rotation.z = animationTime * 0.24 * motion.drift + experience * 1.15 * motion.experience
    halo.scale.setScalar(1 + experience * 0.2 * motion.experience + references * 0.08 * motion.references)

    haloSecondary.rotation.y = -animationTime * 0.5 * motion.drift + stack * 1.2 * motion.stack
    haloSecondary.scale.setScalar(1 + stack * 0.14 * motion.stack)

    portal.rotation.z = animationTime * 0.08 * motion.drift + stack * 0.8 * motion.stack
    portal.scale.setScalar(1 + stack * 0.22 * motion.stack + references * 0.16 * motion.references)
    portal.material.opacity = settings.portal.opacity + experience * 0.1 + references * 0.07

    beam.scale.y = 0.85 + stack * 0.35 * motion.stack + references * 0.22 * motion.references
    beam.material.opacity = settings.beam.opacity + stack * 0.05 + references * 0.04

    trail.rotation.y = animationTime * 0.14 * motion.drift + experience * 0.85 * motion.experience
    trail.rotation.x = Math.sin(animationTime * 0.2 * motion.drift) * 0.06
    trail.scale.setScalar(1 + references * 0.05 * motion.references)

    dustBand.rotation.y = animationTime * 0.05 * motion.drift + experience * 0.55 * motion.experience
    dustBand.rotation.x = 1.02 - stack * 0.12 * motion.stack
    dustBand.material.opacity = settings.dust.opacity + Math.sin(animationTime * 0.6) * 0.04 + references * 0.04

    aura.material.opacity = settings.aura.opacity + Math.sin(animationTime * 1.2 * motion.drift) * 0.04 + references * 0.06
    warmAura.material.opacity =
      settings.warmAura.opacity + stack * 0.06 * motion.stack + Math.sin(animationTime * 0.9 * motion.drift) * 0.02

    satellites.forEach((satellite) => {
      const angle = animationTime * satellite.speed + satellite.phase + experience * Math.PI * 2 * motion.experience
      satellite.mesh.position.set(
        Math.cos(angle) * satellite.radius,
        Math.sin(angle * 1.2) * satellite.yScale - stack * 0.25 * motion.stack,
        Math.sin(angle) * satellite.radius * 0.56 + references * 0.25 * motion.references
      )
    })

    stars.rotation.y = animationTime * 0.01 * motion.drift
    stars.rotation.x = Math.sin(animationTime * 0.06 * motion.drift) * 0.05

    camera.position.x = layout.cameraX + motionState.pointer.x * 0.85 * motion.pointer - experience * 0.15 * motion.experience
    camera.position.y =
      layout.cameraY -
      motionState.pointer.y * 0.42 * motion.pointer -
      stack * 0.2 * motion.stack +
      references * 0.06 * motion.references
    camera.position.z = layout.cameraZ - experience * 0.22 * motion.experience + stack * 0.26 * motion.stack
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

function createPointLight(config) {
  const light = new PointLight(config.color, config.intensity, config.distance, config.decay)
  light.position.set(...config.position)
  return light
}

function createGlowTexture(stops) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')

  if (!context) {
    return new CanvasTexture(canvas)
  }

  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.06,
    size / 2,
    size / 2,
    size * 0.48
  )

  stops.forEach(([offset, color]) => {
    gradient.addColorStop(offset, color)
  })

  context.fillStyle = gradient
  context.fillRect(0, 0, size, size)

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function createOrbitalDust(config) {
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
      color: config.color,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
}

function createStarField(config) {
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
      color: config.color,
      size: config.size,
      transparent: true,
      opacity: config.opacity,
      depthWrite: false,
      sizeAttenuation: true,
    })
  )
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
