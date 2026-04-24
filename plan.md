# 📅 SmartScan Geliştirme Planı

Bu dosya, SmartScan MVP sürümünün adım adım geliştirilme sürecini takip etmek ve LLM (Yapay Zeka) tabanlı kodlama asistanlarına (Cursor vb.) rehberlik etmek için hazırlanmıştır.

## 📂 Dosya Dizini Yapısı

Geliştirme süreci, kodların birbirine karışmaması için iki ayrı ana dizinde yürütülecektir:
* `/frontend`: Mobil uygulama kodları (Flutter)
* `/backend`: Sunucu taraflı kodlar (Firebase Cloud Functions)

---

## 🚀 Faz 1: Kurulum ve Altyapı (Setup & Infrastructure)

- [ ] **1.1. Backend Kurulumu:**
  - `backend` dizininde Firebase CLI kullanarak yeni bir Node.js tabanlı Cloud Functions projesi başlat.
  - Firestore veritabanını aktif et.
  - OpenAI API anahtarını Firebase Secret Manager’a güvenli bir şekilde ekle.
- [ ] **1.2. Frontend Kurulumu:**
  - `frontend` dizininde yeni bir Flutter projesi oluştur.
  - `pubspec.yaml` dosyasına temel paketleri ekle: `camera`, `google_mlkit_text_recognition`, `image_picker`, `http` (veya `dio`), `flutter_riverpod`.
  - Firebase Core SDK entegrasyonunu tamamla (Android/iOS bağlantıları).

## 📱 Faz 2: Temel UI ve Kamera Arayüzü (Core UI)

- [ ] **2.1. Tasarım ve Yönlendirme (Navigation):**
  - "Emerald Green" ana renk temalı Material UI yapısını kur.
  - Ana ekran (Scanner) ve Geçmiş (History) sayfaları için router (sayfa geçiş) yapısını oluştur.
- [ ] **2.2. Kamera ve Arayüz:**
  - Ekranda tam ekran kamera vizörünü (Camera Preview) oluştur.
  - Ekranın alt kısmına "Fiyat" ve "İçerik" modları için yatay kaydırılabilir (sliding) bir mod seçici (Mode Selector) ekle.
  - Kamera vizörü üzerine, okunacak alanı belirten şeffaf bir odaklama çerçevesi (Focus Frame) yerleştir.

## 🧠 Faz 3: Lokal İşleme - Edge OCR (Local Intelligence)

- [ ] **3.1. Canlı Metin Algılama (ML Kit):**
  - Google ML Kit Text Recognition kullanarak vizörden anlık metin okuma fonksiyonunu yaz.
  - Performans için sadece "Focus Frame" içindeki metinlerin alınmasını sağla.
- [ ] **3.2. Galeri Entegrasyonu:**
  - `image_picker` paketini kullanarak ana ekrana bir "Galeri" butonu ekle.
  - Kullanıcının galeriden veya ekran görüntülerinden (screenshot) seçtiği fotoğrafı OCR motoruna gönderip metne dönüştür.

## ☁️ Faz 4: Backend & AI Entegrasyonu (Cloud)

- [ ] **4.1. Cloud Functions Geliştirme:**
  - Backend tarafında `analyzeProduct` adında bir HTTPS callable function oluştur.
  - Bu fonksiyonun OCR'dan gelen metni alıp OpenAI (GPT-4o-mini) API'sine göndermesini sağla.
  - LLM için Sistem Promptunu ayarla: Çıktının kesinlikle yapılandırılmış JSON formatında olmasını zorunlu kıl.
- [ ] **4.2. Mobil & Backend Haberleşmesi:**
  - Flutter (Frontend) tarafında Firebase Function'ı çağıran bir API servis sınıfı yaz.
  - İstek atıldığında ekranda kullanıcıyı bekleten ("Yapay Zeka Analiz Ediyor...") şık bir yükleme animasyonu (Skeleton Loading) göster.

## 📊 Faz 5: Sonuçların Sunumu (Result Delivery)

- [ ] **5.1. İçerik Modu (Pure-Scan):**
  - Yapay zekadan dönen JSON verisini ayrıştır.
  - Ekranın altından yükselen bir "Bottom Sheet" içerisinde, içindekileri 🔴 (Zararlı), 🟡 (Dikkat), 🟢 (Güvenli) olarak listeleyen akordeon bir UI tasarla.
- [ ] **5.2. Fiyat Modu (Deal-Lens):**
  - Rakam ve gramajları ayrıştırarak 1kg/1Lt üzerinden birim fiyatı hesapla.
  - Sonucu büyük puntolarla ve tasarruf mesajıyla aynı Bottom Sheet yapısında göster.

## ✨ Faz 6: Cila ve Yayına Hazırlık (Final Polish)

- [ ] **6.1. Lokal Geçmiş (History):**
  - Başarılı tarama sonuçlarını cihazın lokal depolamasında (Hive veya SharedPreferences) tut.
  - Geçmiş sayfasında bu kayıtları kronolojik bir liste olarak göster.
- [ ] **6.2. Hata Yönetimi (Error Handling):**
  - İnternet yoksa kullanıcıya uyarı göster.
  - OCR metin bulamazsa "Lütfen daha net çekin veya flaşı açın" şeklinde Toast mesajları ekle.
  - Uygulama içerisine "Tıbbi tavsiye değildir" yasal uyarı metnini yerleştir.

---

### 🤖 LLM (Cursor) İçin Talimat:
Bu projeyi geliştirirken lütfen `plan.md` dosyasındaki adımları sırayla takip et. Bir faza başlamadan önce o fazın gerekliliklerini teyit et ve kodları yazarken **Frontend** ve **Backend** dizin ayrımlarına kesinlikle dikkat et. Görevleri tamamladıkça onayını isteyeceğim.
