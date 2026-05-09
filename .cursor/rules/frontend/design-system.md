**SmartScan**

**Design System & UI/UX Kılavuzu**

Akıllı Alışveriş Asistanı - Mobil Uygulama

v1.0 · MVP Sürümü · 2025

**1\. Giriş ve Tasarım Felsefesi**

SmartScan, tüketicilerin market ve kozmetik alışverişlerinde doğru, hızlı ve sağlıklı kararlar almalarını sağlayan bir yapay zeka destekli mobil uygulamadır. Bu doküman, uygulamanın görsel kimliğini, bileşen kütüphanesini, davranış standartlarını ve geliştirici uygulama kılavuzunu kapsamaktadır.

**Tasarım İlkeleri**

**◆ Hız ve Netlik:** Kullanıcı kameraya tutar, sonuç 2 saniyede gelir. Her ekran tek bir amaca hizmet eder. Gereksiz bilgi yoktur.

**◆ Güven ve Şeffaflık:** AI çıktıları için her zaman bir uyarı etiketi gösterilir. Renk sistemi evrensel standartlara (kırmızı=tehlike) dayanır.

**◆ Erişilebilirlik:** WCAG 2.1 AA uyumluluğu hedeflenir. Renk kör kullanıcılar için ikonlar rengin yanında her zaman vardır.

**◆ Sürükleyici Deneyim:** Kamera vizörü tam ekrandır; UI unsurları içeriğin üzerinde yüzer. Bottom Sheet, doğal mobil kaydırma davranışını destekler.

**◆ Tutarlılık:** Tüm bileşenler bu sistem üzerinden türer; tek bir piksel manuel override içermez.

**2\. Renk Sistemi**

SmartScan renk paleti, gıda ve sağlık sektörüne özgü sıcaklık ve aciliyet hissini yaratacak şekilde seçilmiştir. Kırmızı tonlar tehlikeyi, turuncu tonlar aksiyonu, pembe ton arka planı temsil eder.

**2.1 Ana Palet**

| **Renk** | **Hex** | **İsim**     | **Rol**          | **Kullanım**                                                    |
| -------- | ------- | ------------ | ---------------- | --------------------------------------------------------------- |
|          | #D9042B | Crimson Red  | Primary / Danger | CTA butonlar, hata durumları, kırmızı trafik ışığı, marka rengi |
|          | #F29F05 | Golden Amber | Warning / Gold   | Sarı trafik ışığı, badge'ler, vurgu metinler                    |
|          | #F28705 | Burnt Orange | Secondary        | Sekonder butonlar, tab bar aktif ikonu, ikincil vurgu           |
|          | #F25C05 | Fire Orange  | Accent / CTA     | Gradient bitiş, floating action button, chip seçili durumu      |
|          | #F2BDBD | Soft Blush   | Light / Surface  | Kart arka planı, input alanı dolgusu, bölüm ayırıcıları         |

**2.2 Nötr ve Semantik Renkler**

| **Renk** | **Hex** | **İsim**   | **Rol**                | **Kullanım**                         |
| -------- | ------- | ---------- | ---------------------- | ------------------------------------ |
|          | #1A1A1A | Ink Black  | Heading Text           | Başlıklar, birincil metin            |
|          | #4A4A4A | Charcoal   | Body Text              | Gövde metni, açıklamalar             |
|          | #9E9E9E | Stone Gray | Placeholder / Disabled | Devre dışı durumlar, placeholder     |
|          | #F9F5F5 | Warm White | Background             | Sayfa arka planı, kart yüzeyi        |
|          | #FFFFFF | Pure White | Surface                | Bottom sheet, modal, input bg        |
|          | #1A8C4E | Safe Green | Semantic - Safe        | Yeşil trafik ışığı, onay mesajları   |
|          | #D9042B | Alert Red  | Semantic - Danger      | Kırmızı trafik ışığı, hata mesajları |
|          | #F29F05 | Warn Amber | Semantic - Warning     | Sarı trafik ışığı, dikkat mesajları  |
|          | #1565C0 | Info Blue  | Semantic - Info        | Bilgilendirme toast'ları, link rengi |

**2.3 Gradient Tanımları**

| **Token Adı**  | **Değer**                              | **Kullanım Yeri**                    |
| -------------- | -------------------------------------- | ------------------------------------ |
| brand-gradient | 90°: #D9042B → #F25C05                 | Buton arka planı, splash ekranı, CTA |
| warm-gradient  | 135°: #F29F05 → #F28705                | Fiyat modu tab göstergesi, banner    |
| scan-overlay   | 180°: rgba(26,26,26,0.7) → transparent | Kamera vizör üst overlay             |
| sheet-surface  | 180°: #FFFFFF → #F9F5F5                | Bottom sheet arka planı              |
| danger-soft    | 90°: #D9042B → #F2BDBD                 | Kırmızı sonuç kartı arka planı       |

**3\. Tipografi Sistemi**

SmartScan iki yazı tipi ailesi kullanır: başlıklar ve güçlü mesajlar için Poppins, veri ve okuma metni için Inter. Her ikisi de Google Fonts üzerinden ücretsiz erişilebilir ve Flutter'da pub.dev/packages/google_fonts ile entegre edilebilir.

**3.1 Yazı Tipi Aileleri**

| **Kategori**      | **Yazı Tipi**  | **Ağırlıklar**              | **Kullanım**                            |
| ----------------- | -------------- | --------------------------- | --------------------------------------- |
| Display / Heading | Poppins        | SemiBold (600), Bold (700)  | Ekran başlıkları, splash, marka adı     |
| Body / Data       | Inter          | Regular (400), Medium (500) | Gövde metni, etiketler, fiyat gösterimi |
| Mono / Code       | JetBrains Mono | Regular (400)               | Besin değerleri, E-kod listesi          |

**3.2 Tip Skalası (Type Scale)**

| **Token**  | **Yazı Tipi**    | **Boyut / Satır Y.** | **Satır Aralığı** | **Kullanım**                    |
| ---------- | ---------------- | -------------------- | ----------------- | ------------------------------- |
| Display XL | Poppins Bold     | 32 / 40px            | 1.25              | Splash ve onboarding başlıkları |
| Display L  | Poppins SemiBold | 28 / 36px            | 1.29              | Ekran ana başlıkları            |
| Heading 1  | Poppins SemiBold | 22 / 30px            | 1.36              | Bölüm başlıkları                |
| Heading 2  | Poppins SemiBold | 18 / 26px            | 1.44              | Alt başlıklar, kart başlıkları  |
| Heading 3  | Poppins Medium   | 16 / 24px            | 1.5               | Liste grup başlıkları           |
| Body L     | Inter Regular    | 16 / 24px            | 1.5               | Birincil gövde metni            |
| Body M     | Inter Regular    | 14 / 22px            | 1.57              | İkincil gövde, açıklamalar      |
| Body S     | Inter Regular    | 13 / 20px            | 1.54              | Notlar, uyarı metinleri         |
| Label      | Inter Medium     | 12 / 18px            | 1.5               | Buton etiketleri, badge         |
| Caption    | Inter Regular    | 11 / 16px            | 1.45              | Alt bilgiler, timestamp         |
| Micro      | Inter Regular    | 10 / 14px            | 1.4               | Yasal uyarı metinleri           |
| Price Hero | Poppins Bold     | 36 / 44px            | 1.22              | Birim fiyat sonucu (Deal-Lens)  |
| Price Sub  | Inter SemiBold   | 20 / 28px            | 1.4               | Gramaj ve oran gösterimi        |
| Mono Data  | JetBrains Mono   | 13 / 20px            | 1.54              | E-kod, INCI liste maddeleri     |

**4\. Boşluk ve Izgara Sistemi**

Tüm boşluklar 4px temel birimi üzerine inşa edilmiştir. Bu, tasarım ile kod arasındaki tutarlılığı garanti eder.

**4.1 Spacing Scale**

| **Token** | **Değer** | **Kullanım**                                |
| --------- | --------- | ------------------------------------------- |
| space-1   | 4px       | İkon ile metin arası, mikro boşluklar       |
| space-2   | 8px       | Badge padding, chip padding                 |
| space-3   | 12px      | Küçük bileşen iç dolgusu                    |
| space-4   | 16px      | Standart iç dolgu (card padding)            |
| space-5   | 20px      | Orta boy boşluklar                          |
| space-6   | 24px      | Bölüm arası boşluk                          |
| space-8   | 32px      | Büyük bölüm arası, bottom sheet üst padding |
| space-10  | 40px      | Ekran üst/alt güvenli alan desteği          |
| space-12  | 48px      | FAB (Float Action Button) yüksekliği        |
| space-16  | 64px      | Bottom nav bar yüksekliği                   |

**4.2 Mobil Izgara (Mobile Grid)**

| **Parametre**        | **Değer**                                    |
| -------------------- | -------------------------------------------- |
| Cihaz Genişliği      | 360px - 430px (hedef: 390px / iPhone 15 Pro) |
| Sütun Sayısı         | 4 sütun                                      |
| Gutter (Sütun Arası) | 16px                                         |
| Kenar Boşluğu        | 20px (sol & sağ)                             |
| İçerik Genişliği     | 350px (390 - 40px margin)                    |
| Güvenli Alan Üst     | 44px (Notch / Dynamic Island desteği)        |
| Güvenli Alan Alt     | 34px (Home Indicator desteği)                |

**4.3 Border Radius Scale**

| **Token**   | **Değer** | **Kullanım**                                |
| ----------- | --------- | ------------------------------------------- |
| radius-xs   | 4px       | Küçük badge, chip kenar                     |
| radius-sm   | 8px       | Input alanı, küçük kart                     |
| radius-md   | 12px      | Standart kart, bottom sheet köşe            |
| radius-lg   | 16px      | Ana kart, modal                             |
| radius-xl   | 24px      | Bottom sheet üst köşeleri                   |
| radius-full | 9999px    | Pill buton, avatar, trafik ışığı göstergesi |

**5\. Gölge ve Yükseklik (Elevation)**

Flutter'da elevation sistemi Material Design 3 tabanlıdır. Aşağıdaki özel gölge değerleri SmartScan'ın sıcak renk tonlarıyla uyumlu olarak tasarlanmıştır.

| **Token**   | **Değer (CSS/Box Shadow)**      | **Kullanım**            |
| ----------- | ------------------------------- | ----------------------- |
| elevation-0 | Yok                             | Düz yüzeyler, arka plan |
| elevation-1 | 0 1px 3px rgba(217,4,43,0.08)   | Kart gölgesi, chip      |
| elevation-2 | 0 4px 12px rgba(217,4,43,0.12)  | Bottom nav, FAB alt     |
| elevation-3 | 0 8px 24px rgba(217,4,43,0.16)  | Bottom Sheet, Drawer    |
| elevation-4 | 0 16px 40px rgba(26,26,26,0.24) | Modal, Dialog           |

**6\. İkonografi**

SmartScan, iki ikon seti katmanlı şekilde kullanır: temel UI aksiyonları için Material Symbols (Google), uygulama özel kavramlar için özel SVG ikonlar.

**6.1 İkon Kuralları**

- Tüm ikonlar 24×24dp temel boyutunda kullanılır (kamera overlay'de 32×32dp, FAB'da 28×28dp).
- Stroke kalınlığı: 1.5px (regular), 2px (emphasized). Fill kullanılmaz.
- Renklendirme: Aktif ikonlar primary (#D9042B) veya beyaz, pasifler #9E9E9E.
- İkon + etiket kombinasyonunda aralarında 6px boşluk bırakılır.
- Erişilebilirlik: Her ikon için semanticLabel (Flutter) veya aria-label (web) zorunludur.

**6.2 Temel İkon Envanteri**

| **İkon Adı**    | **Kaynak**       | **Kullanım**                 |
| --------------- | ---------------- | ---------------------------- |
| camera_alt      | Material Symbols | Kamera aktif modu            |
| photo_library   | Material Symbols | Galeri / resim yükleme       |
| price_check     | Material Symbols | Deal-Lens fiyat modu         |
| eco             | Material Symbols | Pure-Scan içerik modu        |
| qr_code_scanner | Material Symbols | Tarama animasyonu overlay    |
| check_circle    | Material Symbols | Güvenli madde (yeşil)        |
| warning_amber   | Material Symbols | Dikkat maddesi (sarı)        |
| dangerous       | Material Symbols | Tehlikeli madde (kırmızı)    |
| expand_less     | Material Symbols | Bottom Sheet kapat           |
| info_outline    | Material Symbols | Bilgi tooltip'i              |
| bolt            | Özel SVG         | Hızlı analiz animasyon ikonu |
| leaf            | Özel SVG         | Pure-Scan marka ikonu        |

**7\. Bileşen Kütüphanesi**

**7.1 Butonlar (Buttons)**

SmartScan dört buton varyantı kullanır. Tüm butonlar min-height: 48dp (erişilebilirlik standardı) ve 16px yatay padding içerir.

| **Varyant** | **Arka Plan**                     | **Tipografi**                     | **Radius**         | **Kullanım**            |
| ----------- | --------------------------------- | --------------------------------- | ------------------ | ----------------------- |
| Primary     | Gradient CTA (#D9042B→#F25C05)    | Poppins SemiBold / 15pt / Beyaz   | radius-full (28dp) | "Analiz Et", "Devam Et" |
| Secondary   | Beyaz / #D9042B border 1.5px      | Poppins SemiBold / 15pt / #D9042B | radius-full        | "İptal", "Detay Gör"    |
| Ghost       | Şeffaf / Alt çizgi yok            | Inter Medium / 14pt / #F25C05     | radius-sm          | "Daha fazla bilgi"      |
| Icon FAB    | Gradient, 56×56dp yuvarlak        | İkon 28dp / Beyaz                 | radius-full        | Ana tarama butonu       |
| Chip        | Seçili: #F25C05, Seçisiz: #F9F5F5 | Inter Medium / 13pt               | radius-full        | Mod seçimi, filtre      |

**Buton Durumları**

| **Durum** | **Görsel Değişim**                                                       |
| --------- | ------------------------------------------------------------------------ |
| Default   | Yukarıdaki tanım geçerli                                                 |
| Hover     | Arka plan opaklığı %10 azaltılır                                         |
| Pressed   | scale: 0.96, opaklık %85                                                 |
| Disabled  | Arka plan #9E9E9E, metin #FFFFFF, tıklanmaz                              |
| Loading   | Metin gizlenir, CircularProgressIndicator (beyaz, stroke 2dp) gösterilir |

**7.2 Kartlar (Cards)**

| **Kart Tipi**         | **Görsel Özellikler**                              | **İçerik**                   |
| --------------------- | -------------------------------------------------- | ---------------------------- |
| Result Card - Price   | Beyaz bg, üst kısım #D9042B gradient şerit 4dp     | Birim fiyat sonucunu taşır   |
| Result Card - Content | Sol kenarda 4dp renkli border (Yeşil/Sarı/Kırmızı) | Her madde için bir kart      |
| Info Card             | Blush (#F2BDBD) bg, #F29F05 sol border 3dp         | Uyarı ve bilgi mesajları     |
| Scan History Card     | Beyaz bg, soluk gölge elevation-1                  | Geçmiş tarama listesi (v2.0) |

**Kart Standartları**

- Padding: 16px (tüm kenarlar).
- Kart minimum yüksekliği: 64dp.
- Birden fazla madde listeleniyorsa kartlar arası gap: 8px.
- Trafik ışığı göstergesi her zaman sol kenarda veya madde adı başında konumlandırılır.

**7.3 Bottom Sheet**

Analiz sonuçları ekranın altından yükselen bir Bottom Sheet ile sunulur. Bu, kullanıcının kamera görüntüsünü arka planda görmesine olanak tanır.

| **Özellik**      | **Değer / Tanım**                                            |
| ---------------- | ------------------------------------------------------------ |
| Handle Bar       | Üstte ortalanmış, 40×4dp, #E8D8D8 renk, radius-full          |
| Köşe Radius      | Üst sol ve üst sağ: 24dp (radius-xl)                         |
| Arka Plan        | Beyaz → #F9F5F5 gradyan                                      |
| Gölge            | elevation-3                                                  |
| İçerik Padding   | Üst: 12px, Sol/Sağ: 20px, Alt: 34px (safe area)              |
| Max Yükseklik    | Ekranın %80'i                                                |
| Kapatma          | Aşağı kaydırma veya overlay'e tıklama                        |
| Animasyon        | Slide-up 350ms, ease-out easing                              |
| Skeleton Loading | İçerik yüklenene dek shimmer animasyonu, 3 satır placeholder |

**7.4 Input Alanları**

| **Özellik**   | **Değer**                                                              |
| ------------- | ---------------------------------------------------------------------- |
| Arka Plan     | #FFFFFF, border: 1.5px #E8D8D8                                         |
| Focus Durumu  | Border: 2px #D9042B, hafif kırmızı glow: 0 0 0 3px rgba(217,4,43,0.15) |
| Hata Durumu   | Border: 2px #D9042B, alt hata metni kırmızı                            |
| Başarı Durumu | Border: 2px #1A8C4E, sağda check ikonu                                 |
| Radius        | radius-sm (8dp)                                                        |
| Yükseklik     | 48dp minimum                                                           |
| Placeholder   | Inter Regular 14pt, renk #9E9E9E                                       |
| Label         | Inter Medium 12pt, renk #4A4A4A, alan üstünde 4px boşluk               |

**7.5 Trafik Işığı Sistemi (Traffic Light)**

Pure-Scan modunun merkez UI elemanıdır. Her madde için üç renk durumundan biri gösterilir. Renk körü erişilebilirliği için rengin yanında metin etiketi ve ikon zorunludur.

| **Renk**   | **Hex** | **İkon**      | **Etiket** | **Kullanım Durumu**                              |
| ---------- | ------- | ------------- | ---------- | ------------------------------------------------ |
| 🟢 Yeşil   | #1A8C4E | check_circle  | GÜVENLI    | Doğal maddeler, gıda güvenli bileşenler          |
| 🟡 Sarı    | #F29F05 | warning_amber | DİKKAT     | Alerjen olabilecek, kişiye göre değişen maddeler |
| 🔴 Kırmızı | #D9042B | dangerous     | ZARАРLI    | Yaygın zararlı katkı maddeleri, E-kodları        |

**Trafik Işığı Özetleme Kuralı**

- Analiz sonucunda birden fazla madde varsa özet badge'de en kötü durumu gösteren renk gösterilir.
- Tüm maddeler yeşilse: Özet badge yeşil - 'Temiz Ürün'.
- En az bir sarı var, kırmızı yok: Özet badge sarı - 'Dikkatli Ol'.
- En az bir kırmızı var: Özet badge kırmızı - 'Zararlı Madde İçeriyor'.

**7.6 Mod Seçici (Mode Switcher)**

Ekranın alt kısmında iki modlu yatay kaydırmalı bileşendir. Kullanıcı parmağıyla kaydırır veya doğrudan moda dokunur.

| **Özellik**      | **Değer / Tanım**                                       |
| ---------------- | ------------------------------------------------------- |
| Arka Plan        | Beyaz, elevation-2 gölge                                |
| Aktif Tab        | Gradient pill (#D9042B→#F25C05), beyaz metin, mod ikonu |
| Pasif Tab        | Şeffaf bg, #9E9E9E metin ve ikon                        |
| Geçiş Animasyonu | Horizontal slide 200ms ease-in-out                      |
| Yükseklik        | 48dp                                                    |
| Mod 1: Fiyat     | price_check ikonu + 'Deal-Lens' etiketi                 |
| Mod 2: İçerik    | eco ikonu + 'Pure-Scan' etiketi                         |

**7.7 Toast & Snackbar Bildirimleri**

| **Tip** | **Renk** | **İkon**     | **Örnek Mesaj**                          |
| ------- | -------- | ------------ | ---------------------------------------- |
| Başarı  | #1A8C4E  | check_circle | Analiz tamamlandı                        |
| Uyarı   | #F29F05  | warning      | Görsel net değil, tekrar deneyin         |
| Hata    | #D9042B  | error        | Analiz başarısız oldu                    |
| Bilgi   | #1565C0  | info         | AI tarafından okunmuştur, kontrol ediniz |

Tüm snackbar'lar ekranın altında gösterilir, 3 saniye sonra otomatik kaybolur. Kapatma için sağa kaydırma desteği vardır.

**8\. Ekran Tanımları ve UX Akışı**

SmartScan MVP'sinde 5 temel ekran bulunur. Her ekran aşağıda ızgara, bileşen ve davranış açısından tanımlanmıştır.

**8.1 Splash Ekranı**

| **Özellik** | **Tanım**                                                 |
| ----------- | --------------------------------------------------------- |
| Süre        | 2.5 saniye - ardından otomatik geçiş                      |
| Arka Plan   | Gradient: #D9042B → #F25C05 (135°)                        |
| Logo        | SmartScan wordmark, beyaz, merkez, Poppins Bold 32pt      |
| Tagline     | 'Akıllı Alışveriş Asistanı', beyaz, Inter Regular 14pt    |
| Animasyon   | Logo ve tagline fade-in + scale 0.85→1.0, 600ms, ease-out |

**8.2 Ana Kamera Ekranı (Scanner)**

| **Özellik**   | **Tanım**                                                             |
| ------------- | --------------------------------------------------------------------- |
| Durum Çubuğu  | Şeffaf, ikon renkleri beyaz                                           |
| Kamera Vizörü | Tam ekran, arka planda canlı görüntü                                  |
| Üst Overlay   | Gradient siyah: rgba(0,0,0,0.6)→transparent, yükseklik 100dp          |
| Mod Seçici    | Alt orta, bottom safe area'nın 16dp üstü                              |
| Kaynak Butonu | Sol alt: Galeri ikonu, beyaz, 40×40dp yuvarlak bg beyaz/20% opaklık   |
| Analiz Butonu | Merkez alt: 64dp yuvarlak gradient FAB, kamera_alt ikonu, elevation-4 |
| Yardım İkonu  | Sağ üst: info_outline, beyaz                                          |

**8.3 Sonuç Ekranı - Deal-Lens (Fiyat)**

| **Özellik**     | **Tanım**                                                             |
| --------------- | --------------------------------------------------------------------- |
| Tetikleyici     | Analiz Et butonuna basıldığında                                       |
| Bottom Sheet    | Kamera görüntüsü %30 görünür, sheet %70 kaplıyor                      |
| Price Hero      | Poppins Bold 36pt, #D9042B                                            |
| Birim Gösterimi | 1 kg / 1 L: Inter SemiBold 20pt, #4A4A4A                              |
| Ham Değerler    | Okunan fiyat ve gramaj, Inter Regular 13pt, #9E9E9E                   |
| AI Uyarısı      | Info Card: 'Yapay zeka tarafından okunmuştur, lütfen kontrol ediniz.' |
| Paylaş Butonu   | Secondary buton, sağ üst köşe                                         |

**8.4 Sonuç Ekranı - Pure-Scan (İçerik)**

| **Özellik**   | **Tanım**                                                    |
| ------------- | ------------------------------------------------------------ |
| Tetikleyici   | Analiz Et butonuna basıldığında (İçerik modunda)             |
| Özet Badge    | En üstte büyük trafik ışığı badge'i - en kötü durum rengi    |
| Madde Listesi | Her madde için Result Card: ikon + madde adı + kısa açıklama |
| Sıralama      | Kırmızılar başta, sonra sarılar, en son yeşiller             |
| Tıbbi Uyarı   | Sayfa altında: 'Bu içerik tıbbi tavsiye değildir.'           |
| Detay Modal   | Bir maddeye tıklanırsa bottom sheet içinde tam açıklama      |

**8.5 Galeri Seçim Akışı**

| **Özellik**   | **Tanım**                                                   |
| ------------- | ----------------------------------------------------------- |
| Tetikleyici   | Kamera ekranındaki galeri ikonu                             |
| Sistem Picker | Native iOS/Android image picker                             |
| Önizleme      | Seçilen görsel tam ekran gösterilir, Analiz Et butonu aktif |
| Kırpma        | İsteğe bağlı kırpma desteği (ImageCropper paketi)           |
| Geri Dön      | Sol üstte < geri butonu, kamera ekranına döner              |

**9\. Animasyon ve Hareket Sistemi**

SmartScan'daki tüm animasyonlar işlevseldir; sırf görsellik için animasyon kullanılmaz. Her animasyon kullanıcıya bir durum geçişi hakkında bilgi verir.

| **Animasyon**        | **Tip**                   | **Süre** | **Easing**  | **Tetikleyici**        |
| -------------------- | ------------------------- | -------- | ----------- | ---------------------- |
| Ekran Geçişi         | Slide (yatay) / Fade      | 300ms    | ease-in-out | Ekranlar arası geçiş   |
| Bottom Sheet Açılış  | Slide-up                  | 350ms    | ease-out    | Sonuç ekranı açılışı   |
| Bottom Sheet Kapanış | Slide-down                | 250ms    | ease-in     | Kaydırarak kapat       |
| Skeleton Shimmer     | Gradient yatay kayma      | 1200ms   | linear loop | Analiz beklenirken     |
| Trafik Işığı Reveal  | Scale 0→1 + Fade          | 200ms    | ease-out    | Madde kartları sırayla |
| Buton Pressed        | Scale 1→0.96 + back       | 100ms    | ease-in-out | Her buton tıklaması    |
| Scan Frame Pulse     | Border opacity 0.4↔1 loop | 1000ms   | ease-in-out | Kamera viewfinder      |
| Toast Appear         | Slide-up + Fade-in        | 200ms    | ease-out    | Bildirim görünümü      |
| FAB Tap Ripple       | Material Ripple           | 300ms    | ease-out    | Analiz butonuna basış  |

**Motion Kuralları**

- Hiçbir animasyon 400ms'yi geçmez (kullanıcı sabırsızlık hissetmez).
- Ardışık liste açılımlarında stagger delay kullanılır: her eleman 40ms gecikmeli başlar.
- Reduced Motion tercihine sahip kullanıcılar için tüm animasyonlar soluk fade'e indirgenir.
- Fiziksel scroll davranışı: iOS momentum scroll, Android overscroll glow ile platform standartları korunur.

**10\. Erişilebilirlik Standartları**

**10.1 Renk Kontrast Oranları**

| **Kombinasyon**       | **Oran** | **Sonuç** | **Kullanım**           |
| --------------------- | -------- | --------- | ---------------------- |
| Beyaz metin / #D9042B | 4.9:1    | AA Geçer  | Buton, başlık          |
| Beyaz metin / #F25C05 | 3.2:1    | AA Large  | Büyük metin başlıkları |
| #1A1A1A / #F9F5F5     | 17.5:1   | AAA Geçer | Gövde metni            |
| #4A4A4A / #FFFFFF     | 9.7:1    | AAA Geçer | İkincil metin          |
| Beyaz / #1A8C4E       | 5.2:1    | AA Geçer  | Yeşil trafik ışığı     |

**10.2 Genel Kurallar**

- Minimum dokunma hedefi: 48×48dp (WCAG 2.5.5).
- Tüm ikonlar semanticLabel içerir; ekran okuyucu desteği zorunludur.
- Renk tek başına bilgi taşımaz: trafik ışığı ikonları ve metin etiketleri rengin yanında her zaman gösterilir.
- Font boyutu sistem ayarlarına göre ölçeklenir (Flutter: textScaleFactor).
- Odak sırası (focus order) ekran üstünden altına doğru mantıklı bir sıra izler.
- Haptic feedback: Analiz tamamlandığında ve hata durumlarında cihaz titreşim geri bildirimi verilir.

**11\. Flutter Uygulama Kılavuzu**

Aşağıdaki kod örüntüleri SmartScan'ın Flutter/Dart implementasyonu için referans niteliğindedir.

**11.1 ThemeData Temel Yapısı**

ThemeData(  
useMaterial3: true,  
colorScheme: ColorScheme.fromSeed(  
seedColor: Color(0xFFD9042B),  
primary: Color(0xFFD9042B),  
secondary: Color(0xFFF25C05),  
tertiary: Color(0xFFF29F05),  
surface: Color(0xFFFFFFFF),  
background: Color(0xFFF9F5F5),  
error: Color(0xFFD9042B),  
),  
fontFamily: 'Inter',  
)

**11.2 Temel Spacing ve Radius Sabitleri**

class AppSpacing {  
static const double xs = 4.0;  
static const double sm = 8.0;  
static const double md = 16.0;  
static const double lg = 24.0;  
static const double xl = 32.0;  
static const double xxl = 48.0;  
}  
<br/>class AppRadius {  
static const double sm = 8.0;  
static const double md = 12.0;  
static const double lg = 16.0;  
static const double xl = 24.0;  
static const double full = 9999.0;  
}

**11.3 Gradient Buton Kullanımı**

Container(  
decoration: BoxDecoration(  
gradient: LinearGradient(  
colors: \[Color(0xFFD9042B), Color(0xFFF25C05)\],  
begin: Alignment.centerLeft,  
end: Alignment.centerRight,  
),  
borderRadius: BorderRadius.circular(AppRadius.full),  
boxShadow: \[BoxShadow(  
color: Color(0xFFD9042B).withOpacity(0.3),  
blurRadius: 16, offset: Offset(0, 6),  
)\],  
),  
child: TextButton(  
onPressed: onPressed,  
child: Text('Analiz Et', style: AppTextStyles.button),  
),  
)

**11.4 Trafik Işığı Widget Yapısı**

enum IngredientStatus { safe, warning, danger }  
<br/>Color statusColor(IngredientStatus s) => switch (s) {  
IngredientStatus.safe => Color(0xFF1A8C4E),  
IngredientStatus.warning => Color(0xFFF29F05),  
IngredientStatus.danger => Color(0xFFD9042B),  
};  
<br/>IconData statusIcon(IngredientStatus s) => switch (s) {  
IngredientStatus.safe => Icons.check_circle,  
IngredientStatus.warning => Icons.warning_amber,  
IngredientStatus.danger => Icons.dangerous,  
};

**12\. Hata ve Boş Durum Tasarımı**

| **Hata Türü**         | **İkon Rengi**          | **Mesaj**                                                                     | **Aksiyon**        |
| --------------------- | ----------------------- | ----------------------------------------------------------------------------- | ------------------ |
| OCR Başarısız         | warning_amber (turuncu) | 'Görsel net değil. Daha yakından çekin veya yeniden deneyin.'                 | Yeniden Çek butonu |
| API Bağlantı Hatası   | dangerous (kırmızı)     | 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.'                 | Tekrar Dene butonu |
| Desteklenmeyen Görsel | info_outline (mavi)     | 'Bu görsel analiz için uygun değil. Ürün etiketi veya fiyat etiketi tarayın.' | Galerim butonu     |
| Boş Sonuç             | eco (gri)               | 'Hiçbir madde tespit edilemedi. Daha iyi ışıkta tekrar deneyin.'              | Yeniden Çek butonu |
| LLM Halüsinasyonu     | warning_amber           | Her sonuçta sabit bilgi kartı: 'Yapay zeka tarafından işlenmiştir.'           | -                  |

**13\. Dosya ve Bileşen İsimlendirme Kuralları**

Flutter projesi aşağıdaki klasör ve isimlendirme yapısını kullanır.

| **Kategori**   | **Format**                  | **Örnek**                  |
| -------------- | --------------------------- | -------------------------- |
| Ekranlar       | snake_case + \_screen.dart  | scanner_screen.dart        |
| Bileşenler     | snake_case + \_widget.dart  | traffic_light_widget.dart  |
| Servisler      | snake_case + \_service.dart | ocr_service.dart           |
| Modeller       | snake_case + \_model.dart   | ingredient_model.dart      |
| Sabitler       | PascalCase sınıf içi        | AppColors.crimsonRed       |
| Asset İkonlar  | snake_case                  | assets/icons/leaf_icon.svg |
| Test Dosyaları | orijinal_ad + \_test.dart   | scanner_screen_test.dart   |

lib/  
├── core/  
│ ├── constants/ (app_colors.dart, app_spacing.dart, app_text_styles.dart)  
│ └── theme/ (app_theme.dart)  
├── features/  
│ ├── scanner/ (scanner_screen.dart, scanner_controller.dart)  
│ ├── deal_lens/ (deal_lens_result.dart, price_card_widget.dart)  
│ └── pure_scan/ (pure_scan_result.dart, ingredient_card_widget.dart)  
├── shared/  
│ ├── widgets/ (primary_button.dart, traffic_light_widget.dart)  
│ └── services/ (ocr_service.dart, llm_service.dart)  
└── main.dart

**14\. Sürüm Geçmişi**

| **Sürüm** | **Tarih** | **Değişiklikler**                                     |
| --------- | --------- | ----------------------------------------------------- |
| v1.0      | 2025      | İlk yayın - MVP kapsamı                               |
| v1.1      | -         | Planlanan: Alerji profili chip'leri, filtre sistemi   |
| v2.0      | -         | Planlanan: Auth, bulut sync, fiyat geçmişi grafikleri |

SmartScan Design System v1.0 · Agile prensipler doğrultusunda hazırlanmıştır · Gizlidir