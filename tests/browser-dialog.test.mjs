import test from 'node:test'
import assert from 'node:assert/strict'

import { createBrowserDialogController, resolveFocusTrapTarget } from '../src/lib/browser-dialog.js'

test('browser dialog 開啟與關閉時會同步 inert 狀態並回復觸發焦點', () => {
  const fixture = createDialogFixture()
  fixture.setActiveElement(fixture.compareTrigger)

  fixture.controller.setOpen(true)

  assert.equal(fixture.browserPanel.classList.contains('is-open'), true)
  assert.equal(fixture.browserBackdrop.classList.contains('is-open'), true)
  assert.equal(fixture.browserPanel.getAttribute('aria-hidden'), 'false')
  assert.equal(fixture.browserToggle.getAttribute('aria-expanded'), 'true')
  assert.equal(fixture.body.classList.contains('is-browser-open'), true)
  assert.equal(fixture.toolbar.inert, true)
  assert.equal(fixture.stage.inert, true)
  assert.equal(fixture.toolbar.getAttribute('aria-hidden'), 'true')
  assert.equal(fixture.activeElement(), fixture.searchInput)
  assert.equal(fixture.searchInput.wasSelected, true)

  fixture.controller.setOpen(false)

  assert.equal(fixture.browserPanel.classList.contains('is-open'), false)
  assert.equal(fixture.browserBackdrop.classList.contains('is-open'), false)
  assert.equal(fixture.browserPanel.getAttribute('aria-hidden'), 'true')
  assert.equal(fixture.browserToggle.getAttribute('aria-expanded'), 'false')
  assert.equal(fixture.body.classList.contains('is-browser-open'), false)
  assert.equal(fixture.toolbar.inert, false)
  assert.equal(fixture.stage.inert, false)
  assert.equal(fixture.toolbar.hasAttribute('aria-hidden'), false)
  assert.equal(fixture.activeElement(), fixture.compareTrigger)
})

test('browser dialog 會在 Tab 與 Shift+Tab 時維持焦點循環', () => {
  const fixture = createDialogFixture()
  fixture.controller.setOpen(true)

  fixture.setActiveElement(fixture.externalButton)
  const enterFromOutside = createKeyboardEvent('Tab')

  assert.equal(fixture.controller.handleKeydown(enterFromOutside), true)
  assert.equal(enterFromOutside.defaultPrevented, true)
  assert.equal(fixture.activeElement(), fixture.searchInput)

  fixture.setActiveElement(fixture.footerLink)
  const wrapForward = createKeyboardEvent('Tab')

  assert.equal(fixture.controller.handleKeydown(wrapForward), true)
  assert.equal(wrapForward.defaultPrevented, true)
  assert.equal(fixture.activeElement(), fixture.searchInput)

  fixture.setActiveElement(fixture.searchInput)
  const wrapBackward = createKeyboardEvent('Tab', { shiftKey: true })

  assert.equal(fixture.controller.handleKeydown(wrapBackward), true)
  assert.equal(wrapBackward.defaultPrevented, true)
  assert.equal(fixture.activeElement(), fixture.footerLink)
})

test('browser dialog 支援 Escape 關閉、fallback 焦點與最小焦點規則', () => {
  const fixture = createDialogFixture()
  fixture.setActiveElement(fixture.compareTrigger)
  fixture.controller.setOpen(true)

  fixture.setActiveElement(fixture.closeButton)
  fixture.compareTrigger.isConnected = false
  const escapeEvent = createKeyboardEvent('Escape')

  assert.equal(fixture.controller.handleKeydown(escapeEvent), true)
  assert.equal(escapeEvent.defaultPrevented, true)
  assert.equal(fixture.controller.isOpen, false)
  assert.equal(fixture.activeElement(), fixture.browserToggle)

  const loneTarget = { id: 'only' }

  assert.equal(
    resolveFocusTrapTarget({
      activeElement: loneTarget,
      focusableElements: [loneTarget],
      isShiftKey: false,
    }),
    loneTarget
  )
})

function createDialogFixture() {
  let activeElement = null

  const body = new FakeElement('body')
  const toolbar = new FakeElement('toolbar')
  const stage = new FakeElement('stage')
  const browserPanel = new FakeElement('browserPanel')
  const browserBackdrop = new FakeElement('browserBackdrop')
  const browserToggle = new FakeElement('browserToggle')
  const searchInput = new FakeElement('searchInput')
  const closeButton = new FakeElement('closeButton')
  const compareButton = new FakeElement('compareButton')
  const footerLink = new FakeElement('footerLink')
  const externalButton = new FakeElement('externalButton')
  const compareTrigger = new FakeElement('compareTrigger')

  searchInput.select = () => {
    searchInput.wasSelected = true
  }

  const focusableChildren = [searchInput, closeButton, compareButton, footerLink]
  browserPanel.querySelectorAll = () => focusableChildren

  ;[
    body,
    toolbar,
    stage,
    browserPanel,
    browserBackdrop,
    browserToggle,
    searchInput,
    closeButton,
    compareButton,
    footerLink,
    externalButton,
    compareTrigger,
  ].forEach(
    (element) => {
      element.focus = () => {
        activeElement = element
      }
    }
  )

  activeElement = browserToggle

  const controller = createBrowserDialogController({
    dialogElement: browserPanel,
    backdropElement: browserBackdrop,
    returnFocusElement: browserToggle,
    initialFocusElement: searchInput,
    inertRoots: [toolbar, stage],
    body,
    requestAnimationFrame: (callback) => callback(),
    getActiveElement: () => activeElement,
  })

  return {
    body,
    browserBackdrop,
    browserPanel,
    browserToggle,
    closeButton,
    compareButton,
    compareTrigger,
    controller,
    externalButton,
    footerLink,
    searchInput,
    stage,
    toolbar,
    activeElement: () => activeElement,
    setActiveElement: (element) => {
      activeElement = element
    },
  }
}

function createKeyboardEvent(key, { shiftKey = false } = {}) {
  return {
    key,
    shiftKey,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true
    },
  }
}

class FakeElement {
  constructor(name) {
    this.name = name
    this.attributes = new Map()
    this.classList = new FakeClassList()
    this.inert = false
    this.isConnected = true
    this.tabIndex = 0
    this.wasSelected = false
  }

  getAttribute(name) {
    return this.attributes.has(name) ? this.attributes.get(name) : null
  }

  hasAttribute(name) {
    return this.attributes.has(name)
  }

  querySelectorAll() {
    return []
  }

  removeAttribute(name) {
    this.attributes.delete(name)
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value))
  }

  toggleAttribute(name, force) {
    if (force) {
      this.attributes.set(name, '')
      return
    }

    this.attributes.delete(name)
  }
}

class FakeClassList {
  constructor() {
    this.names = new Set()
  }

  contains(name) {
    return this.names.has(name)
  }

  toggle(name, force) {
    if (force === undefined) {
      if (this.names.has(name)) {
        this.names.delete(name)
        return false
      }

      this.names.add(name)
      return true
    }

    if (force) {
      this.names.add(name)
      return true
    }

    this.names.delete(name)
    return false
  }
}
