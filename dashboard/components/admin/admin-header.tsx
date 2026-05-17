import { Clock } from 'lucide-react'

export function AdminHeader() {
  const now = new Date()
  const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fade-in">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-ink">Hasar Raporları</h1>
          <p className="mt-1 text-sm text-ink-muted">Vatandaş bildirimleri ve AI analizleri</p>
        </div>
        <div className="font-dm-mono text-xs text-brown bg-white border border-bd rounded-full px-3.5 py-1.5 flex items-center gap-2">
          <Clock className="size-3" />
          Son güncelleme: {timeStr}
        </div>
      </div>
    </div>
  )
}
