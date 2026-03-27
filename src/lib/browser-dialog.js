const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([type="hidden"]):not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ')

export function getFocusableElements(container) {
  if (!container || typeof container.querySelectorAll !== 'function') {
    return []
  }

  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter((element) => isFocusableElement(element))
}

export function resolveFocusTrapTarget({ activeElement = null, focusableElements = [], isShiftKey = false }) {
  const [firstElement] = focusableElements
  const lastElement = focusableElements.at(-1) ?? null

  if (!firstElement || !lastElement) {
    return null
  }

  if (!focusableElements.includes(activeElement)) {
    return isShiftKey ? lastElement : firstElement
  }

  if (isShiftKey && activeElement === firstElement) {
    return lastElement
  }

  if (!isShiftKey && activeElement === lastElement) {
    return firstElement
  }

  return null
}

export function createBrowserDialogController({
  dialogElement,
  backdropElement,
  returnFocusElement,
  initialFocusElement,
  inertRoots = [],
  body,
  requestAnimationFrame = (callback) => callback(),
  getActiveElement = () => null,
}) {
  let isOpen = false

  function setOpen(nextState, { returnFocus = true } = {}) {
    isOpen = nextState

    dialogElement.classList.toggle('is-open', nextState)
    backdropElement.classList.toggle('is-open', nextState)
    dialogElement.setAttribute('aria-hidden', String(!nextState))
    returnFocusElement.setAttribute('aria-expanded', String(nextState))
    body?.classList.toggle('is-browser-open', nextState)
    inertRoots.forEach((root) => setElementInertState(root, nextState))

    if (nextState) {
      requestAnimationFrame(() => {
        initialFocusElement?.focus?.({ preventScroll: true })
        initialFocusElement?.select?.()
      })
      return
    }

    if (returnFocus) {
      returnFocusElement?.focus?.({ preventScroll: true })
    }
  }

  function handleKeydown(event) {
    if (!isOpen) {
      return false
    }

    if (event.key === 'Escape') {
      event.preventDefault?.()
      setOpen(false)
      return true
    }

    if (event.key !== 'Tab') {
      return false
    }

    const nextFocusTarget = resolveFocusTrapTarget({
      activeElement: getActiveElement(),
      focusableElements: getFocusableElements(dialogElement),
      isShiftKey: Boolean(event.shiftKey),
    })

    if (!nextFocusTarget) {
      return false
    }

    event.preventDefault?.()
    nextFocusTarget.focus({ preventScroll: true })
    return true
  }

  return {
    get isOpen() {
      return isOpen
    },
    handleKeydown,
    setOpen,
  }
}

function isFocusableElement(element) {
  if (!element || typeof element.focus !== 'function') {
    return false
  }

  if ('disabled' in element && element.disabled) {
    return false
  }

  if (element.getAttribute?.('hidden') !== null) {
    return false
  }

  if (element.getAttribute?.('aria-hidden') === 'true') {
    return false
  }

  if (typeof element.tabIndex === 'number' && element.tabIndex < 0) {
    return false
  }

  return true
}

function setElementInertState(element, isInert) {
  if (!element) {
    return
  }

  element.inert = isInert

  if (typeof element.toggleAttribute === 'function') {
    element.toggleAttribute('inert', isInert)
  } else if (isInert) {
    element.setAttribute?.('inert', '')
  } else {
    element.removeAttribute?.('inert')
  }

  if (isInert) {
    element.setAttribute?.('aria-hidden', 'true')
    return
  }

  element.removeAttribute?.('aria-hidden')
}
