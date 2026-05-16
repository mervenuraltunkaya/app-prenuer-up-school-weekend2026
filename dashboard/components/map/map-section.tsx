'use client'

import dynamic from 'next/dynamic'

import { Skeleton } from '@/components/ui/skeleton'
import type { MapPlacePin, MapReportPin } from '@/lib/types'

const TurkeyMap = dynamic(() => import('@/components/map/turkey-map').then((m) => m.TurkeyMap), {
  ssr: false,
  loading: () => <Skeleton className="h-[min(70vh,560px)] w-full rounded-[20px]" />,
})

type Props = {
  places: MapPlacePin[]
  reports: MapReportPin[]
}

export function MapSection({ places, reports }: Props) {
  return (
    <section id="harita" className="scroll-mt-24 space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-brown">Canlı vitrin</p>
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">Türkiye Haritası</h2>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-sand ring-1 ring-brown/30" />
            Popüler mekanlar
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-crimson ring-1 ring-crimson-dark/30" />
            Hasar raporları
          </span>
        </div>
      </div>
      <TurkeyMap places={places} reports={reports} />
    </section>
  )
}
