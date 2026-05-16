import type { NextConfig } from 'next'
import path from 'path'
import { loadEnvConfig } from '@next/env'

// next.config değerlendirilirken dashboard/.env.local dosyasını yükle (monorepo güvenli)
loadEnvConfig(path.join(__dirname))

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/**' },
      { protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
    ],
  },
}

export default nextConfig
