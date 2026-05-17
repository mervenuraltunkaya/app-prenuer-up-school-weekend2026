import { DataConfigAlert } from "@/components/admin/data-config-alert";
import { HeroSection } from "@/components/home/hero-section";
import { PublicStatsCards } from "@/components/home/public-stats-cards";
import { InteractiveMapSection } from "@/components/map/interactive-map-section";
import {
  fetchDashboardStats,
  fetchMapPlaces,
  fetchMapReports,
  isAdminConfigured,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const configured = isAdminConfigured();

  const [stats, places, reports] = await Promise.all([
    fetchDashboardStats(),
    fetchMapPlaces(400),
    fetchMapReports(200),
  ]);

  return (
    <div className="min-h-screen bg-cream">
      <HeroSection />

      {!configured ? <DataConfigAlert /> : null}

      <PublicStatsCards stats={stats} />

      <InteractiveMapSection places={places} reports={reports} />
    </div>
  );
}
