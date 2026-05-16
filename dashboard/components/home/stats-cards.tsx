import { Landmark, MapPin, AlertTriangle, Building2 } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import type { DashboardStats } from '@/lib/types'

const items = [
  {
    key: 'placesCount' as const,
    label: 'Tarihi Mekan',
    icon: Landmark,
    accent: 'text-crimson',
    bg: 'bg-crimson/10',
  },
  {
    key: 'reportsCount' as const,
    label: 'Hasar Raporu',
    icon: AlertTriangle,
    accent: 'text-terracotta',
    bg: 'bg-terracotta/15',
  },
  {
    key: 'citiesCount' as const,
    label: 'Şehir',
    icon: Building2,
    accent: 'text-brown',
    bg: 'bg-sand/25',
  },
  {
    key: 'criticalCount' as const,
    label: 'Kritik Rapor',
    icon: MapPin,
    accent: 'text-crimson-dark',
    bg: 'bg-critical-bg',
  },
]

export function StatsCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ key, label, icon: Icon, accent, bg }) => (
        <Card
          key={key}
          className="overflow-hidden rounded-[20px] border-border bg-white shadow-sm transition-shadow hover:shadow-md">
          <CardContent className="flex items-start gap-4 p-5">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`size-5 ${accent}`} />
            </div>
            <div>
              <p className="font-heading text-3xl font-semibold text-ink">
                {stats[key].toLocaleString('tr-TR')}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wider text-brown">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
