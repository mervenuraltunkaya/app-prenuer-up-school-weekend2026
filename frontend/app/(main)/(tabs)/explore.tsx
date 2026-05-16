import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MapComponent from '../../../components/map/Map'
import { CategoryChips } from '@/components/places/CategoryChips'
import { ExplorePlaceCard } from '@/components/places/ExplorePlaceCard'
import { CATEGORY_LABELS } from '@/constants/categories'
import { useCity } from '@/contexts/CityContext'
import { formatKm, haversineKm } from '@/lib/geo'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

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
  const insets = useSafeAreaInsets()
  const { city, cityId } = useCity()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)
  const [query, setQuery] = useState('')

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
    let list = places
    if (category) list = list.filter((p) => p.category === category)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    return list
  }, [places, category, query])

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

  const mapMarkers = useMemo(
    () =>
      filtered.map((p) => ({
        id: p.id,
        latitude: p.lat,
        longitude: p.lng,
        title: p.name,
        description: CATEGORY_LABELS[p.category] ?? p.category,
      })),
    [filtered],
  )

  const handleMarkerPress = useCallback(
    (placeId: string) => {
      router.push({ pathname: '/place/[id]', params: { id: placeId } })
    },
    [router],
  )

  const distanceFromCenter = useCallback(
    (p: PlaceRow) => {
      if (!city) return undefined
      return formatKm(haversineKm(city.lat, city.lng, p.lat, p.lng))
    },
    [city],
  )

  if (!cityId || !city) {
    return (
      <View style={styles.emptyRoot}>
        <Text style={styles.emptyTitle}>Önce şehir seçmelisin.</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Şehir seç"
          style={({ pressed }) => [styles.cityBtn, pressed && styles.cityBtnPressed]}
          onPress={() => router.push('/city-select')}>
          <Text style={styles.cityBtnText}>Şehir seç</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      <View style={styles.mapWrap}>
        {loading ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator size="large" color={colors.crimson} />
          </View>
        ) : (
          <MapComponent
            style={StyleSheet.absoluteFill}
            region={region}
            markers={mapMarkers}
            onMarkerPress={handleMarkerPress}
          />
        )}

        <View style={[styles.searchOverlay, { top: insets.top + spacing.sm }]}>
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={16} color={colors.brown} />
            <TextInput
              style={styles.searchInput}
              placeholder="Şehir veya mekan ara..."
              placeholderTextColor={colors.brown}
              value={query}
              onChangeText={setQuery}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Şehir değiştir"
              onPress={() => router.push('/city-select')}>
              <FontAwesome name="sliders" size={16} color={colors.brown} />
            </Pressable>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Konumuma git"
          style={styles.locateBtn}
          onPress={() => router.push('/city-select')}>
          <FontAwesome name="location-arrow" size={18} color={colors.white} />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <Text style={styles.sheetTitle}>{city.name}</Text>
        <CategoryChips value={category} onChange={setCategory} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}>
          {filtered.length === 0 && !loading ? (
            <Text style={styles.noPlaces}>Mekan bulunamadı.</Text>
          ) : (
            filtered.map((p) => (
              <ExplorePlaceCard
                key={p.id}
                name={p.name}
                category={p.category}
                distanceLabel={`${distanceFromCenter(p)} · 4.8`}
                onPress={() => handleMarkerPress(p.id)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: spacing.base,
  },
  cityBtn: {
    height: 48,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cityBtnPressed: {
    backgroundColor: colors.crimsonDark,
  },
  cityBtnText: {
    ...typography.h3,
    color: colors.white,
  },
  mapWrap: {
    flex: 1,
    minHeight: 220,
    backgroundColor: colors.cream,
  },
  mapLoading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  searchOverlay: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.base,
    height: 48,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
    paddingVertical: 0,
  },
  locateBtn: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing.base,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    maxHeight: '46%',
    borderTopWidth: 0.5,
    borderColor: colors.border,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  cardsRow: {
    paddingLeft: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  noPlaces: {
    ...typography.body,
    paddingHorizontal: spacing.base,
  },
})
