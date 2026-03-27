import test from 'node:test'
import assert from 'node:assert/strict'

import { getVersionTabIntent } from '../src/lib/version-navigator.js'
import {
  getBrowserShortcutAction,
  handleBrowserSearchSubmit,
  handleVersionTabKeydownIntent,
  syncVersionTabs,
} from '../src/lib/version-navigator-ui.js'

test('syncVersionTabs 會同步 active 與 roving tabindex', () => {
  const tabs = [createTab('v001'), createTab('v002'), createTab('v003')]

  syncVersionTabs({
    versionTabs: tabs,
    activeVersionNumber: 'v001',
    focusableVersionNumber: 'v002',
  })

  assert.equal(tabs[0].getAttribute('aria-selected'), 'true')
  assert.equal(tabs[0].classList.contains('is-active'), true)
  assert.equal(tabs[0].tabIndex, -1)
  assert.equal(tabs[1].getAttribute('aria-selected'), 'false')
  assert.equal(tabs[1].tabIndex, 0)
  assert.equal(tabs[2].tabIndex, -1)
})

test('handleVersionTabKeydownIntent 對方向鍵只移動 focus，不立即啟用版本', () => {
  const focusCalls = []
  const activateCalls = []
  const event = createKeydownEvent({
    key: 'ArrowRight',
    target: createTab('v001'),
  })

  const handled = handleVersionTabKeydownIntent({
    event,
    versionNumbers: ['v001', 'v002', 'v003'],
    getVersionTabIntent,
    focusVersionTab: (versionNumber) => focusCalls.push(versionNumber),
    activateVersion: (versionNumber) => activateCalls.push(versionNumber),
  })

  assert.equal(handled, true)
  assert.equal(event.defaultPrevented, true)
  assert.deepEqual(focusCalls, ['v002'])
  assert.deepEqual(activateCalls, [])
})

test('handleVersionTabKeydownIntent 對 Enter 會 focus 並啟用目前 tab', () => {
  const focusCalls = []
  const activateCalls = []
  const event = createKeydownEvent({
    key: 'Enter',
    target: createTab('v002'),
  })

  handleVersionTabKeydownIntent({
    event,
    versionNumbers: ['v001', 'v002', 'v003'],
    getVersionTabIntent,
    focusVersionTab: (versionNumber) => focusCalls.push(versionNumber),
    activateVersion: (versionNumber) => activateCalls.push(versionNumber),
  })

  assert.deepEqual(focusCalls, ['v002'])
  assert.deepEqual(activateCalls, ['v002'])
})

test('handleBrowserSearchSubmit 會用第一個結果切換版本並關閉 drawer', () => {
  const activated = []
  const openStates = []
  const event = createKeydownEvent({ key: 'Enter', target: createElement() })

  const handled = handleBrowserSearchSubmit({
    event,
    filteredVersions: [{ versionNumber: 'v003' }, { versionNumber: 'v002' }],
    activateVersion: (versionNumber) => activated.push(versionNumber),
    setBrowserOpen: (nextState) => openStates.push(nextState),
  })

  assert.equal(handled, true)
  assert.equal(event.defaultPrevented, true)
  assert.deepEqual(activated, ['v003'])
  assert.deepEqual(openStates, [false])
})

test('getBrowserShortcutAction 只在合法情境下開啟 drawer，並允許 Escape 關閉', () => {
  assert.equal(
    getBrowserShortcutAction({
      event: createShortcutEvent({ key: '/', target: createElement() }),
      isBrowserOpen: false,
    }),
    'open'
  )

  assert.equal(
    getBrowserShortcutAction({
      event: createShortcutEvent({ key: 'k', ctrlKey: true, target: createElement() }),
      isBrowserOpen: false,
    }),
    'open'
  )

  assert.equal(
    getBrowserShortcutAction({
      event: createShortcutEvent({
        key: '/',
        target: createElement({
          closestMap: {
            'input, textarea, select, [contenteditable="true"]': { nodeName: 'INPUT' },
          },
        }),
      }),
      isBrowserOpen: false,
    }),
    null
  )

  assert.equal(
    getBrowserShortcutAction({
      event: createShortcutEvent({ key: 'Escape', target: createElement() }),
      isBrowserOpen: true,
    }),
    'close'
  )
})

function createTab(versionNumber) {
  return createElement({ dataset: { versionTab: versionNumber } })
}

function createKeydownEvent({ key, target }) {
  return {
    key,
    target,
    defaultPrevented: false,
    preventDefault() {
      this.defaultPrevented = true
    },
  }
}

function createShortcutEvent({ key, target, ctrlKey = false, metaKey = false, altKey = false }) {
  return {
    key,
    target,
    ctrlKey,
    metaKey,
    altKey,
  }
}

function createElement({ dataset = {}, closestMap = {} } = {}) {
  const attributes = new Map()
  const classNames = new Set()
  const element = {
    dataset,
    tabIndex: -1,
    classList: {
      contains(className) {
        return classNames.has(className)
      },
      toggle(className, force) {
        if (force) {
          classNames.add(className)
          return true
        }

        classNames.delete(className)
        return false
      },
    },
    getAttribute(name) {
      return attributes.get(name) ?? null
    },
    setAttribute(name, value) {
      attributes.set(name, String(value))
    },
    closest(selector) {
      return closestMap[selector] ?? (selector === '[data-version-tab]' && dataset.versionTab ? element : null)
    },
  }

  return element
}
