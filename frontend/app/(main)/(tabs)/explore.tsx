import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View as RNView,
} from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, View } from '@/components/Themed'
import { CATEGORY_LABELS, PLACE_CATEGORIES } from '@/constants/categories'
import { useCity } from '@/contexts/CityContext'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type PlaceRow = {
  id: string
  city_id: string
  name: string
  category: string
  lat: number
  lng: number
}

export default function ExploreScreen() {
  const router = useRouter()
  const { city, cityId } = useCity()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)

  const loadPlaces = useCallback(async () => {
    if (!cityId) return
    setLoading(true)
    const { data, error } = await supabase.from('places').select('*').eq('city_id', cityId)
    if (!error && data) setPlaces(data as PlaceRow[])
    else setPlaces([])
    setLoading(false)
  }, [cityId])

  useEffect(() => {
    loadPlaces()
  }, [loadPlaces])

  const filtered = useMemo(() => {
    if (!category) return places
    return places.filter((p) => p.category === category)
  }, [places, category])

  const region = useMemo(() => {
    if (!city) {
      return { latitude: 39, longitude: 35, latitudeDelta: 8, longitudeDelta: 8 }
    }
    return {
      latitude: city.lat,
      longitude: city.lng,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    }
  }, [city])

  const mapProvider =
    Platform.OS !== 'web' && process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      ? PROVIDER_GOOGLE
      : undefined

  if (!cityId || !city) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerTitle}>Önce şehir seçmelisin.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Şehir seç"
          style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
          onPress={() => router.push('/city-select')}>
          <Text lightColor={colors.white} darkColor={colors.white} style={styles.btnText}>
            Şehir seç
          </Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <RNView style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>{city.name}</Text>
        <RNView style={styles.toolbarActions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Rota oluştur"
            onPress={() => router.push('/route-builder')}
            style={styles.toolbarBtn}>
            <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
              Rota
            </Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Şehir değiştir" onPress={() => router.push('/city-select')}>
            <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
              Şehir
            </Text>
          </Pressable>
        </RNView>
      </RNView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        <Pressable
          style={[styles.chip, category === null && styles.chipActive]}
          onPress={() => setCategory(null)}>
          <Text style={[styles.chipText, category === null && styles.chipTextActive]}>Tümü</Text>
        </Pressable>
        {PLACE_CATEGORIES.map((c) => (
          <Pressable
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>
              {CATEGORY_LABELS[c] ?? c}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.crimson} />
        </View>
      ) : (
        <MapView
          style={styles.map}
          provider={mapProvider}
          initialRegion={region}
          region={region}>
          {filtered.map((p) => (
            <Marker
              key={p.id}
              coordinate={{ latitude: p.lat, longitude: p.lng }}
              title={p.name}
              description={CATEGORY_LABELS[p.category] ?? p.category}
              onPress={() => router.push({ pathname: '/place/[id]', params: { id: p.id } })}
            />
          ))}
        </MapView>
      )}

      <RNView style={styles.legend}>
        <Text style={styles.legendText}>{filtered.length} mekan</Text>
      </RNView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  centerTitle: { ...typography.body, textAlign: 'center', marginBottom: spacing.sm },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  toolbarTitle: { ...typography.h2 },
  toolbarActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.base },
  toolbarBtn: { marginRight: spacing.xs },
  link: { ...typography.h3 },
  chips: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.cream,
  },
  chipActive: {
    backgroundColor: 'rgba(166, 3, 33, 0.1)',
    borderColor: colors.crimson,
  },
  chipText: { ...typography.caption, color: colors.ink },
  chipTextActive: { color: colors.crimson, fontFamily: typography.h3.fontFamily },
  map: { flex: 1 },
  legend: {
    padding: spacing.md,
    alignItems: 'flex-end',
    backgroundColor: colors.surface,
  },
  legendText: { ...typography.caption },
  btn: {
    marginTop: spacing.base,
    height: 48,
    backgroundColor: colors.crimson,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPressed: { backgroundColor: colors.crimsonDark },
  btnText: { ...typography.h3, color: colors.white },
})
