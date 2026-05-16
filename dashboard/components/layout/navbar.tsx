import { Map, BarChart3 } from 'lucide-react'

import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-2xl font-semibold tracking-tight text-ink">
          Nomad
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/#harita"
            className={cn(buttonVariants({ variant: 'ghost' }), 'text-ink-muted hover:text-ink gap-2')}>
            <Map className="size-4" />
            <span className="hidden sm:inline">Harita</span>
          </Link>
          <Link
            href="/#istatistikler"
            className={cn(buttonVariants({ variant: 'ghost' }), 'text-ink-muted hover:text-ink gap-2')}>
            <BarChart3 className="size-4" />
            <span className="hidden sm:inline">İstatistikler</span>
          </Link>
          <Link
            href="/admin/login"
            className={cn(
              buttonVariants({ variant: 'default' }),
              'ml-1 rounded-full bg-crimson text-white hover:bg-crimson-dark',
            )}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  )
}
