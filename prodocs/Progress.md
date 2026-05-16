# Progress — Nomad

Geliştirme günlüğü: yapılan işler, alınan kararlar ve karşılaşılan sorunlar.

---

## 2026-05 — Proje başlangıcı

### Kararlar
- Flutter yerine **React Native + Expo** (ekibin JS/TS deneyimi, tek repo).
- Backend için ayrı Express sunucusu yerine **Supabase** (Auth + DB + Storage + Edge).
- Hasar analizi için **Gemini 2.5 Flash** (vision + ücretsiz katman).
- MVP’de mekan verisi: **seed SQL** (Places API sonraya).

### Yapılanlar
- Expo Router şablonu `frontend/` altında kuruldu.
- `nomad_PRD.md` yazıldı; MVP kapsamı ve 4 haftalık sprint tanımlandı.

---

## Hafta 1 — Altyapı

### Yapılanlar
- Supabase migration: `profiles`, `cities`, `places`, `routes`, `route_places`, `damage_reports`.
- RLS politikaları tüm tablolarda.
- Seed: 3 şehir, şehir başına 6 turistik mekan.
- Auth: kayıt, giriş, `AuthContext`, korumalı `(main)` grubu.
- `react-native-maps` + şehir seçim ekranı.

### Sorunlar
- Expo SDK 54 ile paket sürüm uyumu — `package.json` sabitlendi.
- İlk kurulumda `supabase/` klasörü repo kökündeydi; teslim için `backend/supabase/` yapısına taşındı.

---

## Hafta 2 — Keşif

### Yapılanlar
- `explore.tsx`: harita, pinler, kategori chip filtreleri.
- `place/[id].tsx`: detay, rota ekle CTA.
- Edge Function `places-wiki`: EN/TR Wikipedia araması, `wiki_summary` cache.
- Tema token'ları: `theme/colors.ts`, typography, spacing.

### Kararlar
- Wikipedia doğrudan mobilde değil; Edge üzerinden (tutarlı cache, ileride rate kontrolü).

---

## Hafta 3 — Rota

### Yapılanlar
- `RouteDraftContext`: taslak mekan listesi ve sıra.
- `route-builder.tsx`: ekle/çıkar, yukarı/aşağı, kaydet.
- `routes.tsx`: liste ve silme.
- Edge `routes-directions`: Google Directions proxy, tahmini süre metni.

### Sorunlar
- Directions API anahtarı Edge secret olarak tanımlanmalı (`GOOGLE_MAPS_API_KEY`); unutulursa 500 döner.

---

## Hafta 4 — Hasar raporu + MVP kapanış

### Yapılanlar
- Storage: `avatars`, `damage-photos` bucket + politikalar.
- `report/new.tsx`: image picker, açıklama validasyonu, upload, Gemini analiz, DB insert.
- Edge `reports-analyze`: yapılandırılmış JSON prompt (`severity`, `analysis_tr`).
- `reports.tsx`: kullanıcı raporları, severity ve status badge'leri.
- Profil: isim + avatar yükleme.

### Kararlar
- AI analiz rapor gönderiminde zorunlu; kullanıcı sonucu gönderim öncesi/sonrası alert ile görür.
- Public dashboard v2.0’a ertelendi.

---

## 2026-05-16 — Bitirme teslim yapısı

### Yapılanlar
- Repo brief’e uygun hale getirildi:
  - `backend/supabase/` (eski `supabase/`)
  - `prodocs/`: PRD, tech-stack, Plan, DesignSystem, Progress
  - Kök `.gitignore`, `.env.example`, güncel `README.md`
- `frontend/.env` git takibinden çıkarılacak şekilde `.gitignore` güncellendi.

### 2026-05-16 — v1.5 Aşama 2 (OSM seed)

- `backend/seed/osm_fetcher.ts`: Overpass → 81 il `cities` + `places` upsert (Service Role).
- Migration: `places.google_place_id` ve `cities (name, country)` unique indeksleri.
- PRD v1.5: OSM, i18n, platform harita maddeleri eklendi.

### Yapılacaklar (teslim öncesi)
- [ ] Migration `20260516130000_v15_osm_upsert_indexes.sql` + `npm run seed:osm`
- [ ] Supabase migration + Edge deploy (production)
- [ ] `frontend/.env` doldur, canlı web URL
- [ ] Demo videosu (max 5 dk) + teslim formu
- [ ] API anahtarları rotate (eğer `.env` daha önce push edildiyse)

---

## Hata / öğrenim notları

| Konu | Çözüm |
|------|--------|
| Edge 401 | İstekte `Authorization: Bearer` + `apikey` header |
| Gemini JSON parse | Prompt’ta “yalnızca JSON” kuralı; markdown strip |
| Harita web’de | `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` veya provider fallback |
| RLS insert fail | `user_id` = `auth.uid()` kontrolü |
