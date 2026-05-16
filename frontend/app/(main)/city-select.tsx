import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { useCity } from '@/contexts/CityContext'
import type { CityRow } from '@/contexts/CityContext'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function CitySelectScreen() {
  const router = useRouter()
  const { setCityId } = useCity()
  const [cities, setCities] = useState<CityRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase.from('cities').select('*').order('name')
      if (cancelled) return
      if (error || !data) {
        setCities([])
      } else {
        setCities(
          data.map((r) => ({
            id: r.id,
            name: r.name,
            country: r.country,
            lat: r.lat,
            lng: r.lng,
          })),
        )
      }
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function select(id: string) {
    await setCityId(id)
    router.replace('/explore')
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Keşfetmek istediğin şehri seç.</Text>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={() => select(item.id)}>
            <Text style={styles.cityName} lightColor={colors.ink} darkColor={colors.cream}>
              {item.name}
            </Text>
            <Text style={styles.country}>{item.country}</Text>
          </Pressable>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base },
  hint: { ...typography.body, marginBottom: spacing.md },
  row: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.cream,
  },
  rowPressed: { backgroundColor: colors.surface },
  sep: { height: spacing.sm },
  cityName: { ...typography.h3, fontSize: 18 },
  country: { ...typography.caption, marginTop: spacing.xs },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})
