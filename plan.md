# 📅 SmartScan Geliştirme Planı (Supabase)

Bu dosya, SmartScan MVP sürümünün adım adım geliştirilme sürecini takip etmek ve LLM (Yapay Zeka) tabanlı kodlama asistanlarına (Cursor vb.) rehberlik etmek için hazırlanmıştır.

## 📂 Dizin Yapısı

Geliştirme süreci, kodların birbirine karışmaması için iki ayrı ana dizinde yürütülecektir:
* `/frontend`: Mobil uygulama kodları (Flutter)
* `/supabase/functions`: Sunucu taraflı kodlar (Edge Functions - TypeScript/Deno)

---

## 🚀 Faz 1: Altyapı ve Supabase Kurulumu

- [ ] **1.1. Supabase Init:**
  - Supabase CLI ile projeyi başlat.
  - PostgreSQL üzerinde `scans` tablosunu oluştur (JSONB desteği ile).
- [ ] **1.2. Flutter Setup:**
  - `supabase_flutter` paketini projeye ekle.
  - Supabase URL ve Anon Key tanımlamalarını yap.
- [ ] **1.3. Edge Function Setup:**
  - `supabase functions new analyze-product` komutuyla ilk fonksiyonu oluştur.

## 📱 Faz 2: Kamera ve OCR (Edge Intelligence)

- [ ] **2.1. Kamera Vizörü:**
  - Tam ekran vizör ve mod seçici (Fiyat/İçerik) arayüzünü tasarla.
- [ ] **2.2. ML Kit Entegrasyonu:**
  - Canlı kameradan metin yakalama ve "Focus Area" kısıtlamasını yap.
- [ ] **2.3. Galeri Desteği:**
  - `image_picker` paketini kullanarak galeriden seçilen fotoğrafın OCR sürecine sokulmasını sağla.

## ☁️ Faz 3: Backend & AI Logic

- [ ] **3.1. OpenAI Entegrasyonu:**
  - Edge Function içinde OpenAI API çağrısını yap.
  - Sistem promptu ile fiyat ve içerik analiz çıktılarını JSON formatına zorla.
- [ ] **3.2. API Güvenliği:**
  - OpenAI anahtarını Supabase Vault (Secrets) içinde güvenli bir şekilde sakla.

## 📊 Faz 4: Sonuçlar ve Kayıt

- [ ] **4.1. UI Feedback:**
  - AI yanıtı beklerken skeleton loading gösterimi ekle.
  - Sonuçların renk kodlarıyla Bottom Sheet üzerinde görselleştirilmesini sağla.
- [ ] **4.2. Geçmiş Kaydı:**
  - Başarılı taramaların PostgreSQL `scans` tablosuna otomatik kaydedilmesini sağla.

---
**🤖 LLM (Cursor) Talimatı:** Lütfen projeyi geliştirirken bu plandaki adımları sırayla takip et. Kodlamaya `/supabase/functions` dizininden başla ve öncelikle Edge Function yapısını kur.
