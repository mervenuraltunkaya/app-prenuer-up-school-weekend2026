import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";

import { AdminSignOutButton } from "@/components/admin/sign-out-button";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-[calc(100vh-58px)] flex bg-surf">
      <aside className="w-56 flex-shrink-0 border-r border-bd bg-ink p-5 flex flex-col text-cream">
        <div className="mb-6 border-b border-white/10 pb-4">
          <div className="font-heading text-lg font-semibold text-cream">
            Nomad <span className="text-sand font-italic">[o]</span>
          </div>
          <div className="font-dm-mono text-xs text-sand/50 tracking-widest uppercase mt-1">
            Admin Panel
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="font-dm-mono text-xs text-sand/40 tracking-widest uppercase mb-4">Ana</div>
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-cream/60 hover:bg-white/10 hover:text-cream transition-all">
            <LayoutDashboard className="size-4" />
            Gösterge Paneli
          </Link>
          <Link
            href="/admin"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-cream hover:bg-white/10 transition-all">
            <LayoutDashboard className="size-4" />
            Hasar Raporları
          </Link>
        </nav>

        {user ? (
          <div className="border-t border-white/10 pt-4">
            <p className="truncate text-xs text-sand mb-2">{user.email}</p>
            <AdminSignOutButton />
          </div>
        ) : null}
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

