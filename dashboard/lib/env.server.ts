import 'server-only'

import { loadDashboardEnv } from '@/lib/load-env'

export type ServerEnvSnapshot = {
  supabaseUrl: string | undefined
  supabaseAnonKey: string | undefined
  serviceRoleKey: string | undefined
  adminEmails: string | undefined
  cwd: string
  nodeEnv: string | undefined
}

export type ServerEnvDiagnostics = {
  ok: boolean
  missing: string[]
  /** .env içinde KEY= şeklinde boş bırakılmış satırlar */
  emptyDefined: string[]
  snapshot: ServerEnvSnapshot
  /** Turbopack derleme zamanı sabitlemesi tespiti */
  compileTimeInlining: {
    dotNotationServiceKey: boolean
    bracketNotationServiceKey: boolean
    mismatch: boolean
  }
}

const REQUIRED_SERVER_KEYS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const

/**
 * process.env.KEY — Turbopack bazen build sırasında undefined ile değiştirir.
 * Bracket erişimi + loadEnvConfig ile runtime değerini güvenli okur.
 */
function readEnv(name: string): { value?: string; emptyDefined: boolean } {
  const fromDot = process.env[name]
  const fromBracket = (process.env as NodeJS.ProcessEnv)[name]
  const raw = fromDot ?? fromBracket
  if (raw === undefined) return { emptyDefined: false }
  if (typeof raw !== 'string') return { emptyDefined: false }
  const trimmed = raw.trim()
  if (trimmed.length === 0) return { value: undefined, emptyDefined: true }
  return { value: trimmed, emptyDefined: false }
}

function readEnvValue(name: string): string | undefined {
  return readEnv(name).value
}

function detectCompileInlining(): ServerEnvDiagnostics['compileTimeInlining'] {
  const dot = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const bracket = Boolean((process.env as NodeJS.ProcessEnv).SUPABASE_SERVICE_ROLE_KEY)
  return {
    dotNotationServiceKey: dot,
    bracketNotationServiceKey: bracket,
    mismatch: dot !== bracket,
  }
}

export function getServerEnvDiagnostics(): ServerEnvDiagnostics {
  loadDashboardEnv()

  const emptyDefined: string[] = []
  const pick = (key: string) => {
    const { value, emptyDefined: isEmpty } = readEnv(key)
    if (isEmpty) emptyDefined.push(key)
    return value
  }

  const snapshot: ServerEnvSnapshot = {
    supabaseUrl: pick('NEXT_PUBLIC_SUPABASE_URL'),
    supabaseAnonKey: pick('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    serviceRoleKey: pick('SUPABASE_SERVICE_ROLE_KEY'),
    adminEmails: pick('ADMIN_EMAILS'),
    cwd: process.cwd(),
    nodeEnv: process.env.NODE_ENV,
  }

  const missing = REQUIRED_SERVER_KEYS.filter((key) => !readEnvValue(key))

  return {
    ok: missing.length === 0,
    missing: [...missing],
    emptyDefined,
    snapshot,
    compileTimeInlining: detectCompileInlining(),
  }
}

export function getSupabaseUrl(): string | undefined {
  loadDashboardEnv()
  return readEnvValue('NEXT_PUBLIC_SUPABASE_URL')
}

export function getServiceRoleKey(): string | undefined {
  loadDashboardEnv()
  return readEnvValue('SUPABASE_SERVICE_ROLE_KEY')
}

export function isServerEnvConfigured(): boolean {
  return getServerEnvDiagnostics().ok
}

export function logServerEnvDiagnostics(context: string): ServerEnvDiagnostics {
  const diag = getServerEnvDiagnostics()

  if (diag.ok) {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[env] ${context}: Supabase service role yapılandırması tamam.`, {
        cwd: diag.snapshot.cwd,
        urlHost: diag.snapshot.supabaseUrl?.replace(/^https?:\/\//, '').split('.')[0],
        serviceKeyLength: diag.snapshot.serviceRoleKey?.length,
      })
    }
    return diag
  }

  console.error(`[env] ${context}: Eksik veya okunamayan çevre değişkenleri.`, {
    missing: diag.missing,
    emptyDefined: diag.emptyDefined,
    cwd: diag.snapshot.cwd,
    nodeEnv: diag.snapshot.nodeEnv,
    hasUrl: Boolean(diag.snapshot.supabaseUrl),
    hasServiceKey: Boolean(diag.snapshot.serviceRoleKey),
    urlLength: diag.snapshot.supabaseUrl?.length ?? 0,
    serviceKeyLength: diag.snapshot.serviceRoleKey?.length ?? 0,
    compileTimeInlining: diag.compileTimeInlining,
    hint: diag.emptyDefined.length
      ? `Bu anahtarlar .env.local içinde tanımlı ama değerleri BOŞ (ör. SUPABASE_SERVICE_ROLE_KEY=). Dosyayı kaydedin (Ctrl+S) ve service role anahtarını yapıştırın.`
      : 'dashboard/ içinde `npm run dev` çalıştırın. .env.local değiştiyse sunucuyu yeniden başlatın. Monorepo kökünden değil dashboard klasöründen başlatın.',
  })

  return diag
}
