import { DataConfigAlert } from '@/components/admin/data-config-alert'
import { StatsCards } from '@/components/home/stats-cards'
import { MapSection } from '@/components/map/map-section'
import {
  fetchDashboardStats,
  fetchMapPlaces,
  fetchMapReports,
  isAdminConfigured,
} from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const configured = isAdminConfigured()

  const [stats, places, reports] = await Promise.all([
    fetchDashboardStats(),
    fetchMapPlaces(400),
    fetchMapReports(200),
  ])

  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      <section className="space-y-4 text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brown">
          KEŞFET · KORU · YAŞAT
        </p>
        <h1 className="font-heading text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Türkiye&apos;nin tarihi mirası,
          <span className="text-crimson"> canlı</span> haritada.
        </h1>
        <p className="max-w-2xl text-base text-ink-muted">
          Nomad Dashboard; mekanları, hasar raporlarını ve şehir bazlı istatistikleri tek vitrinde
          sunar. Mobil uygulamayla aynı veri kaynağını kullanır.
        </p>
      </section>

      {!configured ? <DataConfigAlert /> : null}

      <MapSection places={places} reports={reports} />

      <section id="istatistikler" className="scroll-mt-24 space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-brown">Canlı veri</p>
          <h2 className="font-heading text-2xl font-semibold text-ink sm:text-3xl">
            İstatistikler
          </h2>
        </div>
        <StatsCards stats={stats} />
      </section>
    </div>
  )
}
