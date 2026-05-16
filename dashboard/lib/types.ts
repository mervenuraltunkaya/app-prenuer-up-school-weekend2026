export type ReportStatus = 'bekliyor' | 'incelendi' | 'iletildi'
export type DamageSeverity = 'kritik' | 'orta' | 'hafif'

export type MapReportPin = {
  id: string
  lat: number
  lng: number
  severity: DamageSeverity | null
  placeName: string
}

export type MapPlacePin = {
  id: string
  lat: number
  lng: number
  name: string
  category: string
}

export type DashboardStats = {
  placesCount: number
  reportsCount: number
  citiesCount: number
  criticalCount: number
}

export type DamageReportRow = {
  id: string
  place_id: string
  place_name: string
  description: string | null
  ai_analysis: string | null
  severity: DamageSeverity | null
  status: ReportStatus
  created_at: string
  photo_path: string
}
