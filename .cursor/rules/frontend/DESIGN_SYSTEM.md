# Nomad — Design System v1.0

**Proje:** Turistik Keşif & Kültürel Miras Koruma  
**Platform:** React Native + Expo (Mobile First)  
**Yaklaşım:** 8px grid, mobile-first, responsive  

---

## 1. Renk Paleti

### Temel Renkler

| İsim | Hex | RGB | Kullanım |
|---|---|---|---|
| Crimson | `#A60321` | 166, 3, 33 | Primary / CTA / Aktif durum |
| Crimson Dark | `#7A0118` | 122, 1, 24 | Hover / Pressed state |
| Crimson Light | `#D4042A` | 212, 4, 42 | Focus ring |
| Cream | `#F2E9D8` | 242, 233, 216 | Background / Surface / Secondary buton |
| Brown | `#8C5C32` | 140, 92, 50 | Secondary text / Muted / Icon |
| Sand | `#D9A577` | 217, 165, 119 | Accent / Highlight / Tag |
| Terracotta | `#D97B66` | 217, 123, 102 | Warm accent / Kart görselleri |
| Ink | `#1C1410` | 28, 20, 16 | Başlık metni / Body |
| Ink Muted | `#4A3728` | 74, 55, 40 | Body secondary |
| Surface | `#FAF6EF` | 250, 246, 239 | Input bg / Chip bg |

### Semantik Renkler

| Durum | Arka plan | Metin | Kullanım |
|---|---|---|---|
| Kritik hasar | `#FEE2E2` | `#7A0118` | Hasar severity badge |
| Orta hasar | `#FEF3C7` | `#92400E` | Hasar severity badge |
| Hafif hasar | `#ECFDF5` | `#065F46` | Hasar severity badge |
| İletildi | `#ECFDF5` | `#065F46` | Rapor status |
| Bekliyor | `#FAF6EF` | `#8C5C32` | Rapor status |

### CSS Variables (React Native'de StyleSheet)

```javascript
// theme/colors.ts
export const colors = {
  crimson: '#A60321',
  crimsonDark: '#7A0118',
  crimsonLight: '#D4042A',
  cream: '#F2E9D8',
  brown: '#8C5C32',
  sand: '#D9A577',
  terracotta: '#D97B66',
  ink: '#1C1410',
  inkMuted: '#4A3728',
  surface: '#FAF6EF',
  white: '#FFFFFF',
  border: 'rgba(140, 92, 50, 0.18)',
  borderMedium: 'rgba(140, 92, 50, 0.28)',
  borderStrong: 'rgba(140, 92, 50, 0.4)',
}

export const semantic = {
  criticalBg: '#FEE2E2',
  criticalText: '#7A0118',
  mediumBg: '#FEF3C7',
  mediumText: '#92400E',
  lowBg: '#ECFDF5',
  lowText: '#065F46',
}
```

---

## 2. Tipografi

### Font Ailesi

| Font | Kullanım | Import |
|---|---|---|
| Playfair Display | Başlıklar (H1, H2) | `expo-google-fonts/playfair-display` |
| DM Sans | Gövde, UI elementleri | `expo-google-fonts/dm-sans` |

```bash
npx expo install @expo-google-fonts/playfair-display @expo-google-fonts/dm-sans expo-font
```

### Tipografi Skalası

| Token | Font | Boyut | Ağırlık | Line Height | Kullanım |
|---|---|---|---|---|---|
| `h1` | Playfair Display | 26px | 600 | 1.2 | Sayfa başlığı |
| `h2` | Playfair Display | 20px | 500 | 1.3 | Bölüm başlığı |
| `h3` | DM Sans | 15px | 500 | 1.4 | Kart başlığı |
| `body` | DM Sans | 14px | 400 | 1.6 | Gövde metni |
| `caption` | DM Sans | 11px | 400 | 1.5 | Yardımcı metin |
| `label` | DM Sans | 10px | 500 | 1.4 | Kategori etiketi (uppercase) |

```javascript
// theme/typography.ts
export const typography = {
  h1: {
    fontFamily: 'PlayfairDisplay_600SemiBold',
    fontSize: 26,
    lineHeight: 31,
    letterSpacing: -0.3,
    color: colors.ink,
  },
  h2: {
    fontFamily: 'PlayfairDisplay_500Medium',
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
  },
  h3: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 15,
    lineHeight: 21,
    color: colors.ink,
  },
  body: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    color: colors.inkMuted,
  },
  caption: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 11,
    lineHeight: 16,
    color: colors.brown,
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.brown,
  },
}
```

---

## 3. Boşluk Sistemi (8px Grid)

| Token | Değer | Kullanım |
|---|---|---|
| `xs` | 4px | İkon boşluğu, micro gap |
| `sm` | 8px | Chip arası, badge |
| `md` | 12px | Kart iç boşluk |
| `base` | 16px | Standart padding |
| `lg` | 24px | Bölüm arası |
| `xl` | 32px | Ekran kenar boşluğu |
| `xxl` | 48px | Büyük bölüm arası |

```javascript
// theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}
```

---

## 4. Border Radius

| Token | Değer | Kullanım |
|---|---|---|
| `sm` | 6px | Küçük eleman, iç element |
| `md` | 12px | Input, chip, badge |
| `lg` | 20px | Kart, modal, bottom sheet |
| `full` | 999px | Buton, pill, avatar |

```javascript
// theme/radius.ts
export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 999,
}
```

---

## 5. Bileşenler

### 5.1 Butonlar

```javascript
// components/ui/Button.tsx

// Primary Button
const primaryButton = {
  container: {
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  text: {
    ...typography.h3,
    color: colors.white,
  }
}

// Secondary Button
const secondaryButton = {
  container: {
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 0.5,
    borderColor: colors.border,
    // ...aynı layout
  },
  text: {
    ...typography.h3,
    color: colors.crimson,
  }
}

// Outline Button
const outlineButton = {
  container: {
    height: 48,
    borderRadius: radius.full,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.brown,
  },
  text: {
    ...typography.h3,
    color: colors.ink,
  }
}

// Small Button
const smallButton = {
  container: {
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    fontFamily: 'DMSans_500Medium',
    fontSize: 12,
    color: colors.white,
  }
}

// Icon Button (daire)
const iconButton = {
  container: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.cream,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  }
}
```

### 5.2 Input

```javascript
// components/ui/Input.tsx
const inputStyle = {
  container: {
    position: 'relative',
  },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingLeft: 40, // ikonlu versiyonda
    ...typography.body,
    color: colors.ink,
  },
  inputRounded: {
    borderRadius: radius.md, // köşeli versiyon
  },
  icon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    // transform ile dikey ortalama
  }
}
```

### 5.3 Chip / Tag

```javascript
// components/ui/Chip.tsx
const chipStyle = {
  base: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  text: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  // Aktif durum
  active: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  activeText: {
    color: colors.white,
  },
  // Sand varyant
  sand: {
    backgroundColor: colors.sand,
    borderColor: colors.sand,
  }
}
```

### 5.4 Badge

```javascript
// components/ui/Badge.tsx
const badgeStyle = {
  base: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  text: {
    fontSize: 10,
    fontFamily: 'DMSans_500Medium',
    letterSpacing: 0.4,
  },
  // Varyantlar
  critical: { backgroundColor: '#FEE2E2' },
  criticalText: { color: '#7A0118' },
  medium: { backgroundColor: '#FEF3C7' },
  mediumText: { color: '#92400E' },
  low: { backgroundColor: '#ECFDF5' },
  lowText: { color: '#065F46' },
  new: { backgroundColor: colors.crimson },
  newText: { color: colors.white },
}
```

### 5.5 Mekan Kartı

```javascript
// components/PlaceCard.tsx
const placeCardStyle = {
  container: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    width: '100%',
    height: 140,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  body: {
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  }
}
```

### 5.6 Hasar Raporu Kartı

```javascript
// components/ReportCard.tsx
const reportCardStyle = {
  container: {
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  }
}
```

### 5.7 Alt Navigasyon

```javascript
// components/BottomNav.tsx
const bottomNavStyle = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.white,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
    paddingBottom: 24, // safe area
    paddingTop: 12,
    paddingHorizontal: spacing.sm,
  },
  item: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemText: {
    fontSize: 10,
    fontFamily: 'DMSans_400Regular',
    color: colors.brown,
  },
  itemTextActive: {
    color: colors.crimson,
  },
  // Ortadaki FAB butonu
  fabButton: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -18,
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  }
}
```

---

## 6. İkon Seti

Tabler Icons kullanılacak: `@tabler/icons-react-native`

```bash
npx expo install @tabler/icons-react-native
```

### Kullanılan İkonlar

| İkon | Bileşen | Kullanım |
|---|---|---|
| `IconMapPin` | Konum göstergesi | Mekan konumu |
| `IconMap2` | Harita sekmesi | Alt nav |
| `IconRoute` | Rota sekmesi | Alt nav |
| `IconCamera` | FAB butonu | Hızlı rapor |
| `IconFlag` | Raporlar sekmesi | Alt nav |
| `IconUser` | Profil sekmesi | Alt nav |
| `IconSearch` | Arama | Input ikonu |
| `IconStar` | Favori | Kart aksiyonu |
| `IconShare` | Paylaş | Kart aksiyonu |
| `IconHeart` | Beğeni | Kart aksiyonu |
| `IconPlus` | Ekle | Buton ikonu |
| `IconChevronRight` | Navigasyon | Liste items |
| `IconAlertTriangle` | Uyarı | Hasar severity |
| `IconCheck` | Onay | Status badge |

### Boyutlar

| Kullanım | Boyut |
|---|---|
| Alt nav | 22px |
| Kart ikonları | 18px |
| Input ikonu | 16px |
| Badge / inline | 14px |
| FAB butonu | 24px |

---

## 7. Yüzey Hiyerarşisi

| Seviye | Arka plan | Border | Kullanım |
|---|---|---|---|
| 0 — Varsayılan | `#FFFFFF` | 0.5px `border` | Kart, modal |
| 1 — Surface | `#FAF6EF` | 0.5px `border` | Input, chip bg |
| 2 — Vurgulu | `#FFFFFF` | 1px `borderMedium` | Hover / seçili |
| 3 — Aktif | `#FFFFFF` | 1.5px `crimson` | Aktif seçim |
| Screen bg | `#F2E9D8` | — | Ana ekran arka planı |

---

## 8. Ekran Kenar Boşlukları

```javascript
// Tüm ekranlar için standart
const screenPadding = {
  paddingHorizontal: 20, // 20px her iki yandan
}

// Safe area — Expo ile
import { useSafeAreaInsets } from 'react-native-safe-area-context'
```

---

## 9. Harita Stili

Google Maps için özel harita teması — krem tonlarına uygun:

```javascript
// theme/mapStyle.ts
export const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#f2e9d8' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a3728' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f2e9d8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#d9a577' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d8e8' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d4e8c4' }] },
]
```

---

## 10. Animasyon Kuralları

| Durum | Süre | Easing |
|---|---|---|
| Buton press | 100ms | ease-in |
| Ekran geçişi | 300ms | ease-in-out |
| Modal açılış | 250ms | ease-out |
| Kart mount | 200ms | ease-out |

```javascript
// React Native Reanimated ile
import Animated, { 
  useSharedValue, 
  withSpring,
  withTiming 
} from 'react-native-reanimated'

// Buton press efekti
const scale = useSharedValue(1)
const onPressIn = () => { scale.value = withSpring(0.97) }
const onPressOut = () => { scale.value = withSpring(1) }
```

---

## 11. Cursor İçin Component Üretim Talimatları

Bu design system'i Cursor'a verirken şu promptu kullan:

```
Bu projenin DESIGN_SYSTEM.md dosyasını referans al.
- Renkler: colors.ts'den import et, hardcode etme
- Tipografi: typography.ts'den import et
- Tüm bileşenler StyleSheet.create() ile yazılsın
- Tabler Icons kullan (@tabler/icons-react-native)
- Font: Playfair Display başlıklar, DM Sans gövde
- Border radius: radius.ts'den import et
- Spacing: spacing.ts'den import et
- Tüm dokunulabilir alanlar min 44x44px olsun (accessibility)
```

---

## 12. Dosya Yapısı

```
src/
  theme/
    colors.ts
    typography.ts
    spacing.ts
    radius.ts
    mapStyle.ts
    index.ts        (hepsini export eder)
  components/
    ui/
      Button.tsx
      Input.tsx
      Chip.tsx
      Badge.tsx
    PlaceCard.tsx
    ReportCard.tsx
    BottomNav.tsx
```
