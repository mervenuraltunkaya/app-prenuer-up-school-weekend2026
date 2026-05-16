# Nomad — OSM Seed

OpenStreetMap [Overpass API](https://wiki.openstreetmap.org/wiki/Overpass_API) üzerinden Türkiye'deki tarihi mekan ve müze verilerini çekip Supabase `places` tablosuna yazar.

## Önkoşullar

1. Supabase migration'ları uygulanmış olmalı (özellikle `20260516130000_v15_osm_upsert_indexes.sql`).
2. `SUPABASE_SERVICE_ROLE_KEY` — RLS'i bypass eder; **asla** repoya veya frontend'e eklemeyin.

## Kurulum

```bash
cd backend/seed
npm install
cp .env.example .env
# .env dosyasını doldurun
```

## Çalıştırma

```bash
# Önce kuru çalıştırma (DB'ye yazmaz)
DRY_RUN=true npm run seed:osm

# Gerçek seed
npm run seed:osm
```

## Ne yapar?

1. **81 il** kaydını `cities` tablosuna upsert eder (`name` + `country` unique).
2. Overpass sorgusu ile Türkiye sınırları içinde:
   - `node/way["historic"~"ruins|castle|monument"]`
   - `node/way["tourism"="museum"]`
3. Her kayıt için: isim, kategori (`muze`, `kale`, `arkeolojik`, `diger`, `cami`), koordinat.
4. En yakın il merkezine göre `city_id` atar.
5. `google_place_id` alanına `osm:node:123` / `osm:way:456` yazarak **upsert** eder.

## Süre

Turkiye geneli tek sorgu 2–5 dakika sürebilir; Overpass yoğunluğuna göre otomatik yeniden dener.
