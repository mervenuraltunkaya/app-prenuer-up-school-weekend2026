import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { loadEnvConfig } from '@next/env'

let envLoaded = false
let resolvedRoot: string | null = null

function readPackageName(dir: string): string | null {
  const pkgPath = path.join(dir, 'package.json')
  if (!existsSync(pkgPath)) return null
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { name?: string }
    return pkg.name ?? null
  } catch {
    return null
  }
}

/**
 * dashboard/ kökünü bulur — cwd monorepo kökü veya dashboard olabilir.
 */
export function resolveDashboardRoot(): string {
  if (resolvedRoot) return resolvedRoot

  const cwd = process.cwd()
  const candidates = [cwd, path.join(cwd, 'dashboard')]

  for (const dir of candidates) {
    if (readPackageName(dir) === 'dashboard') {
      resolvedRoot = dir
      return dir
    }
  }

  resolvedRoot = cwd
  return cwd
}

/**
 * Monorepo / Turbopack ortamında .env.local bazen yüklenmez.
 * Next resmi loadEnvConfig ile dashboard kökünden okur.
 */
export function loadDashboardEnv(): void {
  if (envLoaded) return

  const projectDir = resolveDashboardRoot()
  const dev = process.env.NODE_ENV !== 'production'
  const result = loadEnvConfig(projectDir, dev)
  envLoaded = true

  if (process.env.NODE_ENV === 'development') {
    const files = result?.loadedEnvFiles ?? []
    const paths = files.map((f) => f.path).filter(Boolean)
    console.info('[env] dashboard root:', projectDir)
    if (paths.length) {
      console.info('[env] Yüklenen dosyalar:', paths.join(', '))
    } else {
      console.warn(
        '[env] Hiç .env dosyası yüklenmedi. Beklenen konum:',
        path.join(projectDir, '.env.local'),
      )
    }
  }
}
