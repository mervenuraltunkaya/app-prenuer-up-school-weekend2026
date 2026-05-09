# PRD — Nomad

**Versiyon:** 1.1  
**Tarih:** Mayıs 2026  
**Durum:** MVP geliştirme aşaması  
**Değişiklikler:** Flutter → React Native + Expo, Claude API → Gemini 2.5 Flash API, Dashboard → v2.0'a taşındı

---

## 1. Ürün Özeti

Kullanıcıların şehir şehir turistik yerleri keşfetmesine, kişisel gezi rotaları oluşturmasına ve tarihi yapılardaki hasarları fotoğraflarla raporlamasına olanak tanıyan mobil + web uygulaması. Toplanan hasar verileri şeffaf bir public dashboard üzerinden kamuoyuyla ve yetkili kurumlarla paylaşılır.

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
Gelen hasar raporlarının şeffaf, herkesin görebileceği harita tabanlı takip paneli. MVP kapsamı dışında, v2.0'da geliştirilecek.

---

## 5. MVP Kapsamı

### ✅ MVP'ye Dahil (v1.0)

#### Kimlik Doğrulama
- [ ] Email + şifre ile kayıt / giriş
- [ ] Supabase Auth entegrasyonu
- [ ] Kullanıcı profili (isim, avatar)

#### Keşif Modülü
- [ ] Şehir seçme ekranı
- [ ] Harita üzerinde turistik mekan pinleri (Google Maps)
- [ ] Mekan detay sayfası (isim, kategori, konum)
- [ ] Wikipedia API ile kısa bilgi özeti
- [ ] Kategori filtresi (cami, müze, kale, arkeolojik alan…)

#### Rota Modülü
- [ ] Mekanları rotaya ekleme / çıkarma
- [ ] Rota sırasını değiştirme
- [ ] Rotayı kaydetme ve isimlendirme
- [ ] Kaydedilmiş rotaları listeleme ve silme
- [ ] Google Maps Directions ile tahmini süre

#### Hasar Raporlama Modülü
- [ ] Mekan seçerek rapor oluşturma
- [ ] Fotoğraf çekme veya galeriden seçme
- [ ] Supabase Storage'a fotoğraf yükleme
- [ ] Açıklama metin alanı
- [ ] Gemini 2.5 Flash API ile otomatik hasar analizi ve şiddet tespiti (kritik / orta / hafif)
- [ ] Kullanıcının kendi raporlarını listeleme

---

### ❌ MVP'ye Dahil Değil (v2.0 Roadmap)

- **Public Dashboard** — harita, istatistik, rapor takip paneli
- Belediye / kurum API entegrasyonu (otomatik yönlendirme)
- Sosyal özellikler (yorum, beğeni, takip)
- Push notification (rapor durum güncellemesi)
- Offline mod
- Çoklu dil desteği
- Kullanıcılar arası rota paylaşımı
- Gamification (rozet, puan sistemi)

---

## 6. Teknik Mimari

### Tech Stack

| Katman | Teknoloji | Gerekçe |
|---|---|---|
| Mobil | React Native + Expo | JS bilgisiyle hızlı geliştirme, cross-platform |
| Web Dashboard | React + Next.js | v2.0'da geliştirilecek |
| Backend | Supabase (BaaS) | Auth + DB + Storage hazır |
| Sunucu işlemleri | Supabase Edge Functions | Gemini ve Places API proxy |
| Veritabanı | PostgreSQL (Supabase) | İlişkisel, güçlü sorgu |
| Fotoğraf depolama | Supabase Storage | Cloudinary'e gerek kalmıyor |
| Harita | Google Maps (react-native-maps) | Mekan pinleri ve yön |
| Mekan verisi | Google Places API | Zengin mekan bilgisi |
| Ansiklopedi | Wikipedia REST API | Ücretsiz, güvenilir |
| AI analiz | Gemini 2.5 Flash API | Ücretsiz, vision destekli, kart gerekmez |

### Veritabanı Tabloları

```
users           → id, email, full_name, avatar_url, created_at
cities          → id, name, country, lat, lng
places          → id, city_id, name, category, google_place_id, wiki_summary, lat, lng
routes          → id, user_id, title, description, is_public, created_at
route_places    → id, route_id, place_id, order_index
damage_reports  → id, user_id, place_id, photo_url, description, ai_analysis, severity, status, created_at
```

### Rapor Durum Akışı

```
bekliyor → incelendi → iletildi
```

---

## 7. Ekran Listesi (React Native)

| Ekran | Açıklama |
|---|---|
| Splash / Onboarding | İlk açılış |
| Giriş / Kayıt | Auth ekranları |
| Ana ekran — Harita | Şehir seçimi, mekan pinleri |
| Mekan detayı | Bilgi, fotoğraf, Wikipedia özeti, rota ekle butonu |
| Rota oluşturma | Mekan listesi, sıralama, kaydet |
| Rota listesi | Kaydedilen rotalar |
| Rapor oluşturma | Fotoğraf + açıklama + AI analiz |
| Raporlarım | Kullanıcının gönderdiği raporlar |
| Profil | Hesap bilgileri |

---

## 8. API Endpoint Planı (Edge Functions)

| Endpoint | Metod | Açıklama |
|---|---|---|
| `/places/nearby` | GET | Google Places API proxy |
| `/places/:id/wiki` | GET | Wikipedia özeti çek |
| `/reports/analyze` | POST | Fotoğrafı Gemini 2.5 Flash'a gönder |
| `/routes/directions` | GET | Google Directions proxy |

> Not: CRUD işlemleri (kullanıcı, rota, rapor kaydetme/silme) doğrudan Supabase client SDK üzerinden yapılır, Edge Function gerekmez.

---

## 9. 4 Haftalık Sprint Planı

### Hafta 1 — Temel altyapı
- React Native + Expo proje kurulumu, navigasyon (Expo Router)
- Supabase bağlantısı, Auth akışı (kayıt/giriş ekranları)
- Google Maps entegrasyonu (react-native-maps)
- `cities` ve `places` tabloları, seed data

**Hafta sonu teslim:** Haritada İstanbul'daki mekanları gösteren çalışan uygulama

### Hafta 2 — Keşif & mekan detayı
- Google Places API entegrasyonu (nearby search)
- Wikipedia API entegrasyonu
- Mekan detay ekranı
- Kategori filtresi

**Hafta sonu teslim:** Şehir seçip mekan detayına girilen tam akış

### Hafta 3 — Rota modülü
- `routes` ve `route_places` tabloları
- Rota oluşturma, sıralama, kaydetme ekranları
- Google Directions entegrasyonu (tahmini süre)
- Kaydedilen rotalar listesi

**Hafta sonu teslim:** Tam işlevsel rota planlayıcı

### Hafta 4 — Hasar raporlama & demo
- `damage_reports` tablosu
- Fotoğraf çekme / yükleme (Supabase Storage)
- Gemini 2.5 Flash API ile otomatik hasar analizi
- Raporlarım ekranı
- Demo hazırlığı, bug fix

**Hafta sonu teslim:** Tüm özellikler çalışır, sunum hazır

---

## 10. Başarı Kriterleri (Demo Günü)

- [ ] Kullanıcı kayıt olup giriş yapabiliyor
- [ ] Haritada en az 3 şehir, her şehirde en az 5 mekan görünüyor
- [ ] Rota oluşturup kaydedebiliyor
- [ ] Fotoğraf çekip hasar raporu gönderebiliyor
- [ ] Gemini API hasar şiddetini otomatik tespit ediyor (kritik / orta / hafif)
- [ ] Kullanıcı kendi raporlarını listeleyebiliyor

---

## 11. Riskler & Önlemler

| Risk | Olasılık | Önlem |
|---|---|---|
| Google Places API kota aşımı | Orta | Supabase'de sonuçları cache'le, ücretsiz kota MVP için yeterli |
| Gemini API rate limit (15 istek/dk) | Düşük | Sadece rapor gönderiminde tetiklenir, MVP'de sorun olmaz |
| Expo / react-native-maps uyumsuzluğu | Orta | Expo SDK sürümüne uygun maps versiyonunu sabitle |
| Hafta 4'te zaman yetmemesi | Orta | Hasar raporlama öncelikli, AI analiz sonraya bırakılabilir |
| Gerçek mekan verisi eksikliği | Düşük | Demo için seed data elle girilebilir |

---

