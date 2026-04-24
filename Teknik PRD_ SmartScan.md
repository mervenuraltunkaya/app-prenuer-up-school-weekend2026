# 🚀 SmartScan — Akıllı Alışveriş Asistanı

> Yapay zeka destekli mobil vizyon asistanı: En uygun fiyatlı ve en sağlıklı ürünü saniyeler içinde bul.

---

## 📋 İçindekiler

- [Proje Özeti](#-proje-özeti)
- [Problem Tanımı](#-problem-tanımı)
- [Çözüm](#-çözüm)
- [Hedef Kitle](#-hedef-kitle)
- [Kapsam ve Özellikler](#-kapsam-ve-özellikler-mvp)
- [Teknik Mimari](#-teknik-mimari)
- [Kullanıcı Akışı](#-kullanıcı-akışı)
- [AI Prompt Stratejisi](#-ai-prompt-stratejisi)
- [Kullanıcı Hikayeleri](#-kullanıcı-hikayeleri)
- [Riskler ve Çözümler](#-riskler-ve-çözümler)

---

## 📌 Proje Özeti

**SmartScan**, kullanıcıların market ve kozmetik alışverişlerinde *en uygun fiyatlı* ve *en sağlıklı* ürünü saniyeler içinde bulmalarını sağlayan yapay zeka destekli bir mobil vizyon asistanıdır.

Canlı kamera veya galeriden yüklenen ekran görüntülerini analiz ederek, karmaşık fiyat etiketlerini ve anlaşılamayan içerik listelerini basit, eyleme geçirilebilir içgörülere dönüştürür.

---

## 🎯 Problem Tanımı

Mevcut alışveriş deneyiminde tüketiciler üç ana zorlukla karşılaşmaktadır:

| # | Problem | Açıklama |
|---|---------|----------|
| 1 | 🧮 **Fiyat ve Gramaj Karmaşası** | Farklı gramajlardaki ürünler arasında birim fiyatı (kg/L) zihinden hesaplamak bilişsel yüktür. |
| 2 | 🧪 **İçerik Okuryazarlığı Eksikliği** | INCI standartları ve E-kodlarıyla dolu içerik listeleri tüketiciler tarafından anlaşılamamaktadır. |
| 3 | 🚧 **Sürtünme (Friction)** | Mevcut barkod tabanlı çözümler, sistemde kayıtlı olmayan veya online marketten alınan ekran görüntülerini analiz edememektedir. |

---

## 💡 Çözüm

SmartScan, barkod veritabanlarına bağımlı kalmadan **Görsel Metin Tanıma (OCR)** ve **Büyük Dil Modelleri (LLM)** kullanarak doğrudan "gördüğünü" analiz eder.

### 💰 Deal-Lens — Fiyat Modu
Etiketteki fiyatı ve gramajı okur, anında **birim fiyatı** hesaplar.

### 🌿 Pure-Scan — İçerik Modu
İçindekiler listesini okur, maddeleri analiz eder ve **Trafik Işığı** sistemiyle sağlık skoru çıkarır.

| Renk | Anlam |
|------|-------|
| 🔴 Kırmızı | Zararlı madde |
| 🟡 Sarı | Dikkat edilmesi gereken madde |
| 🟢 Yeşil | Güvenli madde |

### 📱 Omnichannel Yaklaşım
Hem fiziksel markette **canlı kamera** ile hem de online marketten **ekran görüntüsü yükleyerek** çalışır.

---

## 👥 Hedef Kitle

- **Bilinçli Tüketiciler** — Sağlıklı beslenmeye çalışanlar, diyet yapanlar, veganlar, temiz kozmetik arayanlar.
- **Bütçe Yöneticileri** — Enflasyonist ortamda en iyi fiyat/performans ürününü arayan aileler ve öğrenciler.
- **Online Alışverişçiler** — Getir, Yemeksepeti Market, Migros Hemen gibi uygulamalardan ekran görüntüsü ile analiz yapmak isteyenler.

---

## 📦 Kapsam ve Özellikler (MVP)

### ✅ Kapsam Dahilinde

- **Modlu Tarama Ekranı** — Alt bardan yatay kaydırma ile *Fiyat* ve *İçerik* modları arasında geçiş.
- **Canlı Kamera (Live OCR)** — Kamera vizöründen gerçek zamanlı veri okuma.
- **Galeri Entegrasyonu** — Fotoğraf veya ekran görüntüsü yükleyip analiz etme (Image Picker).
- **AI Destekli İçerik Analizi** — GPT-4o-mini destekli prompt mühendisliği ile içerik sınıflandırması.
- **Birim Fiyat Hesaplayıcı** — TL ve Gramaj/Litre verisini matematiksel oranlama.

### ❌ Kapsam Dışı (v2.0 için)

- Kullanıcı Girişi (Auth) ve Bulut Senkronizasyonu
- Kişiselleştirilmiş Alerji Profilleri (örn. gluten filtresi)
- Fiyat geçmişi grafikleri

---

## 🛠️ Teknik Mimari

| Bileşen | Teknoloji / Paket | Kullanım Amacı |
|---------|-------------------|----------------|
| **Frontend** | Flutter, Dart | Cross-platform mobil UI geliştirme |
| **State Yönetimi** | Riverpod / Provider | Uygulama içi durum yönetimi |
| **Medya** | `camera`, `image_picker` | Cihaz kamerasına erişim ve galeri seçimi |
| **Lokal OCR** | `google_mlkit_text_recognition` | Görüntüyü cihazda metne çevirme (maliyet optimizasyonu) |
| **AI / NLP** | OpenAI API (GPT-4o-mini) | Ham metni yapılandırılmış JSON'a çevirme ve risk analizi |

---

## 🔄 Kullanıcı Akışı

```
1. 🚀 Açılış        → Splash screen sonrası kullanıcı doğrudan kamera vizörüne düşer.
2. 🖼️ Kaynak Seçimi → Canlı kamera VEYA galeriden ekran görüntüsü yükleme.
3. ⚙️ Mod Seçimi    → Alt bardan Fiyat veya İçerik modu seçilir.
4. ⏳ Analiz        → "Analiz Et" butonuna basılır; Skeleton Loading animasyonu belirir.
5. 🧠 İşlem         → ML Kit metni çeker → Metin, sistem promptuyla GPT API'ye gönderilir.
6. 📊 Sonuç         → Ekranın altından Bottom Sheet yükselir.
                       • İçerik: Renk kodlu kısa açıklamalar (örn. 🔴 E211 İçerir)
                       • Fiyat:  Birim fiyat sonucu (örn. 1 kg: 125 TL)
7. ✅ Kapanış       → Kullanıcı kartı aşağı kaydırır; sistem yeni taramaya hazırdır.
```

---

## 📖 Kullanıcı Hikayeleri

| ID | Rol | İstek |
|----|-----|-------|
| **US01** | Market kullanıcısı | Uygulamayı açtığım an kameranın hazır olmasını istiyorum. |
| **US02** | Online market kullanıcısı | Galerimden ekran görüntüsü yükleyebilmek istiyorum. |
| **US03** | Bütçe yöneticisi | Farklı gramajlardaki ürünlerin 1 kg birim fiyatını görmek istiyorum. |
| **US04** | Sağlığına dikkat eden birey | İçindekiler taramasında tehlikeli maddeler kırmızıyla vurgulanmalı. |

---

## ⚠️ Riskler ve Çözümler

| Risk | Etki | Çözüm Stratejisi |
|------|------|------------------|
| **OCR Hataları** (örn. `8` → `0` okunması) | 🟠 Yüksek | Sonuç ekranına *"Yapay zeka tarafından okunmuştur, lütfen kontrol ediniz."* ibaresi eklemek. |
| **LLM Halüsinasyonu** (yasal risk) | 🔴 Kritik | Uygulama içine *"Tıbbi tavsiye değildir"* ibaresi eklemek; `temperature: 0.1` kullanmak. |
| **API Maliyetleri** | 🟡 Orta | GPT-4o-mini tercih etmek; ileriki versiyonlarda lokal önbellekleme (caching) uygulamak. |

---

> Bu doküman, çevik yazılım (Agile) prensiplerine göre hazırlanmıştır.
