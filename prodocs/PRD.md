# PRD — Nomad

**Versiyon:** 1.5  
**Tarih:** Mayıs 2026  
**Durum:** MVP tamamlandı; v1.5 genişletme devam ediyor  
**Değişiklikler:** v1.5 — OSM Overpass seed (81 il), i18n (TR/EN), platforma özel harita (web/native). v1.1 — React Native + Expo, Gemini API, Dashboard → v2.0

---

## 1. Ürün Özeti

Kullanıcıların şehir şehir turistik yerleri keşfetmesine, kişisel gezi rotaları oluşturmasına ve tarihi yapılardaki hasarları fotoğraflarla raporlamasına olanak tanıyan mobil + web uygulaması. Toplanan hasar verileri şeffaf bir public dashboard üzerinden kamuoyuyla ve yetkili kurumlarla paylaşılır (v2.0).

**Temel değer önerisi:**  
Turistik keşif deneyimini zenginleştirirken kültürel mirasın korunmasına vatandaş katılımıyla katkı sağlamak.

---

## 2. Hedef Kitle

| Segment | Tanım | Birincil İhtiyaç |
|---|---|---|
| Gezgin kullanıcı | Şehir turu yapan, yurt içi turist | Kolay keşif + rota planlama |
| Bilinçli vatandaş | Kültürel mirasa duyarlı kullanıcı | Hasar bildirme, takip etme |
| Yetkili kurum | Belediye, Kültür Bakanlığı | Toplu veri, hasar önceliklendir |

---

## 3. Problem Tanımı

- Turistler bir şehri gezerken hangi tarihi yerlere gideceğini bulmak için birden fazla uygulama kullanmak zorunda.
- Gezi rotaları genelde anlık kararlarla oluşturuluyor, önceden verimli planlanmıyor.
- Tarihi yapılardaki hasarlar vatandaşlar tarafından fark edilse bile bildirme mekanizması yok.
- Yetkili kurumlar saha denetimi yapmadan önce hasar bilgisine sistematik şekilde ulaşamıyor.

---

## 4. Çözüm

### 4.1 Mobil Uygulama (React Native + Expo)
Turistik keşif, rota oluşturma ve hasar raporlama için tek uygulama.

### 4.2 Public Dashboard (React/Next.js) — v2.0
Gelen hasar raporlarının şeffaf, herkesin görebileceği harita tabanlı takip paneli. MVP kapsamı dışında.

---

## 5. MVP Kapsamı

### MVP'ye Dahil (v1.0) — tamamlandı

#### Kimlik Doğrulama
- [x] Email + şifre ile kayıt / giriş
- [x] Supabase Auth entegrasyonu
- [x] Kullanıcı profili (isim, avatar)

#### Keşif Modülü
- [x] Şehir seçme ekranı
- [x] Harita üzerinde turistik mekan pinleri (Google Maps)
- [x] Mekan detay sayfası (isim, kategori, konum)
- [x] Wikipedia API ile kısa bilgi özeti
- [x] Kategori filtresi (cami, müze, kale, arkeolojik alan…)

#### Rota Modülü
- [x] Mekanları rotaya ekleme / çıkarma
- [x] Rota sırasını değiştirme
- [x] Rotayı kaydetme ve isimlendirme
- [x] Kaydedilmiş rotaları listeleme ve silme
- [x] Google Maps Directions ile tahmini süre

#### Hasar Raporlama Modülü
- [x] Mekan seçerek rapor oluşturma
- [x] Fotoğraf çekme veya galeriden seçme
- [x] Supabase Storage'a fotoğraf yükleme
- [x] Açıklama metin alanı
- [x] Gemini 2.5 Flash API ile otomatik hasar analizi ve şiddet tespiti (kritik / orta / hafif)
- [x] Kullanıcının kendi raporlarını listeleme

**Not:** MVP'de mekan verisi seed `places` tablosundan gelir; Google Places nearby search v2.0 veya sonraki iterasyona bırakıldı.

---

### v1.5 Kapsamı

#### Veri — OpenStreetMap (81 il)
- [x] `backend/seed/osm_fetcher.ts` — Overpass API ile Türkiye sınırları içinde tarihi mekan ve müze verisi
- [x] Sorgu: `historic` ~ ruins|castle|monument; `tourism=museum` (node + way)
- [x] Supabase Service Role ile `cities` (81 il) ve `places` upsert
- [x] Kategori eşlemesi: `muze`, `kale`, `arkeolojik`, `diger`, `cami`
- [x] Harici kimlik: `google_place_id` = `osm:{type}:{id}`

#### Frontend — Çoklu dil (TR / EN)
- [x] `react-i18next` + `expo-localization`
- [x] `frontend/locales/tr.json`, `en.json` — navigasyon ve temel UI
- [x] Cihaz sistem diline göre otomatik dil seçimi

#### Frontend — Platforma özel harita (Expo Web / Vercel)
- [x] `components/map/Map.native.tsx` — `react-native-maps` (iOS / Android)
- [x] `components/map/Map.web.tsx` — Google Maps iframe embed (web çökmez)
- [x] Uzantısız import: Metro `.native` / `.web` çözümlemesi

---

### MVP'ye Dahil Değil (v2.0 Roadmap)

- Public Dashboard — harita, istatistik, rapor takip paneli
- Belediye / kurum API entegrasyonu
- Sosyal özellikler, push notification, offline mod, ek dil paketleri (v1.5: TR/EN)
- Kullanıcılar arası rota paylaşımı, gamification
- Google Places nearby search (canlı mekan keşfi; v1.5'te OSM Overpass kullanılıyor)

---

## 6. Teknik Mimari

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| Mobil | React Native + Expo | Cross-platform, hızlı geliştirme |
| Backend | Supabase (BaaS) | Auth + DB + Storage |
| Sunucu işlemleri | Supabase Edge Functions | Gemini, Directions, Wikipedia proxy |
| Veritabanı | PostgreSQL | İlişkisel veri, RLS |
| Harita (mobil) | react-native-maps | Pinler ve bölge |
| Harita (web) | Google Maps iframe (`Map.web.tsx`) | Vercel / Expo Web uyumu |
| Mekan verisi | OSM Overpass + `backend/seed` | 81 il, kitle kaynaklı |
| i18n | react-i18next + expo-localization | TR / EN, sistem dili |
| AI analiz | Gemini 2.5 Flash | Vision, yapılandırılmış JSON çıktı |

### Veritabanı Tabloları

```
profiles        → id, full_name, avatar_url, created_at
cities          → id, name, country, lat, lng
places          → id, city_id, name, category, google_place_id, wiki_summary, lat, lng
routes          → id, user_id, title, description, is_public, created_at
route_places    → id, route_id, place_id, order_index
damage_reports  → id, user_id, place_id, photo_url, description, ai_analysis, severity, status, created_at
```

### Rapor durum akışı

```
bekliyor → incelendi → iletildi
```

---

## 7. Ekran Listesi

| Ekran | Açıklama |
|---|---|
| Giriş / Kayıt | Auth |
| Keşif (harita) | Şehir bağlamı, pinler, filtre |
| Mekan detayı | Bilgi, wiki, rota ekle |
| Rota oluşturma | Taslak, sıralama, kaydet |
| Rota listesi | Kayıtlı rotalar |
| Rapor oluşturma | Foto + açıklama + AI |
| Raporlarım | Kullanıcı raporları |
| Profil | İsim, avatar |

---

## 8. API (Edge Functions)

| Function | Metod | Açıklama |
|---|---|---|
| `places-wiki` | GET | Wikipedia özeti |
| `routes-directions` | GET | Google Directions proxy |
| `reports-analyze` | POST | Gemini hasar analizi |

CRUD: Supabase client SDK (JWT + RLS).

---

## 9. Başarı Kriterleri (Demo)

- [x] Kullanıcı kayıt olup giriş yapabiliyor
- [x] Haritada en az 3 şehir, her şehirde en az 5 mekan
- [x] Rota oluşturup kaydedebiliyor
- [x] Fotoğraf çekip hasar raporu gönderebiliyor
- [x] Gemini hasar şiddetini tespit ediyor
- [x] Kullanıcı kendi raporlarını listeleyebiliyor

---

## 10. Riskler

| Risk | Önlem |
|---|---|
| API kota | Wikipedia/seed cache; Directions yalnız rota ekranında |
| Gemini rate limit | Yalnız rapor gönderiminde |
| Expo maps uyumu | SDK 54 ile sabit paket sürümleri |
