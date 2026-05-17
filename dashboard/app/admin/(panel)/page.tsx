import { DataConfigAlert } from "@/components/admin/data-config-alert";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminStats } from "@/components/admin/admin-stats";
import { ReportsTable } from "@/components/admin/reports-table";
import {
  fetchDamageReports,
  fetchDashboardStats,
  isAdminConfigured,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  if (!isAdminConfigured()) {
    return <DataConfigAlert />;
  }

  const [reports, stats] = await Promise.all([
    fetchDamageReports(),
    fetchDashboardStats(),
  ]);

  return (
    <div className="space-y-6">
      <AdminHeader />
      <AdminStats stats={stats} />
      <ReportsTable data={reports} />
    </div>
  );
}

