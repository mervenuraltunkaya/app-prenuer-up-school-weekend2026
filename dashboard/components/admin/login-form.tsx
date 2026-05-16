'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase'

export function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const unauthorized = searchParams.get('error') === 'unauthorized'

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }

    const redirect = searchParams.get('redirect') ?? '/admin'
    router.push(redirect)
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md rounded-[20px] border-border bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="font-heading text-2xl text-ink">Admin Girişi</CardTitle>
        <CardDescription className="text-ink-muted">
          Nomad yönetim paneline erişmek için oturum açın.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {unauthorized ? (
            <p className="rounded-lg bg-critical-bg px-3 py-2 text-sm text-critical-text">
              Bu hesabın admin yetkisi yok.
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg bg-critical-bg px-3 py-2 text-sm text-critical-text">{error}</p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-full"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-full"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full bg-crimson hover:bg-crimson-dark"
            disabled={loading}>
            {loading ? 'Giriş yapılıyor…' : 'Giriş yap'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
