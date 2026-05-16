import { unstable_noStore as noStore } from 'next/cache'

import type { DamageReportRow, DashboardStats, MapPlacePin, MapReportPin } from '@/lib/types'
import { createAdminClient, isAdminConfigured } from '@/lib/supabase-admin'

function logSupabaseError(context: string, error: { message: string; code?: string } | null) {
  if (error && process.env.NODE_ENV === 'development') {
    console.error(`[data] ${context}:`, error.message, error.code ?? '')
  }
}

export { isAdminConfigured }

export async function fetchDashboardStats(): Promise<DashboardStats> {
  noStore()
  const admin = createAdminClient()
  if (!admin) {
    return { placesCount: 0, reportsCount: 0, citiesCount: 0, criticalCount: 0 }
  }

  const [places, reports, cities, critical] = await Promise.all([
    admin.from('places').select('id', { count: 'exact', head: true }),
    admin.from('damage_reports').select('id', { count: 'exact', head: true }),
    admin.from('cities').select('id', { count: 'exact', head: true }),
    admin
      .from('damage_reports')
      .select('id', { count: 'exact', head: true })
      .eq('severity', 'kritik'),
  ])

  logSupabaseError('fetchDashboardStats/places', places.error)
  logSupabaseError('fetchDashboardStats/reports', reports.error)

  return {
    placesCount: places.count ?? 0,
    reportsCount: reports.count ?? 0,
    citiesCount: cities.count ?? 0,
    criticalCount: critical.count ?? 0,
  }
}

export async function fetchMapPlaces(limit = 500): Promise<MapPlacePin[]> {
  noStore()
  const admin = createAdminClient()
  if (!admin) return []

  const { data, error } = await admin
    .from('places')
    .select('id, name, category, lat, lng')
    .order('created_at', { ascending: false })
    .limit(limit)

  logSupabaseError('fetchMapPlaces', error)
  if (error || !data) return []

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
  }))
}

/**
 * Hasar raporları — places ile INNER JOIN yerine iki aşamalı sorgu.
 * Manuel eklenen veya geçersiz place_id'li kayıtlar elenmez; mekan yoksa pin atlanır.
 */
export async function fetchMapReports(limit = 300): Promise<MapReportPin[]> {
  noStore()
  const admin = createAdminClient()
  if (!admin) return []

  const { data: reports, error: reportsError } = await admin
    .from('damage_reports')
    .select('id, severity, place_id')
    .order('created_at', { ascending: false })
    .limit(limit)

  logSupabaseError('fetchMapReports/reports', reportsError)
  if (reportsError || !reports?.length) return []

  const placeIds = [...new Set(reports.map((r) => r.place_id).filter(Boolean))]
  if (placeIds.length === 0) return []

  const { data: places, error: placesError } = await admin
    .from('places')
    .select('id, name, lat, lng')
    .in('id', placeIds)

  logSupabaseError('fetchMapReports/places', placesError)

  const placeMap = new Map((places ?? []).map((p) => [p.id, p]))

  const pins: MapReportPin[] = []
  for (const r of reports) {
    const place = placeMap.get(r.place_id)
    if (!place || place.lat == null || place.lng == null) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(
          `[data] Rapor ${r.id} haritada gösterilemedi: place_id=${r.place_id} places tablosunda bulunamadı.`,
        )
      }
      continue
    }
    pins.push({
      id: r.id,
      lat: place.lat,
      lng: place.lng,
      severity: r.severity,
      placeName: place.name,
    })
  }

  return pins
}

/**
 * Admin tablosu — tüm damage_reports satırları (JOIN zorunlu değil).
 */
export async function fetchDamageReports(): Promise<DamageReportRow[]> {
  noStore()
  const admin = createAdminClient()
  if (!admin) return []

  const { data: reports, error } = await admin
    .from('damage_reports')
    .select('id, place_id, description, ai_analysis, severity, status, created_at, photo_url')
    .order('created_at', { ascending: false })

  logSupabaseError('fetchDamageReports', error)

  if (error) return []
  if (!reports?.length) return []

  const placeIds = [...new Set(reports.map((r) => r.place_id).filter(Boolean))]
  let placeMap = new Map<string, string>()

  if (placeIds.length > 0) {
    const { data: places, error: placesError } = await admin
      .from('places')
      .select('id, name')
      .in('id', placeIds)

    logSupabaseError('fetchDamageReports/places', placesError)
    placeMap = new Map((places ?? []).map((p) => [p.id, p.name]))
  }

  return reports.map((r) => ({
    id: r.id,
    place_id: r.place_id,
    place_name: placeMap.get(r.place_id) ?? `Mekan (${String(r.place_id).slice(0, 8)}…)`,
    description: r.description,
    ai_analysis: r.ai_analysis,
    severity: r.severity,
    status: r.status,
    created_at: r.created_at,
    photo_path: r.photo_url,
  }))
}
