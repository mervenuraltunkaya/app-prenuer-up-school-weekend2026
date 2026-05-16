import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

type Props = {
  title: string
  onBack?: () => void
  rightLabel?: string
  onRightPress?: () => void
  dark?: boolean
  stepLabel?: string
  backIcon?: 'chevron' | 'close'
}

export function ScreenHeader({
  title,
  onBack,
  rightLabel,
  onRightPress,
  dark,
  stepLabel,
  backIcon = 'chevron',
}: Props) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + spacing.sm }, dark && styles.wrapDark]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Geri"
        style={[styles.iconBtn, dark && styles.iconBtnDark]}
        onPress={onBack ?? (() => router.back())}>
        <FontAwesome
          name={backIcon === 'close' ? 'times' : 'chevron-left'}
          size={backIcon === 'close' ? 16 : 14}
          color={dark ? colors.cream : colors.ink}
        />
      </Pressable>
      <Text style={[styles.title, dark && styles.titleDark]} numberOfLines={1}>
        {title}
      </Text>
      {stepLabel ? (
        <Text style={styles.step}>{stepLabel}</Text>
      ) : rightLabel ? (
        <Pressable
          accessibilityRole="button"
          onPress={onRightPress}
          style={[styles.rightBtn, dark && styles.rightBtnDark]}>
          <Text style={[styles.rightText, dark && styles.rightTextDark]}>{rightLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  wrapDark: {
    backgroundColor: colors.ink,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  iconBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  title: {
    flex: 1,
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 22,
    lineHeight: 28,
    color: colors.ink,
    textAlign: 'center',
  },
  titleDark: {
    color: colors.cream,
  },
  step: {
    ...typography.label,
    color: colors.brown,
    minWidth: 72,
    textAlign: 'right',
  },
  rightBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    minWidth: 72,
    alignItems: 'center',
  },
  rightBtnDark: {
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'transparent',
  },
  rightText: {
    ...typography.h3,
    fontSize: 13,
    color: colors.ink,
  },
  rightTextDark: {
    color: colors.cream,
  },
})
