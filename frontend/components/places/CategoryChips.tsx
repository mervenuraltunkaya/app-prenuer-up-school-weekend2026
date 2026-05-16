import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import { CATEGORY_LABELS, PLACE_CATEGORIES } from '@/constants/categories'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type Props = {
  value: string | null
  onChange: (category: string | null) => void
}

export function CategoryChips({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pressable
        style={[styles.chip, value === null && styles.chipActive]}
        onPress={() => onChange(null)}>
        <Text style={[styles.chipText, value === null && styles.chipTextActive]}>Tümü</Text>
      </Pressable>
      {PLACE_CATEGORIES.map((c) => (
        <Pressable
          key={c}
          style={[styles.chip, value === c && styles.chipActive]}
          onPress={() => onChange(c)}>
          <Text style={[styles.chipText, value === c && styles.chipTextActive]}>
            {CATEGORY_LABELS[c] ?? c}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    alignItems: 'center',
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  chipText: {
    ...typography.caption,
    color: colors.ink,
  },
  chipTextActive: {
    color: colors.white,
    fontFamily: typography.h3.fontFamily,
  },
})
