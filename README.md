# Nomad

Turistik keşif, kişisel gezi rotası ve kültürel miras hasar bildirimi için **React Native (Expo)** mobil uygulama. Hasar fotoğrafları **Gemini** ile analiz edilir; veriler **Supabase** üzerinde saklanır.

## Ne yapar?

- **Keşif:** Şehir seçimi, haritada turistik mekanlar, kategori filtresi, Wikipedia özeti
- **Rota:** Mekan ekleme/çıkarma, sıralama, kaydetme, tahmini süre (Google Directions)
- **Hasar raporu:** Fotoğraf yükleme, AI şiddet tespiti (kritik / orta / hafif), raporlarım listesi
- **Hesap:** E-posta ile kayıt/giriş, profil (isim, avatar)

## Repo yapısı

| Klasör | İçerik |
|--------|--------|
| [frontend/](frontend/) | Expo Router mobil arayüz |
| [backend/](backend/) | Supabase migrations + Edge Functions |
| [prodocs/](prodocs/) | PRD, plan, tech stack, tasarım sistemi, ilerleme kaydı |

## Hızlı başlangıç

```bash
cd frontend && npm install
cd .. && npm install
cp .env.example frontend/.env
npm start
```

Veritabanı ve Edge Functions: [backend/README.md](backend/README.md).

## Deploy

**Frontend (web):**

```bash
cd frontend
npx expo export --platform web
```

`dist/` klasörünü Vercel, Netlify veya Expo Hosting ile yayınlayın.

**Backend:** Supabase migration + function deploy ([backend/README.md](backend/README.md)).

## Dokümantasyon

- [prodocs/PRD.md](prodocs/PRD.md)
- [prodocs/tech-stack.md](prodocs/tech-stack.md)
- [prodocs/Plan.md](prodocs/Plan.md)
- [prodocs/DesignSystem.md](prodocs/DesignSystem.md)
- [prodocs/Progress.md](prodocs/Progress.md)

## Güvenlik

Gerçek API anahtarlarını commit etmeyin. Şablon: [.env.example](.env.example).
