import { Suspense } from 'react'

import { AdminLoginForm } from '@/components/admin/login-form'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Suspense fallback={<p className="text-ink-muted">Yükleniyor…</p>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
