import Link from 'next/link'
import { LayoutDashboard, Shield } from 'lucide-react'

import { AdminSignOutButton } from '@/components/admin/sign-out-button'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <aside className="w-full shrink-0 rounded-[20px] border border-border bg-ink p-5 text-cream lg:w-56">
          <div className="mb-6 flex items-center gap-2">
            <Shield className="size-5 text-sand" />
            <span className="font-heading text-lg font-semibold">Admin</span>
          </div>
          <nav className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-white/10">
              <LayoutDashboard className="size-4" />
              Raporlar
            </Link>
          </nav>
          {user ? (
            <div className="mt-8 border-t border-white/10 pt-4">
              <p className="truncate text-xs text-sand">{user.email}</p>
              <AdminSignOutButton />
            </div>
          ) : null}
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  )
}
