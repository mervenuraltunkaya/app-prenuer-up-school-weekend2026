import { DataConfigAlert } from '@/components/admin/data-config-alert'
import { ReportsTable } from '@/components/admin/reports-table'
import { fetchDamageReports, isAdminConfigured } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AdminReportsPage() {
  if (!isAdminConfigured()) {
    return <DataConfigAlert />
  }

  const reports = await fetchDamageReports()

  return <ReportsTable data={reports} />
}
