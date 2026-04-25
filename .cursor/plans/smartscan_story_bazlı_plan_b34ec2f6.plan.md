---
name: SmartScan Story Bazlı Plan
overview: Teknik PRD’deki US01-US04 için her biri bağımsız uygulanabilir geliştirme planı, teknik görevler ve doğrulama kriterleri tanımlanacaktır. Plan Flutter mimarisi, OCR+LLM akışı ve design system kurallarıyla uyumlu olacak şekilde yapılandırılır.
todos:
  - id: us01-foundation
    content: US01 için scanner açılış, kamera lifecycle ve izin akışını tasarlayıp doğrulamak
    status: completed
  - id: us02-gallery
    content: US02 için image picker tabanlı galeri seçimi ve ortak analiz girişini planlamak
    status: completed
  - id: us03-unit-price
    content: US03 için OCR parse, birim dönüşümü ve fiyat hesaplama modül planını netleştirmek
    status: completed
  - id: us04-pure-scan
    content: US04 için LLM sınıflandırma, trafik ışığı UI ve risk metinlerini planlamak
    status: completed
  - id: qa-release
    content: Story bazlı test matrisi, sprint sırası ve risk azaltma adımlarını finalize etmek
    status: completed
isProject: false
---

# SmartScan MVP - User Story Bazlı Geliştirme Planı

## Referanslar
- PRD: [C:\Users\Owner\OneDrive\Masaüstü\smartScan\Teknik PRD_ SmartScan.md](C:\Users\Owner\OneDrive\Masaüstü\smartScan\Teknik PRD_ SmartScan.md)
- Design system: [C:\Users\Owner\OneDrive\Masaüstü\smartScan\.cursor\rules\frontend\design-system.md](C:\Users\Owner\OneDrive\Masaüstü\smartScan\.cursor\rules\frontend\design-system.md)

## Mimari Çerçeve (Tüm Story’ler İçin Ortak)
- Flutter feature-first yapı kurulumu: `core`, `shared`, `features`.
- Ortak servis katmanı:
  - OCR: `google_mlkit_text_recognition`
  - LLM: OpenAI `gpt-4o-mini`, düşük temperature, JSON schema odaklı prompt
- State yönetimi: Riverpod/Provider tabanlı `loading/success/error` akışı.
- Sonuç sunumu: Kamera üstünde çalışan, alttan açılan Bottom Sheet.
- Design system token zorunluluğu: renk/spacing/radius/typography değerleri sabitlerden tüketilir.

## US01 - Uygulama açıldığında kameranın hazır olması

### Hedef
Kullanıcı uygulamayı açar açmaz kamera preview’ini gecikmesiz görmeli ve taramaya başlayabilmeli.

### Uygulama Planı
- Uygulama kabuğu ve başlangıç rotası:
  - `main.dart` başlangıçta scanner ekranına yönlensin.
  - İsteğe bağlı kısa splash sonrası otomatik geçiş.
- Kamera yaşam döngüsü:
  - `features/scanner/scanner_controller.dart` içinde kamera init/dispose ve izin yönetimi.
  - Uygulama arka plana geçince kamera pause, geri dönünce resume.
- Scanner UI:
  - `features/scanner/scanner_screen.dart` tam ekran preview + overlay + mod seçici + analiz butonu.
  - Erişilebilirlik: tüm ikonlarda semantic label, minimum 48x48 dokunma alanı.
- Hata durumları:
  - Kamera izni reddi, cihaz kamera hatası, yeniden dene akışı.

### Kabul Kriterleri
- Uygulama açılışından sonra kullanıcı en geç 2-3 saniye içinde canlı preview görür.
- İzin verildiğinde otomatik başlar, izin reddinde açıklayıcı fallback görünür.
- Kamera ekranı yeniden açıldığında resource leak olmadan çalışır.

### Test Planı
- Widget test: scanner ekran temel bileşenleri.
- Entegrasyon testi: izin verildi/engellendi senaryosu.
- Manuel test: Android ve iOS’ta cold start, background/foreground geçişleri.

## US02 - Galeriden ekran görüntüsü yükleyebilme

### Hedef
Kullanıcı canlı kameraya alternatif olarak galeriden görsel seçip aynı analiz akışını kullanabilmeli.

### Uygulama Planı
- Galeri entegrasyonu:
  - `shared/services/image_picker_service.dart` ile `image_picker` sarmalaması.
  - Dosya tipi/boş dosya/iptal senaryolarını normalize eden response modeli.
- Preview ve analiz hazırlığı:
  - `features/scanner/scanner_screen.dart` içinde seçilen görseli gösteren preview durumu.
  - Kaynaktan bağımsız ortak analiz tetikleyicisi (kamera frame veya galeri resmi).
- Hata yönetimi:
  - Uygun olmayan görsel, OCR başarısızlığı, kullanıcı iptali için snackbar mesajları.
- UX uyumu:
  - Galeri butonu scanner ekranında sabit ve erişilebilir konumda.
  - Analiz butonu yalnızca geçerli input varken aktif.

### Kabul Kriterleri
- Kullanıcı galeriden tek görsel seçebilir ve preview üzerinde analiz başlatabilir.
- Analiz sonucu akışı kamera kaynağıyla aynı bileşenlerde açılır.
- İptal/başarısızlık durumlarında uygulama kilitlenmeden başlangıç durumuna döner.

### Test Planı
- Service unit test: `null`, `cancel`, `valid image` sonuçları.
- Widget test: galeri seçiminden sonra analiz buton aktivasyonu.
- Manuel test: farklı çözünürlük ve screenshot formatlarıyla deneme.

## US03 - Farklı gramajlar için 1 kg birim fiyatı görme

### Hedef
OCR’dan gelen fiyat ve gramaj bilgisinden güvenilir bir birim fiyat hesabı üretmek.

### Uygulama Planı
- Veri çıkarımı:
  - `shared/services/ocr_service.dart` ham metni normalize etsin (ondalık ayırıcı, birim varyasyonları).
  - `features/deal_lens/price_parser.dart` fiyat/gramaj pattern extraction.
- Hesaplama motoru:
  - `features/deal_lens/unit_price_calculator.dart` gram/ml/l birim dönüşümleri.
  - Geçersiz veri için doğrulama ve fallback mesajları.
- Sonuç ekranı:
  - `features/deal_lens/deal_lens_result_sheet.dart` içinde price hero + ham değerler + AI uyarı metni.
- Güvenlik/şeffaflık:
  - Sonuçta “AI tarafından okunmuştur, lütfen kontrol ediniz.” mesajı zorunlu.

### Kabul Kriterleri
- Fiyat ve gramaj çıkarılabildiğinde `TL/kg` veya `TL/L` doğru hesaplanır.
- Decimal ve farklı birim yazımları (g, gr, kg, ml, l) desteklenir.
- Veri eksikse kullanıcıya neden hesaplanamadığı açıkça gösterilir.

### Test Planı
- Unit test: dönüşüm ve hesaplama fonksiyonları (kenar durumlar dahil).
- Parser test: örnek OCR metinlerinden fiyat/gramaj çıkarımı.
- Manuel test: farklı etiket fotoğraflarıyla sonuç doğrulaması.

## US04 - İçindekilerde tehlikeli maddelerin kırmızı vurgulanması

### Hedef
İçerik maddelerini AI ile sınıflandırıp trafik ışığı sistemiyle anlaşılır ve erişilebilir şekilde göstermek.

### Uygulama Planı
- Prompt ve LLM katmanı:
  - `shared/services/llm_service.dart` için JSON çıktısı zorlayan sistem promptu.
  - `features/pure_scan/ingredient_analyzer.dart` içinde status enum eşlemesi (`safe/warning/danger`).
- Trafik ışığı UI:
  - `shared/widgets/traffic_light_badge_widget.dart` ve `ingredient_card_widget.dart`.
  - Renk + ikon + metin etiketi birlikte zorunlu gösterim.
- Listeleme kuralları:
  - Sonuçlar risk seviyesine göre sıralanır (danger -> warning -> safe).
  - Üstte en kötü durumu temsil eden özet badge.
- Risk metinleri:
  - Sonuçta “Bu içerik tıbbi tavsiye değildir.” ibaresi.
  - API yanıtı parse edilemezse güvenli fallback ekranı.

### Kabul Kriterleri
- Her madde için durum etiketi açıkça görünür: Zararlı / Dikkat / Güvenli.
- Kırmızı maddeler listede öncelikli ve belirgin biçimde sunulur.
- Renk körlüğü için ikon + metin desteği tüm durumlarda korunur.

### Test Planı
- Unit test: LLM JSON parse ve enum mapping.
- Widget test: kart renk/ikon/metin kombinasyonu.
- Manuel test: örnek içerik listelerinde sıralama ve badge doğruluğu.

## Önerilen Sprint Sıralaması
- Sprint 1: US01 (kamera hazır olma) + temel scanner iskeleti.
- Sprint 2: US02 (galeri akışı) + ortak analiz tetikleme.
- Sprint 3: US03 (deal-lens parser + hesaplama + sonuç sheet).
- Sprint 4: US04 (pure-scan LLM sınıflandırma + trafik ışığı UI).
- Sprint 5: Uçtan uca kalite: performans, hata mesajları, erişilebilirlik, release hazırlığı.

## Bağımlılıklar ve Risk Azaltma
- OCR hata riski: düşük güven skoru durumunda kullanıcı doğrulama mesajı.
- LLM halüsinasyon riski: düşük temperature + zorunlu yasal metin + JSON schema validation.
- Maliyet riski: yalnızca gerekli durumlarda API çağrısı, kısa prompt ve token limitleri.
- UI tutarlılığı: tüm yeni bileşenlerde design token ve tema sınıfları dışında değer kullanılmaması.