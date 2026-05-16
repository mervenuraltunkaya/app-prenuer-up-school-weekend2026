# Backend — Nomad

Supabase tabanlı backend: PostgreSQL şeması (migrations), Row Level Security ve Edge Functions.

## Klasör yapısı

```
backend/seed/          # OSM Overpass → Supabase (Node.js)
backend/supabase/
  migrations/          # Veritabanı şeması + seed
  functions/
    places-wiki/       # Wikipedia özeti (cache)
    routes-directions/ # Google Directions proxy
    reports-analyze/   # Gemini vision — hasar analizi
    _shared/           # CORS, auth yardımcıları
```

## Kurulum

1. [Supabase CLI](https://supabase.com/docs/guides/cli) kurun.
2. Proje kökünden bağlanın:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF --workdir backend/supabase
```

3. Migration uygulayın:

```bash
npx supabase db push --workdir backend/supabase
```

4. Edge Function secret’ları (Dashboard veya CLI):

| Secret | Açıklama |
|--------|----------|
| `GEMINI_API_KEY` | Hasar fotoğrafı analizi |
| `GEMINI_MODEL` | Opsiyonel (varsayılan: `gemini-2.5-flash`) |
| `GOOGLE_MAPS_API_KEY` | Directions API |

5. Fonksiyonları deploy edin:

```bash
npx supabase functions deploy places-wiki --workdir backend/supabase
npx supabase functions deploy routes-directions --workdir backend/supabase
npx supabase functions deploy reports-analyze --workdir backend/supabase
```

> `SUPABASE_URL`, `SUPABASE_ANON_KEY` ve `SUPABASE_SERVICE_ROLE_KEY` Edge runtime’da genelde otomatik sağlanır.

## API uçları

| Function | Metod | Açıklama |
|----------|-------|----------|
| `places-wiki` | GET | `?place_id=` — Wikipedia özeti |
| `routes-directions` | GET | `origin`, `destination`, `waypoints` |
| `reports-analyze` | POST | `{ image_base64, mime_type }` |

Tüm uçlar JWT (`Authorization: Bearer`) gerektirir. CRUD işlemleri frontend’den doğrudan Supabase client ile yapılır.

## OSM seed (v1.5)

81 il ve OpenStreetMap mekan verisi için [`seed/README.md`](seed/README.md).

```bash
cd backend/seed
npm install
cp .env.example .env
# SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY doldurun
npm run seed:osm
```

Migration `20260516130000_v15_osm_upsert_indexes.sql` uygulanmış olmalıdır.
