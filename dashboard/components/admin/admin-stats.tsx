import { Inbox, AlertCircle, Clock, CheckCircle } from 'lucide-react'
import type { DashboardStats } from '@/lib/types'

export function AdminStats({ stats }: { stats: DashboardStats }) {
  return (
    <div className="fade-in grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border border-bd bg-white p-3.5">
        <div className="font-dm-mono text-xs text-brown tracking-widest uppercase flex items-center gap-2 mb-2">
          <Inbox className="size-3" />
          Toplam
        </div>
        <div className="font-dm-mono text-xl font-medium text-crimson">
          {stats.reportsCount}
        </div>
      </div>

      <div className="rounded-lg border border-bd bg-white p-3.5">
        <div className="font-dm-mono text-xs text-brown tracking-widest uppercase flex items-center gap-2 mb-2">
          <AlertCircle className="size-3" style={{ color: '#7A0118' }} />
          Kritik
        </div>
        <div className="font-dm-mono text-xl font-medium" style={{ color: '#7A0118' }}>
          {stats.criticalCount}
        </div>
      </div>

      <div className="rounded-lg border border-bd bg-white p-3.5">
        <div className="font-dm-mono text-xs text-brown tracking-widest uppercase flex items-center gap-2 mb-2">
          <Clock className="size-3" />
          Bekliyor
        </div>
        <div className="font-dm-mono text-xl font-medium text-brown">
          38
        </div>
      </div>

      <div className="rounded-lg border border-bd bg-white p-3.5">
        <div className="font-dm-mono text-xs text-brown tracking-widest uppercase flex items-center gap-2 mb-2">
          <CheckCircle className="size-3" style={{ color: '#065F46' }} />
          İletildi
        </div>
        <div className="font-dm-mono text-xl font-medium" style={{ color: '#065F46' }}>
          197
        </div>
      </div>
    </div>
  )
}
