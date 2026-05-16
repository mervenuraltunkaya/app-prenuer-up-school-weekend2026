# Nomad Dashboard

Next.js vitrin ve admin paneli (App Router, Tailwind, shadcn/ui).

## Kurulum

```bash
cd dashboard
cp .env.example .env.local
# SUPABASE_SERVICE_ROLE_KEY ve ADMIN_EMAILS doldurun
npm install
npm run dev
```

http://localhost:3000

## Ortam değişkenleri

| Değişken | Açıklama |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase proje URL (mobil ile aynı) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (client auth) |
| `SUPABASE_SERVICE_ROLE_KEY` | Sunucu vitrin + admin listesi (gizli) |
| `ADMIN_EMAILS` | Admin e-postaları, virgülle ayrılmış (boş = tüm giriş yapanlar) |

## Sayfalar

- `/` — Türkiye haritası + canlı istatistikler
- `/admin/login` — Supabase Auth girişi
- `/admin` — Hasar raporları tablosu
- `/admin/reports/[id]` — Rapor detayı
