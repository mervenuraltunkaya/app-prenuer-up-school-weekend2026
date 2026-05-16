import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { setOnboardingComplete } from '@/lib/onboarding'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

const FEATURES = [
  {
    icon: 'map-marker' as const,
    title: 'Tarihi yerleri keşfet',
    body: 'Şehir şehir turistik mekanları harita üzerinde bul.',
  },
  {
    icon: 'random' as const,
    title: 'Kişisel rotanı oluştur',
    body: 'Gezini önceden planla, zamanını verimli kullan.',
  },
  {
    icon: 'flag' as const,
    title: 'Mirası koru',
    body: 'Tarihi yapılardaki hasarları fotoğrafla raporla.',
  },
]

export default function OnboardingScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  async function finish(destination: '/register' | '/login') {
    await setOnboardingComplete()
    router.replace(destination)
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }]}>
      <View style={styles.gridOverlay} pointerEvents="none" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.motto}>KEŞFET · KORU · YAŞAT</Text>
        <Text style={styles.brand}>Nomad</Text>
        <Text style={styles.phonetic}>[ o ]</Text>

        <View style={styles.features}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <FontAwesome name={f.icon} size={16} color={colors.sand} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureBody}>{f.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Başla"
          style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
          onPress={() => void finish('/register')}>
          <Text style={styles.primaryText}>→ Başla</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => void finish('/login')}>
          <Text style={styles.secondaryLink}>Hesabım var, giriş yap</Text>
        </Pressable>
        <View style={styles.dots}>
          <View style={styles.dotActive} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.08,
    borderWidth: 0.5,
    borderColor: colors.sand,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  motto: {
    ...typography.label,
    color: colors.sand,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  brand: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 42,
    lineHeight: 48,
    color: colors.cream,
    textAlign: 'center',
  },
  phonetic: {
    fontFamily: fontFamilies.dmRegular,
    fontSize: 14,
    color: colors.sand,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  features: {
    gap: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    gap: spacing.base,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: fontFamilies.playfairMedium,
    fontSize: 18,
    color: colors.cream,
    marginBottom: spacing.xs,
  },
  featureBody: {
    ...typography.body,
    color: colors.sand,
    lineHeight: 20,
  },
  featureText: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  primary: {
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: {
    backgroundColor: colors.crimsonDark,
  },
  primaryText: {
    fontFamily: fontFamilies.dmMedium,
    fontSize: 16,
    color: colors.white,
  },
  secondaryLink: {
    ...typography.body,
    color: colors.sand,
    textAlign: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  dotActive: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.crimson,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
})
