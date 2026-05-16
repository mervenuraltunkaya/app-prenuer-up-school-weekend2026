<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { ScreenHeader } from '@/components/ui/ScreenHeader'
import { CATEGORY_LABELS } from '@/constants/categories'
import { useRouteDraft } from '@/contexts/RouteDraftContext'
import { fetchRouteDirections } from '@/lib/edge'
import { formatKm, haversineKm } from '@/lib/geo'
=======
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { CATEGORY_LABELS } from '@/constants/categories'
import { useRouteDraft } from '@/contexts/RouteDraftContext'
import { fetchRouteDirections } from '@/lib/edge'
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
  name: string
  category: string
  lat: number
  lng: number
}

<<<<<<< HEAD
const DOT_COLORS = [colors.crimson, colors.sand, colors.ink, colors.brown, colors.terracotta]

export default function RouteBuilderScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
=======
export default function RouteBuilderScreen() {
  const router = useRouter()
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  const { placeIds, removePlace, moveUp, moveDown, clear } = useRouteDraft()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
<<<<<<< HEAD
  const [dir, setDir] = useState<{ duration_text: string; distance_meters: number } | null>(null)
=======
  const [dir, setDir] = useState<{ duration_text: string } | null>(null)
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  const [dirLoading, setDirLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadPlaces = useCallback(async () => {
    if (placeIds.length === 0) {
      setPlaces([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase.from('places').select('*').in('id', placeIds)
    if (error || !data) {
      setPlaces([])
    } else {
      const map = new Map(data.map((p) => [p.id, p as PlaceRow]))
      const ordered = placeIds.map((id) => map.get(id)).filter(Boolean) as PlaceRow[]
      setPlaces(ordered)
    }
    setLoading(false)
  }, [placeIds])

  useEffect(() => {
    loadPlaces()
  }, [loadPlaces])

<<<<<<< HEAD
=======
  async function refreshDirections() {
    if (places.length < 2) {
      setDir(null)
      return
    }
    setDirLoading(true)
    try {
      const pts = places.map((p) => ({ lat: p.lat, lng: p.lng }))
      const d = await fetchRouteDirections(pts)
      setDir(d)
    } catch (e) {
      Alert.alert('Yön tarifi', e instanceof Error ? e.message : 'Hata')
      setDir(null)
    } finally {
      setDirLoading(false)
    }
  }

>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  useEffect(() => {
    if (places.length < 2) {
      setDir(null)
      return
    }
    let cancelled = false
    ;(async () => {
      setDirLoading(true)
      try {
        const pts = places.map((p) => ({ lat: p.lat, lng: p.lng }))
        const d = await fetchRouteDirections(pts)
        if (!cancelled) setDir(d)
      } catch {
        if (!cancelled) setDir(null)
      } finally {
        if (!cancelled) setDirLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [places])

<<<<<<< HEAD
  const segmentKm = useMemo(() => {
    const segments: number[] = []
    for (let i = 1; i < places.length; i++) {
      const a = places[i - 1]
      const b = places[i]
      segments.push(haversineKm(a.lat, a.lng, b.lat, b.lng))
    }
    return segments
  }, [places])

  const totalKm = useMemo(() => segmentKm.reduce((s, k) => s + k, 0), [segmentKm])

  const minutesEstimate = useMemo(() => {
    if (dir?.distance_meters) {
      return Math.round(dir.distance_meters / 1000 / 5 * 60)
    }
    return Math.round(totalKm / 5 * 60)
  }, [dir, totalKm])

=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  async function saveRoute() {
    const t = title.trim()
    if (t.length < 2) {
      Alert.alert('Başlık', 'Rota için en az 2 karakterlik bir ad girin.')
      return
    }
    if (placeIds.length === 0) {
      Alert.alert('Rota boş', 'Önce mekan ekleyin.')
      return
    }
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      Alert.alert('Oturum', 'Giriş yapmalısınız.')
      return
    }
    setSaving(true)
    const { data: routeRow, error: rErr } = await supabase
      .from('routes')
      .insert({
        user_id: user.id,
        title: t,
        description: null,
        is_public: false,
      })
      .select('id')
      .single()

    if (rErr || !routeRow) {
      setSaving(false)
      Alert.alert('Kayıt hatası', rErr?.message ?? 'Rota kaydedilemedi')
      return
    }

    const rows = placeIds.map((placeId, index) => ({
      route_id: routeRow.id,
      place_id: placeId,
      order_index: index,
    }))

    const { error: rpErr } = await supabase.from('route_places').insert(rows)
    setSaving(false)
    if (rpErr) {
      Alert.alert('Kayıt hatası', rpErr.message)
      return
    }
    clear()
    setTitle('')
    Alert.alert('Kaydedildi', 'Rota oluşturuldu.', [
      { text: 'Tamam', onPress: () => router.replace('/routes') },
    ])
  }

  if (loading && placeIds.length > 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  return (
<<<<<<< HEAD
    <View style={styles.root}>
      <ScreenHeader title="Rota oluştur" rightLabel="Kaydet" onRightPress={saveRoute} />

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.nameInputWrap}>
          <FontAwesome name="pencil" size={14} color={colors.brown} style={styles.inputIcon} />
          <TextInput
            style={styles.nameInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Tarihi Yarımada Turu"
            placeholderTextColor={colors.brown}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Mekan ekle"
          style={styles.addPlaceInput}
          onPress={() => router.push('/explore')}>
          <FontAwesome name="search" size={14} color={colors.brown} />
          <Text style={styles.addPlacePlaceholder}>Mekan ekle...</Text>
        </Pressable>

        <Text style={styles.summary}>
          {places.length} DURAK · ~{totalKm.toFixed(1)} KM
        </Text>

        <View style={styles.timeline}>
          {places.map((item, index) => (
            <View key={item.id} style={styles.stopRow}>
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: DOT_COLORS[index % DOT_COLORS.length] },
                  ]}
                />
                {index < places.length - 1 ? <View style={styles.line} /> : null}
              </View>
              <View style={styles.stopBody}>
                <Text style={styles.stopName}>{item.name}</Text>
                <Text style={styles.stopMeta}>
                  {CATEGORY_LABELS[item.category] ?? item.category}
                  {segmentKm[index] != null ? ` · ${formatKm(segmentKm[index])}` : ''}
                </Text>
              </View>
              <View style={styles.stopActions}>
                <Pressable accessibilityRole="button" accessibilityLabel="Yukarı taşı" onPress={() => moveUp(index)} hitSlop={8}>
                  <FontAwesome name="chevron-up" size={12} color={colors.brown} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Aşağı taşı" onPress={() => moveDown(index)} hitSlop={8}>
                  <FontAwesome name="chevron-down" size={12} color={colors.brown} />
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel="Durağı kaldır" onPress={() => removePlace(item.id)} hitSlop={8}>
                  <FontAwesome name="bars" size={16} color={colors.brown} />
                </Pressable>
              </View>
            </View>
          ))}
          {places.length === 0 ? (
            <Text style={styles.empty}>Henüz durak yok. Haritadan veya mekan detayından ekleyin.</Text>
          ) : null}
        </View>

        <View style={styles.mapPreview}>
          <Text style={styles.mapPreviewText}>Rota önizlemesi</Text>
        </View>

        <View style={styles.statsBar}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{places.length}</Text>
            <Text style={styles.statLabel}>DURAK</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{totalKm.toFixed(1)}</Text>
            <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statValue}>
              {dirLoading ? '…' : `~${minutesEstimate}`}
            </Text>
            <Text style={styles.statLabel}>DAKİKA</Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geziye başla"
          style={({ pressed }) => [styles.startBtn, pressed && styles.startBtnPressed]}
          onPress={saveRoute}
          disabled={saving}>
          {saving ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <>
              <FontAwesome name="map" size={16} color={colors.ink} />
              <Text style={styles.startBtnText}>Geziye başla</Text>
            </>
          )}
        </Pressable>
      </ScrollView>
=======
    <View style={styles.container}>
      <Text style={styles.label}>Rota adı</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn. İstanbul tarihi tur"
        placeholderTextColor={colors.brown}
        value={title}
        onChangeText={setTitle}
      />

      {dirLoading ? (
        <Text style={styles.meta}>Tahmini süre hesaplanıyor…</Text>
      ) : dir ? (
        <Text style={styles.meta}>Tahmini süre (araç): {dir.duration_text}</Text>
      ) : places.length >= 2 ? (
        <Pressable accessibilityRole="button" onPress={refreshDirections}>
          <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
            Süreyi yeniden hesapla
          </Text>
        </Pressable>
      ) : (
        <Text style={styles.meta}>En az iki durak için süre gösterilir.</Text>
      )}

      <Text style={styles.section}>Duraklar ({places.length})</Text>
      <FlatList
        style={styles.list}
        data={places}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Henüz durak yok. Haritadan veya mekan detayından ekleyin.</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.placeName} lightColor={colors.ink} darkColor={colors.cream}>
                {item.name}
              </Text>
              <Text style={styles.placeMeta}>{CATEGORY_LABELS[item.category] ?? item.category}</Text>
            </View>
            <View style={styles.rowBtns}>
              <Pressable accessibilityRole="button" accessibilityLabel="Yukarı taşı" style={styles.smallBtn} onPress={() => moveUp(index)}>
                <Text>↑</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Aşağı taşı" style={styles.smallBtn} onPress={() => moveDown(index)}>
                <Text>↓</Text>
              </Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Durağı kaldır" style={styles.smallBtn} onPress={() => removePlace(item.id)}>
                <Text>✕</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Rotayı kaydet"
        style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
        onPress={saveRoute}
        disabled={saving}>
        <Text lightColor={colors.white} darkColor={colors.white} style={styles.saveText}>
          {saving ? 'Kaydediliyor…' : 'Rotayı kaydet'}
        </Text>
      </Pressable>
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    </View>
  )
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: spacing.base,
  },
  nameInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  nameInput: {
    flex: 1,
    ...typography.h3,
    color: colors.ink,
  },
  addPlaceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.md,
  },
  addPlacePlaceholder: {
    ...typography.body,
    color: colors.brown,
  },
  summary: {
    ...typography.label,
    marginBottom: spacing.md,
  },
  timeline: {
    marginBottom: spacing.lg,
  },
  stopRow: {
    flexDirection: 'row',
    minHeight: 64,
  },
  timelineCol: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  stopBody: {
    flex: 1,
    paddingLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  stopName: {
    ...typography.h3,
    fontSize: 16,
    color: colors.ink,
  },
  stopMeta: {
    ...typography.caption,
    marginTop: 2,
  },
  stopActions: {
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
  empty: {
    ...typography.body,
    paddingVertical: spacing.lg,
  },
  mapPreview: {
    height: 140,
    backgroundColor: colors.cream,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  mapPreviewText: {
    ...typography.body,
    color: colors.brown,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: colors.border,
  },
  statValue: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 22,
    color: colors.crimson,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.label,
    fontSize: 9,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  startBtnPressed: {
    backgroundColor: colors.surface,
  },
  startBtnText: {
    ...typography.h3,
    fontSize: 15,
  },
=======
  container: { flex: 1, padding: spacing.base },
  list: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { ...typography.label, marginBottom: 6 },
  input: {
    height: 48,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: spacing.md,
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  meta: { ...typography.body, marginBottom: spacing.sm },
  section: { ...typography.h3, marginVertical: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  placeName: { ...typography.h3, fontSize: 16 },
  placeMeta: { ...typography.caption, marginTop: 2 },
  rowBtns: { flexDirection: 'row', gap: 6 },
  smallBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.cream,
  },
  empty: { ...typography.body, paddingVertical: spacing.lg },
  saveBtn: {
    marginTop: 'auto',
    height: 48,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveText: { ...typography.h3, color: colors.white },
  link: { ...typography.h3, marginBottom: spacing.sm },
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
})
