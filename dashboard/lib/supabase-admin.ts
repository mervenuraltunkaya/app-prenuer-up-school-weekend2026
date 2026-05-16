import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { getServiceRoleKey, getSupabaseUrl, logServerEnvDiagnostics } from '@/lib/env.server'

let adminClient: SupabaseClient | null = null
let lastConfigKey: string | null = null

function configFingerprint(url: string, serviceKey: string): string {
  return `${url}|${serviceKey.length}`
}

export function isAdminConfigured(): boolean {
  const url = getSupabaseUrl()
  const serviceKey = getServiceRoleKey()
  return Boolean(url && serviceKey)
}

/** Sunucu tarafı vitrin ve admin listesi (service role — RLS bypass). */
export function createAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl()
  const serviceKey = getServiceRoleKey()

  if (!url || !serviceKey) {
    logServerEnvDiagnostics('supabase-admin.createAdminClient')
    return null
  }

  const fingerprint = configFingerprint(url, serviceKey)
  if (adminClient && lastConfigKey === fingerprint) {
    return adminClient
  }

  adminClient = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  lastConfigKey = fingerprint

  return adminClient
}
