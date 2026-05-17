import { Lock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/96 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-8">
        <Link
          href="/"
          className="font-heading text-xl font-semibold tracking-tight text-cream">
          Nomad <span className="text-sand font-italic">[o]</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/#harita"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "font-dm-mono text-xs tracking-widest text-cream/50 hover:text-cream hover:bg-white/8 uppercase",
            )}>
            Keşfet
          </Link>
          <Link
            href="/#istatistikler"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "font-dm-mono text-xs tracking-widest text-cream/50 hover:text-cream hover:bg-white/8 uppercase",
            )}>
            Yönetim
          </Link>
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: "default" }),
              "ml-2 gap-1.5 rounded-full bg-crimson text-white hover:bg-crimson-dark font-dm-mono text-xs tracking-widest uppercase",
            )}>
            <Lock className="size-3.5" />
            Giriş Yap
          </Link>
        </nav>
      </div>
    </header>
  );
}

