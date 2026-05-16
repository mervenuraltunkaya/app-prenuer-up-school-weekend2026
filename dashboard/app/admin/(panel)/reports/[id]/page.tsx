import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createAdminClient } from '@/lib/supabase-admin'
import type { DamageSeverity, ReportStatus } from '@/lib/types'

const STATUS_LABEL: Record<ReportStatus, string> = {
  bekliyor: 'Bekliyor',
  incelendi: 'İncelendi',
  iletildi: 'İletildi',
}

const SEVERITY_LABEL: Record<DamageSeverity, string> = {
  kritik: 'Kritik',
  orta: 'Orta',
  hafif: 'Hafif',
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ReportDetailPage({ params }: PageProps) {
  const { id } = await params
  const admin = createAdminClient()
  if (!admin) notFound()

  const { data: report } = await admin
    .from('damage_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (!report) notFound()

  const { data: place } = await admin.from('places').select('name, category').eq('id', report.place_id).maybeSingle()

  const { data: signed } = await admin.storage
    .from('damage-photos')
    .createSignedUrl(report.photo_url, 3600)

  const photoUrl = signed?.signedUrl ?? null

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className={cn(buttonVariants({ variant: 'ghost' }), '-ml-2 rounded-full inline-flex items-center')}>
        <ArrowLeft className="mr-2 size-4" />
        Raporlara dön
      </Link>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden rounded-[20px] border-border">
          <CardHeader>
            <CardTitle className="font-heading text-xl">{place?.name ?? 'Mekan'}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{STATUS_LABEL[report.status as ReportStatus]}</Badge>
              {report.severity ? (
                <Badge variant="outline">{SEVERITY_LABEL[report.severity as DamageSeverity]}</Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink-muted">
            <p>
              <span className="font-medium text-brown">Tarih: </span>
              {new Date(report.created_at).toLocaleString('tr-TR')}
            </p>
            <div>
              <p className="mb-1 font-medium text-brown">Açıklama</p>
              <p className="text-ink">{report.description ?? '—'}</p>
            </div>
            <div>
              <p className="mb-1 font-medium text-brown">Gemini AI analizi</p>
              <p className="text-ink">{report.ai_analysis ?? '—'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-[20px] border-border">
          <CardContent className="p-0">
            {photoUrl ? (
              <div className="relative aspect-[4/3] w-full bg-cream">
                <Image src={photoUrl} alt="Hasar fotoğrafı" fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center bg-cream text-brown">
                Fotoğraf yüklenemedi
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
