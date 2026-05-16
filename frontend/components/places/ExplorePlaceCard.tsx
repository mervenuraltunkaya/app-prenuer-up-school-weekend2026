import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { CATEGORY_LABELS } from '@/constants/categories'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

type Props = {
  name: string
  category: string
  distanceLabel?: string
  onPress: () => void
}

export function ExplorePlaceCard({ name, category, distanceLabel, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{CATEGORY_LABELS[category] ?? category}</Text>
      </View>
      <View style={styles.imagePlaceholder}>
        <FontAwesome name="image" size={22} color={colors.sand} />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {name}
      </Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{distanceLabel ?? '—'}</Text>
        <FontAwesome name="star" size={10} color={colors.sand} />
      </View>
    </Pressable>
  )
}

const CARD_WIDTH = 156

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginRight: spacing.md,
  },
  cardPressed: {
    opacity: 0.92,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...typography.caption,
    color: colors.crimson,
    fontFamily: fontFamilies.dmMedium,
  },
  imagePlaceholder: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  meta: {
    ...typography.caption,
    flex: 1,
  },
})
