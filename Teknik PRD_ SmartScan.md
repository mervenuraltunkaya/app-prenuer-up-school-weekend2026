Teknik PRD: SmartScan - Akıllı Alışveriş Asistanı

Proje Adı: SmartScan
Platform: Mobil (iOS & Android)
Geliştirme Ortamı: Flutter, Dart, Cursor (AI)
Doküman Sürümü: v1.0

1. Proje Özeti (Executive Summary)

SmartScan, kullanıcıların market ve kozmetik alışverişlerinde "en uygun fiyatlı" ve "en sağlıklı" ürünü saniyeler içinde bulmalarını sağlayan yapay zeka destekli bir mobil vizyon asistanıdır. Canlı kamera veya galeriden yüklenen ekran görüntülerini (online marketler için) analiz ederek, karmaşık fiyat etiketlerini ve anlaşılamayan içerik listelerini basit, eyleme geçirilebilir içgörülere dönüştürür.

2. Problem Tanımı

Fiyat ve Gramaj Karmaşası: Market raflarında veya online alışverişte farklı gramajlara sahip ürünler arasında hangisinin birim bazında (örn. 1 kg veya 1 Litre) daha kârlı olduğunu zihinden hesaplamak zordur.

İçerik Okuryazarlığı Eksikliği: Ürünlerin (gıda ve kozmetik) arkasındaki içerik listeleri teknik, kimyasal ve karmaşık terimlerle (örn. INCI standartları, E-kodları) doludur. Tüketiciler ne yediklerini veya ciltlerine ne sürdüklerini tam olarak bilememektedir.

Sürtünme (Friction): Mevcut çözümler genellikle barkod okutmaya dayanır; ancak barkodu sistemde olmayan veya online marketten ekran görüntüsü alınan ürünler analiz edilemez.

3. Çözüm

SmartScan, Barkod veritabanlarına bağımlı kalmadan, Görsel Metin Tanıma (OCR) ve Büyük Dil Modelleri (LLM) kullanarak doğrudan metni analiz eder.

Deal-Lens (Fiyat Modu): Etiketteki fiyatı ve gramajı okur, anında birim fiyatı hesaplar.

Pure-Scan (İçerik Modu): İçindekiler listesini okur, maddeleri analiz eder ve "Trafik Işığı" (Kırmızı/Sarı/Yeşil) sistemiyle sağlık skorunu çıkarır.

Omnichannel Yaklaşım: Hem fiziksel markette canlı kamera ile hem de online market alışverişlerinde galeriden ekran görüntüsü (screenshot) yükleyerek çalışır.

4. Hedef Kitle (Personalar)

Bilinçli Tüketiciler: Sağlıklı beslenmeye çalışanlar, diyet yapanlar, veganlar, temiz kozmetik arayanlar.

Bütçe Yöneticileri: Enflasyonist ortamda en iyi fiyat/performans ürününü arayan aileler ve öğrenciler.

Online Alışverişçiler: Getir, Yemeksepeti Market, Migros Hemen gibi uygulamalardan alışveriş yapıp ekran görüntüsü ile analiz yapmak isteyenler.

5. Kapsam ve Temel Özellikler (MVP Scope)

5.1. Kapsam Dahilinde Olanlar (In Scope)

Modlu Tarama Ekranı: Ekranın altından yatay kaydırma ile "Fiyat" ve "İçerik" modları arasında geçiş.

Canlı Kamera (Live OCR): Kamera vizöründen gerçek zamanlı veri okuma.

Galeri Entegrasyonu: Galeriden fotoğraf / ekran görüntüsü yükleyip analiz etme (Image Picker).

AI Destekli İçerik Analizi: GPT-4o-mini destekli prompt mühendisliği ile içeriklerin sınıflandırılması (Zararlı, Dikkat Edilmeli, Güvenli).

Birim Fiyat Hesaplayıcı: TL ve Gramaj/Litre verisini ayrıştırıp matematiksel oranlama yapma.

5.2. Kapsam Dışında Bırakılanlar (Out of Scope - v2.0)

Kullanıcı Girişi (Auth) ve Bulut Senkronizasyonu.

Kişiselleştirilmiş Alerji Profilleri (örn. "Ben gluten yiyemem" filtresi).

Fiyat geçmişi grafikleri.

Barkod okutma (Sadece OCR odaklanılacak).

6. Teknik Mimari ve Stack

Bileşen

Teknoloji / Paket

Kullanım Amacı

Frontend

Flutter, Dart

Cross-platform mobil UI geliştirme.

State Management

Riverpod / Provider

Uygulama içi durum yönetimi (Kamera mı açık, galeri mi seçildi, mod ne?).

Medya & Kamera

camera, image_picker

Cihaz kamerasına erişim ve galeriden medya seçimi.

Lokal OCR

google_mlkit_text_recognition

Görüntüdeki metni internete göndermeden önce cihazda hızlıca metne çevirme (Hız ve maliyet optimizasyonu).

AI / NLP

OpenAI API (GPT-4o-mini)

OCR'dan gelen ham metni yapılandırılmış JSON'a çevirme ve sağlık risk analizini yapma.

7. Kullanıcı Akışı (User Flow)

Uygulama Açılışı: Splash screen sonrası kullanıcı doğrudan ana ekrana (Kamera vizörüne) düşer.

Görsel Kaynağı Seçimi:

Kullanıcı telefonu fiziksel ürüne tutar (Canlı Kamera).

VEYA köşedeki "Galeri" ikonuna tıklayıp ekran görüntüsü seçer.

Mod Seçimi: Alt bardan "Fiyat" veya "İçerik" modu seçilir.

Tarama/Analiz: "Analiz Et" butonuna basılır. Ekranda Skeleton Loading (Yükleniyor) animasyonu belirir.

İşlem (Arka Plan):

Google ML Kit görseldeki metni (String) çeker.

Çekilen metin, sistem promptu ile birlikte GPT API'sine gönderilir.

Sonuç Gösterimi: Ekranın altından bir Bottom Sheet yükselir.

İçerik Modu Sonucu: Madde listesi ve Kırmızı/Sarı/Yeşil renk kodlamalarıyla kısa açıklama.

Fiyat Modu Sonucu: "1 Kg Fiyatı: 125 TL".

Kapanış: Kullanıcı Bottom Sheet'i aşağı kaydırır ve yeni taramaya hazır hale gelir.

8. Veri Modeli ve API Stratejisi (Data & API Strategy)

Sistemin hızlı ve ucuz çalışması için doğrudan görseli API'ye göndermek yerine (Vision API), önce lokal OCR yapılıp sadece metin LLM'e gönderilecektir.

Örnek GPT-4o-mini Prompt Yapısı (İçerik Modu İçin):

// GİRDİ (Sistem Promptu)
"Sen uzman bir diyetisyen ve toksikologsun. Aşağıdaki ürün içeriğini analiz et. Zararlı (kırmızı), dikkat edilmesi gereken (sarı) ve güvenli (yeşil) maddeleri ayır. JSON formatında dön."
// GİRDİ (Kullanıcı Verisi - ML Kit'ten gelen)
"İçindekiler: Su, Şeker, Glikoz şurubu, E211, Sitrik asit, Doğal aroma verici."


9. Kullanıcı Hikayeleri (User Stories)

US01: Bir kullanıcı olarak, markette zaman kaybetmemek için uygulamayı açtığım an kameranın hazır olmasını istiyorum.

US02: Bir online market kullanıcısı olarak, uygulamaya galerimden bir ekran görüntüsü yükleyebilmek istiyorum ki, online alışverişlerimde de analiz yapabileyim.

US03: Bir bütçe yöneticisi olarak, farklı gramajlardaki (örneğin 830 gr salça) ürünlerin etiketi üzerinden 1 kg'lık birim fiyatını görmek istiyorum.

US04: Sağlığına dikkat eden bir birey olarak, ürünün içindekiler metnini tarattığımda içindeki tehlikeli maddelerin kırmızı ile vurgulanmasını istiyorum.

10. Riskler, Kısıtlar ve Çözümler

Risk / Kısıt

Etki

Çözüm (Mitigation)

OCR Hataları: Kötü ışıkta veya düşük çözünürlüklü fotoğraflarda metnin yanlış okunması (Örn: 8 yerine 0 okunması).

Yüksek

Analiz sonucunda kullanıcılara ufak bir "Bu sonuçlar yapay zeka tarafından okunmuştur, lütfen manuel kontrol ediniz." ibaresi eklemek.

LLM Halüsinasyonu: Yapay zekanın güvenli bir maddeye zararlı demesi (Yasal Risk).

Kritik

Uygulama içine "Tıbbi tavsiye değildir" (Disclaimer) maddesi eklemek ve LLM promptunun sıcaklığını (temperature: 0.1) düşük tutarak yaratıcılığı kısmak.

API Maliyetleri: Her taramada OpenAI API'sine istek atmanın maliyet yaratması.

Orta

GPT-4o-mini kullanarak maliyetleri minimumda tutmak. (İleriki versiyonlarda lokal veritabanı önbelleklemesi - Caching eklenecek).
