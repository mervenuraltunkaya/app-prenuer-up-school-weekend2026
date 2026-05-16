'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import type { MapPlacePin, MapReportPin } from '@/lib/types'

type Props = {
  places: MapPlacePin[]
  reports: MapReportPin[]
}

const TURKEY_CENTER: [number, number] = [39.0, 35.0]
const DEFAULT_ZOOM = 6

function FitTurkeyBounds() {
  const map = useMap()
  useEffect(() => {
    map.fitBounds(
      L.latLngBounds([
        [35.8, 25.9],
        [42.2, 44.8],
      ]),
      { padding: [24, 24] },
    )
  }, [map])
  return null
}

function severityColor(severity: MapReportPin['severity']) {
  if (severity === 'kritik') return '#A60321'
  if (severity === 'orta') return '#D9A577'
  if (severity === 'hafif') return '#065F46'
  return '#8C5C32'
}

export function TurkeyMap({ places, reports }: Props) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })
  }, [])

  const reportMarkers = useMemo(() => reports, [reports])
  const placeMarkers = useMemo(() => places.slice(0, 200), [places])

  return (
    <div className="h-[min(70vh,560px)] w-full overflow-hidden rounded-[20px] border border-border shadow-sm">
      <MapContainer
        center={TURKEY_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="h-full w-full z-0"
        style={{ background: '#F2E9D8' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitTurkeyBounds />

        {placeMarkers.map((p) => (
          <CircleMarker
            key={`place-${p.id}`}
            center={[p.lat, p.lng]}
            radius={6}
            pathOptions={{
              color: '#8C5C32',
              fillColor: '#D9A577',
              fillOpacity: 0.85,
              weight: 1,
            }}>
            <Popup>
              <div className="min-w-[140px]">
                <p className="text-xs font-medium uppercase tracking-wide text-brown">Mekan</p>
                <p className="font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-ink-muted capitalize">{p.category}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {reportMarkers.map((r) => (
          <CircleMarker
            key={`report-${r.id}`}
            center={[r.lat, r.lng]}
            radius={8}
            pathOptions={{
              color: severityColor(r.severity),
              fillColor: severityColor(r.severity),
              fillOpacity: 0.9,
              weight: 2,
            }}>
            <Popup>
              <div className="min-w-[160px]">
                <p className="text-xs font-medium uppercase tracking-wide text-crimson">Hasar raporu</p>
                <p className="font-semibold text-ink">{r.placeName}</p>
                {r.severity ? (
                  <p className="text-xs capitalize text-ink-muted">Şiddet: {r.severity}</p>
                ) : null}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
