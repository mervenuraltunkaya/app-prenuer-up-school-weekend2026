<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome'
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
<<<<<<< HEAD
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
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
<<<<<<< HEAD
import { fontFamilies, typography } from '@/theme/typography'
=======
import { typography } from '@/theme/typography'
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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
<<<<<<< HEAD
  const insets = useSafeAreaInsets()
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  const { city, cityId } = useCity()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<string | null>(null)
<<<<<<< HEAD
  const [query, setQuery] = useState('')
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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
<<<<<<< HEAD
    let list = places
    if (category) list = list.filter((p) => p.category === category)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q))
    return list
  }, [places, category, query])
=======
    if (!category) return places
    return places.filter((p) => p.category === category)
  }, [places, category])
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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

<<<<<<< HEAD
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
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
        </Pressable>
      </View>
    )
  }

  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  )
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
<<<<<<< HEAD
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
=======
  btnPressed: { backgroundColor: colors.crimsonDark },
  btnText: { ...typography.h3, color: colors.white },
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
})
