import { AlertTriangle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'

export function DataConfigAlert() {
  return (
    <Card className="rounded-[20px] border-critical-text/30 bg-critical-bg">
      <CardContent className="flex gap-3 p-5 text-sm text-critical-text">
        <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        <div>
          <p className="font-medium">Supabase service role yapılandırılmamış</p>
          <p className="mt-1 opacity-90">
            <code className="rounded bg-white/50 px-1">dashboard/.env.local</code> dosyasına{' '}
            <code className="rounded bg-white/50 px-1">SUPABASE_SERVICE_ROLE_KEY</code> ekleyin ve
            geliştirme sunucusunu yeniden başlatın. Hasar raporları RLS nedeniyle anon key ile
            listelenemez.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
