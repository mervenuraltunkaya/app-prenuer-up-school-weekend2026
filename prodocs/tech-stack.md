# Tech Stack — Nomad

## Özet

| Katman | Teknoloji |
|--------|-----------|
| Frontend | React Native 0.81, Expo SDK 54, Expo Router 6, TypeScript |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions / Deno) |
| AI (ürün) | Google Gemini 2.5 Flash (vision) |
| Harita | react-native-maps, Google Maps SDK / Directions API |
| Dış API | Wikipedia REST (ücretsiz) |

---

## Frontend seçimleri

### React Native + Expo
- **Gerekçe:** Tek kod tabanı ile iOS, Android ve web; bootcamp süresinde hızlı iterasyon.
- **Expo Router:** Dosya tabanlı navigasyon; `(auth)` / `(main)` grupları ile korumalı rotalar.
- **TypeScript:** Tip güvenliği, Supabase ve API yanıtlarında daha az runtime hatası.

### Durum yönetimi
- `AuthContext`, `CityContext`, `RouteDraftContext` — global oturum, şehir ve rota tasarımı.
- Supabase Realtime MVP'de kullanılmadı; basit `useEffect` + client sorguları yeterli.

### Tema
- `frontend/theme/` — renk, tipografi, spacing, radius token'ları.
- Kurallar: `prodocs/DesignSystem.md` (uygulama: Playfair Display + DM Sans).

---

## Backend seçimleri

### Supabase (BaaS)
- **Gerekçe:** Auth, PostgreSQL, Storage ve sunucusuz fonksiyonlar tek platformda; ayrı Node sunucusu yazmaya gerek kalmaz.
- **RLS:** Her tabloda Row Level Security; kullanıcı yalnız kendi rotalarını ve raporlarını yazar/okur.
- **Migration:** `backend/supabase/migrations/` — tekrarlanabilir şema + seed (3 şehir, 18 mekan).

### Edge Functions (Deno)
- Gizli anahtarlar (`GEMINI_API_KEY`, `GOOGLE_MAPS_API_KEY`) yalnız sunucuda.
- JWT doğrulama (`_shared/auth.ts`) — anonim çağrı engellenir.
- CORS başlıkları — Expo web ve mobil istemciler için.

| Function | Dış servis | Amaç |
|----------|------------|------|
| `reports-analyze` | Gemini | Fotoğraftan hasar şiddeti + Türkçe açıklama |
| `routes-directions` | Google Directions | Rota süre/mesafe özeti |
| `places-wiki` | Wikipedia | Mekan özeti + DB cache |

---

## Neden Gemini?
- Vision desteği; yapılandırılmış JSON prompt ile `kritik | orta | hafif` enum.
- Bootcamp için erişilebilir ücretsiz katman; hasar raporu gönderiminde tetiklenir (düşük hacim).

## Neden seed data yerine Google Places (MVP)?
- Zaman ve kota riski; demo için İstanbul, Ankara, İzmir'de elle doğrulanmış mekanlar yeterli.
- v2.0'da Places API + cache planlandı.

---

## Geliştirme sürecinde AI kullanımı

### Cursor / ajan destekli geliştirme
- **PRD ve plan:** `prodocs/PRD.md`, `prodocs/Plan.md` — ajanlara bağlam vermek için `prodocs/` klasörü.
- **Kod üretimi:** Ekranlar, migration SQL, Edge Function iskeletleri Cursor ile üretildi; RLS ve auth kuralları manuel doğrulandı.
- **Tasarım:** `DesignSystem.md` token'ları `frontend/theme/` ile hizalandı.

### Ürün içi AI (son kullanıcı)
- Hasar raporu akışı: fotoğraf → `reports-analyze` → `severity` + `ai_analysis` → `damage_reports` kaydı.
- Demo videosunda bu adım canlı gösterilmelidir.

### AI kullanılmayan alanlar
- Auth, CRUD, harita pinleri — deterministik Supabase sorguları.
- Wikipedia özeti — kural tabanlı REST, LLM değil.

---

## Ortam değişkenleri

Bkz. kök [`.env.example`](../.env.example).

---

## Bilinen sınırlamalar

- Public dashboard yok (v2.0).
- Mekan verisi statik seed.
- Edge Function deploy ve Supabase secret'ları manuel yapılandırma gerektirir.
