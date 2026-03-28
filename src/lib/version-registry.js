export function createVersionRendererRegistry(versionModuleMap = {}) {
  return new Map(
    Object.entries(versionModuleMap)
      .map(([modulePath, moduleExports]) => [
        normalizeVersionModulePath(modulePath),
        moduleExports?.renderVersion,
      ])
      .filter(([, renderVersion]) => typeof renderVersion === 'function')
  )
}

export function normalizeVersionModulePath(modulePath = '') {
  return String(modulePath).replace(/^\.\.\//, '')
}

export function hasRenderVersionExport(source = '') {
  return /export\s+function\s+renderVersion\s*\(/.test(source) || /export\s*\{\s*renderVersion\s*\}/.test(source)
}
