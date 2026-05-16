import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useRouteDraft } from '@/contexts/RouteDraftContext'
import { haversineKm } from '@/lib/geo'
import { supabase } from '@/lib/supabase'
import { colors, semantic } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

type RouteListItem = {
  id: string
  title: string
  created_at: string
  stopCount: number
  totalKm: number
  status: 'aktif' | 'tamamlandi'
}

const ACTIVE_DAYS = 30

function routeStatus(createdAt: string): 'aktif' | 'tamamlandi' {
  const ageMs = Date.now() - new Date(createdAt).getTime()
  const days = ageMs / (1000 * 60 * 60 * 24)
  return days <= ACTIVE_DAYS ? 'aktif' : 'tamamlandi'
}

function statusBadge(status: 'aktif' | 'tamamlandi') {
  if (status === 'aktif') {
    return { bg: semantic.lowBg, text: semantic.lowText, label: 'AKTİF' }
  }
  return { bg: colors.cream, text: colors.brown, label: 'TAMAMLANDI' }
}

export default function RoutesTabScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { setOrder } = useRouteDraft()
  const [routes, setRoutes] = useState<RouteListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameTitle, setRenameTitle] = useState('')
  const [renaming, setRenaming] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: routeRows, error } = await supabase
      .from('routes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })

    if (error || !routeRows?.length) {
      setRoutes([])
      setLoading(false)
      return
    }

    const routeIds = routeRows.map((r) => r.id)
    const { data: routePlaces } = await supabase
      .from('route_places')
      .select('route_id, place_id, order_index, places ( lat, lng )')
      .in('route_id', routeIds)
      .order('order_index', { ascending: true })

    const stopsByRoute = new Map<string, { lat: number; lng: number }[]>()
    for (const rp of routePlaces ?? []) {
      const place = rp.places as { lat: number; lng: number } | null
      if (!place) continue
      const list = stopsByRoute.get(rp.route_id) ?? []
      list.push({ lat: place.lat, lng: place.lng })
      stopsByRoute.set(rp.route_id, list)
    }

    const enriched: RouteListItem[] = routeRows.map((r) => {
      const stops = stopsByRoute.get(r.id) ?? []
      let totalKm = 0
      for (let i = 1; i < stops.length; i++) {
        totalKm += haversineKm(
          stops[i - 1].lat,
          stops[i - 1].lng,
          stops[i].lat,
          stops[i].lng,
        )
      }
      return {
        id: r.id,
        title: r.title,
        created_at: r.created_at,
        stopCount: stops.length,
        totalKm,
        status: routeStatus(r.created_at),
      }
    })

    setRoutes(enriched)
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

  async function openRouteDetail(item: RouteListItem) {
    const { data, error } = await supabase
      .from('route_places')
      .select('place_id, order_index')
      .eq('route_id', item.id)
      .order('order_index', { ascending: true })

    if (error || !data?.length) {
      Alert.alert('Rota', 'Bu rotada durak bulunamadı.')
      return
    }

    setOrder(data.map((row) => row.place_id))
    router.push('/route-builder')
  }

  function startRename(item: RouteListItem) {
    setRenameId(item.id)
    setRenameTitle(item.title)
  }

  async function saveRename() {
    if (!renameId) return
    const title = renameTitle.trim()
    if (title.length < 2) {
      Alert.alert('Başlık', 'Rota adı en az 2 karakter olmalı.')
      return
    }
    setRenaming(true)
    const { error } = await supabase.from('routes').update({ title }).eq('id', renameId)
    setRenaming(false)
    if (error) Alert.alert('Hata', error.message)
    else {
      setRenameId(null)
      void load()
    }
  }

  async function removeRoute(id: string) {
    Alert.alert('Rotayı sil', 'Emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('routes').delete().eq('id', id)
          if (error) Alert.alert('Hata', error.message)
          else void load()
        },
      },
    ])
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Rotalarım</Text>
          <Text style={styles.subtitle}>{routes.length} kayıtlı rota</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yeni rota oluştur"
          style={({ pressed }) => [styles.newBtn, pressed && styles.newBtnPressed]}
          onPress={() => router.push('/route-builder')}>
          <FontAwesome name="plus" size={14} color={colors.white} />
        </Pressable>
      </View>

      <FlatList
        style={styles.list}
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.crimson} />
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.crimson} />
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.empty}>Henüz kayıtlı rota yok.</Text>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/route-builder')}
                style={styles.emptyCta}>
                <Text style={styles.emptyCtaText}>İlk rotanı oluştur</Text>
              </Pressable>
            </View>
          )
        }
        renderItem={({ item }) => (
          <RouteCard
            item={item}
            onPress={() => void openRouteDetail(item)}
            onEdit={() => startRename(item)}
            onDelete={() => void removeRoute(item.id)}
          />
        )}
      />

      <Modal visible={renameId !== null} animationType="fade" transparent onRequestClose={() => setRenameId(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Rota adını düzenle</Text>
            <TextInput
              style={styles.modalInput}
              value={renameTitle}
              onChangeText={setRenameTitle}
              placeholder="Rota adı"
              placeholderTextColor={colors.brown}
              autoFocus
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setRenameId(null)}>
                <Text style={styles.modalCancelText}>İptal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSave, renaming && styles.modalSaveDisabled]}
                onPress={saveRename}
                disabled={renaming}>
                {renaming ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Kaydet</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

function RouteCard({
  item,
  onPress,
  onEdit,
  onDelete,
}: {
  item: RouteListItem
  onPress: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const badge = statusBadge(item.status)

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      onLongPress={onDelete}>
      <View style={styles.cardTop}>
        <View style={styles.cardMain}>
          <View style={styles.titleRow}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rota adını düzenle"
              hitSlop={8}
              onPress={(e) => {
                e.stopPropagation?.()
                onEdit()
              }}>
              <FontAwesome name="pencil" size={14} color={colors.brown} />
            </Pressable>
          </View>
          <Text style={styles.cardMeta}>
            {item.stopCount} Durak · {item.totalKm.toFixed(1)} KM
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>
        <FontAwesome name="chevron-right" size={14} color={colors.crimson} />
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString('tr-TR')}</Text>
        <Text style={styles.detail}>Detay ›</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 28,
    lineHeight: 34,
    color: colors.ink,
  },
  subtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  newBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newBtnPressed: {
    backgroundColor: colors.crimsonDark,
  },
  list: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.95,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  cardMain: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.ink,
    flex: 1,
  },
  cardMeta: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.full,
    marginTop: spacing.xs,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: typography.h3.fontFamily,
    letterSpacing: 0.4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 0.5,
    borderTopColor: colors.border,
  },
  time: {
    ...typography.caption,
    color: colors.brown,
  },
  detail: {
    ...typography.h3,
    fontSize: 13,
    color: colors.crimson,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
  },
  emptyCta: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  emptyCtaText: {
    ...typography.h3,
    fontSize: 13,
    color: colors.crimson,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 16, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  modalInput: {
    height: 48,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    ...typography.h3,
    color: colors.inkMuted,
  },
  modalSave: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveDisabled: {
    opacity: 0.6,
  },
  modalSaveText: {
    ...typography.h3,
    color: colors.white,
  },
})
