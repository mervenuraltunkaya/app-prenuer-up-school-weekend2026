'use client'

import { MapPin, Flag, AlertTriangle, Building2 } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

export function PublicStatsCards({ stats }: { stats: DashboardStats }) {
  const items = [
    {
      key: 'placesCount' as const,
      label: 'Kayıtlı Mekan',
      icon: MapPin,
      color: 'bg-crimson',
      value: stats.placesCount,
      delta: '+48 bu ay eklendi',
      deltaClass: 'up',
    },
    {
      key: 'reportsCount' as const,
      label: 'Aktif Rapor',
      icon: Flag,
      color: 'bg-crimson',
      value: stats.reportsCount,
      delta: '38 bekliyor · inceleme bekliyor',
      deltaClass: 'warn',
    },
    {
      key: 'criticalCount' as const,
      label: 'Kritik Hasar',
      icon: AlertTriangle,
      color: 'bg-crimson-dark',
      value: stats.criticalCount,
      delta: 'Öncelikli müdahale gerekiyor',
      deltaClass: 'warn',
    },
    {
      key: 'citiesCount' as const,
      label: 'Kapsanan Şehir',
      icon: Building2,
      color: 'bg-brown',
      value: stats.citiesCount,
      delta: '↑ İzmir bu ay eklendi',
      deltaClass: 'up',
    },
  ]

  return (
    <div className="bg-cream px-8 py-6 sm:px-0">
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.key}
              className="rounded-[16px] border border-bd bg-white p-5 transition-all hover:border-bdm hover:shadow-sm">
              <div className="flex items-center gap-2 font-dm-mono text-xs uppercase tracking-widest text-brown">
                <Icon className="size-3.5" />
                {item.label}
              </div>
              <div className="mt-3 font-dm-mono text-2xl font-medium text-crimson">
                {item.value.toLocaleString('tr-TR')}
              </div>
              <div
                className={`mt-1 font-dm-mono text-xs tracking-wider ${
                  item.deltaClass === 'up' ? 'text-green-700' : 'text-crimson'
                }`}>
                {item.delta}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
