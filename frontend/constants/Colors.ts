import { colors } from '@/theme/colors'

const tabMuted = 'rgba(140, 92, 50, 0.45)'

export default {
  light: {
    text: colors.ink,
    textMuted: colors.inkMuted,
    background: colors.surface,
    tint: colors.crimson,
    tabIconDefault: tabMuted,
    tabIconSelected: colors.crimson,
    card: colors.cream,
    border: colors.border,
    link: colors.crimson,
    destructive: colors.crimsonDark,
  },
  dark: {
    text: colors.cream,
    textMuted: 'rgba(242, 233, 216, 0.72)',
    background: colors.ink,
    tint: colors.crimsonLight,
    tabIconDefault: 'rgba(217, 165, 119, 0.45)',
    tabIconSelected: colors.crimsonLight,
    card: '#352A22',
    border: colors.borderStrong,
    link: colors.crimsonLight,
    destructive: colors.terracotta,
  },
} as const
