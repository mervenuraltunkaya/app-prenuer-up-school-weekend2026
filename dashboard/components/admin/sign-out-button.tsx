'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase'

export function AdminSignOutButton() {
  const router = useRouter()

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-2 w-full justify-start gap-2 rounded-xl text-cream hover:bg-white/10 hover:text-white"
      onClick={signOut}>
      <LogOut className="size-4" />
      Çıkış yap
    </Button>
  )
}
