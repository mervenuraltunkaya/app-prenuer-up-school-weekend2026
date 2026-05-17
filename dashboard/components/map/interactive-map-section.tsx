'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import type { MapPlacePin, MapReportPin } from '@/lib/types'

type PlacePinWithType = MapPlacePin & { type: 'place' }
type ReportPinWithType = MapReportPin & { type: 'report' }
type PopupPin = PlacePinWithType | ReportPinWithType

export function InteractiveMapSection({
  places,
  reports,
}: {
  places: MapPlacePin[]
  reports: MapReportPin[]
}) {
  const [popup, setPopup] = useState<PopupPin | null>(null)
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

  const handlePinClick = (
    pin: MapPlacePin | MapReportPin,
    type: 'place' | 'report',
    e: React.MouseEvent
  ) => {
    e.stopPropagation()

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      const pinRect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      let x = pinRect.left - rect.left - 130
      let y = pinRect.top - rect.top - 200

      x = Math.max(8, Math.min(x, rect.width - 278))
      y = Math.max(8, Math.min(y, rect.height - 250))

      setPopupPos({ x, y })
    }

    setPopup({ ...pin, type } as PopupPin)
  }

  const closePopup = () => setPopup(null)

  const handleMapClick = (e: React.MouseEvent) => {
    if (e.target === mapRef.current) {
      closePopup()
    }
  }

  return (
    <section className="bg-cream px-8 py-12 sm:px-0">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-dm-mono text-xs tracking-widest text-brown">Canlı vitrin</p>
            <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
              Mekan & Hasar Haritası
            </h2>
          </div>
          <div className="font-dm-mono text-xs text-brown flex items-center gap-2">
            <span>Pine tıkla → detay</span>
          </div>
        </div>

        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="relative h-96 rounded-[20px] border border-bd bg-cream-d overflow-hidden">
          {/* Grid background */}
          <div className="nomad-map-grid"></div>

          {/* Map elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Roads */}
            <div className="absolute left-0 right-0 h-1.5 bg-white/55" style={{ top: '38%' }}></div>
            <div
              className="absolute left-0 right-0 h-1 bg-white/27 opacity-50"
              style={{ top: '62%' }}></div>
            <div className="absolute top-0 bottom-0 w-1.5 bg-white/55" style={{ left: '28%' }}></div>
            <div className="absolute top-0 bottom-0 w-1 bg-white/60 opacity-60" style={{ left: '55%' }}></div>
            <div className="absolute top-0 bottom-0 w-1 bg-white/40 opacity-40" style={{ left: '75%' }}></div>

            {/* Water */}
            <div
              className="absolute left-0 right-0 bg-blue-200/35"
              style={{ bottom: '10%', height: '80px' }}></div>

            {/* Parks */}
            <div
              className="absolute rounded-md bg-green-200/25"
              style={{ top: '15%', left: '60%', width: '100px', height: '70px' }}></div>
            <div
              className="absolute rounded-md bg-green-200/25"
              style={{ top: '55%', left: '10%', width: '80px', height: '50px' }}></div>

            {/* Place pins (sand color) */}
            {places.map((place) => (
              <MapPin
                key={place.id}
                place={place}
                type="place"
                onClick={(e) => handlePinClick(place, 'place', e)}
              />
            ))}

            {/* Report pins (crimson color) */}
            {reports.map((report) => (
              <MapPin
                key={report.id}
                place={report}
                type="report"
                onClick={(e) => handlePinClick(report, 'report', e)}
              />
            ))}

            {/* Legend */}
            <div
              className="absolute bottom-3.5 left-3.5 flex gap-3.5 rounded-xl bg-white/92 p-2.5 font-dm-mono text-xs text-ink3 backdrop-blur-sm border border-bd"
              style={{ backdropFilter: 'blur(6px)' }}>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-crimson"></div>
                Hasar raporu
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-sand"></div>
                Normal
              </div>
              <div className="flex items-center gap-1.5">
                <div className="size-2.5 rounded-full bg-brown"></div>
                İzleniyor
              </div>
            </div>
          </div>

          {/* Popup */}
          {popup && (
            <MapPopup
              pin={popup}
              x={popupPos.x}
              y={popupPos.y}
              onClose={closePopup}
            />
          )}
        </div>
      </div>
    </section>
  )
}

function MapPin({
  place,
  type,
  onClick,
}: {
  place: MapPlacePin | MapReportPin
  type: 'place' | 'report'
  onClick: (e: React.MouseEvent) => void
}) {
  const isReport = type === 'report'
  const lat = place.lat || 0
  const lng = place.lng || 0

  // Convert lat/lng to percentages (rough mapping for demo)
  const left = ((lng + 180) / 360) * 100
  const top = ((90 - lat) / 180) * 100

  const bubbleClass = isReport ? 'bg-crimson' : 'bg-sand'
  const displayName = 'name' in place ? place.name : (place as MapReportPin).placeName

  return (
    <button
      onClick={onClick}
      className="absolute z-10 -translate-x-1/2 -translate-y-full cursor-pointer transition-transform hover:scale-125"
      style={{ left: `${left}%`, top: `${top}%` }}>
      <div
        className={`flex size-8 items-center justify-center rounded-full border-2 border-white shadow-lg ${bubbleClass}`}
        style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }}>
        <span className="text-white text-xs" style={{ transform: 'rotate(45deg)' }}>
          ▼
        </span>
      </div>
      <div className="font-dm-mono text-xs text-ink mt-1 whitespace-nowrap">
        {displayName}
      </div>
    </button>
  )
}

function MapPopup({
  pin,
  x,
  y,
  onClose,
}: {
  pin: PopupPin
  x: number
  y: number
  onClose: () => void
}) {
  const isReport = pin.type === 'report'

  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    kritik: { bg: '#FEE2E2', text: '#7A0118', label: 'Aktif hasar raporu' },
    orta: { bg: '#FEF3C7', text: '#7C5C00', label: 'İnceleme altında' },
    hafif: { bg: '#ECFDF5', text: '#065F46', label: 'Sağlıklı durum' },
  }

  const severity = isReport ? (pin as ReportPinWithType).severity || 'hafif' : 'hafif'
  const status = statusMap[severity || 'hafif'] || statusMap.hafif
  const displayName = isReport ? (pin as ReportPinWithType).placeName : (pin as PlacePinWithType).name
  const category = isReport ? 'Hasar Raporu' : (pin as PlacePinWithType).category || 'Mekan'

  return (
    <div
      className="absolute z-50 w-64 rounded-2xl border border-bdm bg-white shadow-2xl overflow-hidden animate-pop-in"
      style={{ left: `${x}px`, top: `${y}px` }}>
      {/* Image */}
      <div className="relative h-28 overflow-hidden bg-cream">
        <div className="nomad-popup-img-grid"></div>
        <div className="absolute inset-0 flex items-center justify-center font-heading text-3xl text-brown/20">
          [ ◈ ]
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="font-dm-mono text-xs text-crimson tracking-widest uppercase mb-1">
          {category}
        </div>
        <div className="font-heading text-base font-medium text-ink mb-1">
          {displayName}
        </div>

        {/* Status badge */}
        <div
          className="inline-flex items-center gap-1 font-dm-mono text-xs tracking-wider uppercase px-2.5 py-1 rounded-full"
          style={{ backgroundColor: status.bg, color: status.text }}>
          <span
            className="inline-block size-1.5 rounded-full"
            style={{ backgroundColor: status.text, opacity: 0.7 }}></span>
          {status.label}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 flex size-6 items-center justify-center rounded-full bg-white/90 border border-bd text-ink3 hover:bg-white cursor-pointer">
        <X className="size-3" />
      </button>
    </div>
  )
}
