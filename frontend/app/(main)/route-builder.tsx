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
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type PlaceRow = {
  id: string
  name: string
  category: string
  lat: number
  lng: number
}

export default function RouteBuilderScreen() {
  const router = useRouter()
  const { placeIds, removePlace, moveUp, moveDown, clear } = useRouteDraft()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [dir, setDir] = useState<{ duration_text: string } | null>(null)
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
    </View>
  )
}

const styles = StyleSheet.create({
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
})
