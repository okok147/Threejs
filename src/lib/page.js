export function createLifecycle() {
  const cleanups = []

  function addCleanup(cleanup) {
    if (typeof cleanup === 'function') {
      cleanups.push(cleanup)
    }
  }

  return {
    addCleanup,
    addEventListener(target, type, handler, options) {
      target.addEventListener(type, handler, options)
      addCleanup(() => target.removeEventListener(type, handler, options))
    },
    destroy() {
      while (cleanups.length) {
        cleanups.pop()?.()
      }
    },
  }
}

export function setupReveals(elements, prefersReducedMotion, stagger = 70) {
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
    element.style.setProperty('--reveal-delay', `${index * stagger}ms`)
    observer.observe(element)
  })

  return () => observer.disconnect()
}

export function createSectionNavController({ navLinks, sections, chapterItems = [] }) {
  const sectionOrder = Object.keys(sections)

  function handleScroll() {
    const activeSection = getActiveSection(sectionOrder, sections)
    const activeChapter = chapterItems.length ? getActiveChapter(chapterItems) : -1

    navLinks.forEach((link) => {
      const isActive = link.dataset.nav === activeSection
      link.classList.toggle('is-active', isActive)

      if (isActive) {
        link.setAttribute('aria-current', 'location')
      } else {
        link.removeAttribute('aria-current')
      }
    })

    chapterItems.forEach((item, index) => {
      item.classList.toggle('is-current', index === activeChapter)
    })
  }

  return {
    handleResize: handleScroll,
    handleScroll,
  }
}

export function getElementProgress(element) {
  if (!element) {
    return 0
  }

  const rect = element.getBoundingClientRect()
  const total = rect.height + window.innerHeight
  return clamp((window.innerHeight - rect.top) / total, 0, 1)
}

function getActiveSection(sectionOrder, sections) {
  const threshold = window.innerHeight * 0.38
  let activeSection = sectionOrder[0]

  sectionOrder.forEach((key) => {
    const element = sections[key]
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
