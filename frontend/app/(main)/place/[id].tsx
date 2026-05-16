import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CATEGORY_LABELS } from '@/constants/categories'
import { useCity } from '@/contexts/CityContext'
import { useRouteDraft } from '@/contexts/RouteDraftContext'
import { formatKm, haversineKm } from '@/lib/geo'
import { fetchPlacesWiki } from '@/lib/edge'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

type PlaceRow = {
  id: string
  name: string
  category: string
  lat: number
  lng: number
  wiki_summary: string | null
}

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { city } = useCity()
  const { addPlace } = useRouteDraft()
  const [place, setPlace] = useState<PlaceRow | null>(null)
  const [wiki, setWiki] = useState<string | null>(null)
  const [wikiLoading, setWikiLoading] = useState(false)
  const [wikiMsg, setWikiMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [fav, setFav] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase.from('places').select('*').eq('id', id).maybeSingle()
      if (cancelled) return
      if (error || !data) setPlace(null)
      else setPlace(data as PlaceRow)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!place?.id) return
    let cancelled = false
    ;(async () => {
      if (place.wiki_summary) {
        setWiki(place.wiki_summary)
        return
      }
      setWikiLoading(true)
      setWikiMsg(null)
      try {
        const res = await fetchPlacesWiki(place.id)
        if (cancelled) return
        setWiki(res.summary)
        if (res.message && !res.summary) setWikiMsg(res.message)
      } catch (e) {
        if (!cancelled) setWikiMsg(e instanceof Error ? e.message : 'Özet yüklenemedi')
      } finally {
        if (!cancelled) setWikiLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [place])

  const distanceLabel = useMemo(() => {
    if (!place || !city) return null
    return formatKm(haversineKm(city.lat, city.lng, place.lat, place.lng))
  }, [place, city])

  const aboutText = useMemo(() => {
    if (!wiki) return null
    const parts = wiki.split(/(?<=[.!?])\s+/)
    return parts[0] ?? wiki
  }, [wiki])

  async function onShare() {
    if (!place) return
    try {
      await Share.share({
        message: `${place.name} — Nomad`,
      })
    } catch {
      /* kullanıcı iptal */
    }
  }

  function onMaps() {
    if (!place) return
    Alert.alert('Konum', `${place.lat.toFixed(5)}, ${place.lng.toFixed(5)}`)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text style={styles.body}>Mekan bulunamadı.</Text>
      </View>
    )
  }

  const categoryLabel = CATEGORY_LABELS[place.category] ?? place.category

  return (
    <View style={styles.root}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroGrid}>
            <FontAwesome name="image" size={40} color={colors.sand} />
          </View>
          <View style={[styles.heroActions, { top: insets.top + spacing.sm }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Geri"
              style={styles.circleBtn}
              onPress={() => router.back()}>
              <FontAwesome name="chevron-left" size={14} color={colors.ink} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={fav ? 'Favoriden çıkar' : 'Favoriye ekle'}
              style={styles.circleBtn}
              onPress={() => setFav((v) => !v)}>
              <FontAwesome name={fav ? 'heart' : 'heart-o'} size={16} color={colors.ink} />
            </Pressable>
          </View>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{categoryLabel}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>{place.name}</Text>
          <View style={styles.metaRow}>
            <FontAwesome name="map-marker" size={12} color={colors.brown} />
            <Text style={styles.metaText}>
              {city?.name ?? 'Türkiye'}
              {distanceLabel ? ` · ${distanceLabel}` : ''}
              {' · '}
            </Text>
            <FontAwesome name="star" size={11} color={colors.sand} />
            <Text style={styles.metaText}> 4.8</Text>
          </View>

          <View style={styles.quickRow}>
            <View style={styles.quickPill}>
              <FontAwesome name="clock-o" size={12} color={colors.brown} />
              <Text style={styles.quickText}>08:00 – 22:00</Text>
            </View>
            <View style={styles.quickPill}>
              <FontAwesome name="ticket" size={12} color={colors.brown} />
              <Text style={styles.quickText}>Ücretsiz</Text>
            </View>
            <View style={styles.quickPill}>
              <FontAwesome name="male" size={12} color={colors.brown} />
              <Text style={styles.quickText}>16 dk</Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>HAKKINDA</Text>
          <Text style={styles.body}>
            {aboutText ?? wikiMsg ?? 'Bu mekan hakkında kısa bilgi yükleniyor…'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>WIKIPEDIA ÖZETİ</Text>
          {wikiLoading ? (
            <ActivityIndicator color={colors.crimson} style={{ alignSelf: 'flex-start' }} />
          ) : (
            <Text style={styles.body}>{wiki ?? wikiMsg ?? 'Özet bulunamadı.'}</Text>
          )}

          <View style={styles.actionsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Rotaya ekle"
              style={({ pressed }) => [styles.addRouteBtn, pressed && styles.addRoutePressed]}
              onPress={() => {
                addPlace(place.id)
                router.push('/route-builder')
              }}>
              <FontAwesome name="plus" size={14} color={colors.ink} />
              <Text style={styles.addRouteText}>Rotaya ekle</Text>
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Paylaş" style={styles.iconAction} onPress={onShare}>
              <FontAwesome name="share-alt" size={16} color={colors.ink} />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Konum" style={styles.iconAction} onPress={onMaps}>
              <FontAwesome name="map-marker" size={16} color={colors.ink} />
            </Pressable>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Hasar raporu oluştur"
            style={({ pressed }) => [styles.reportLink, pressed && { opacity: 0.8 }]}
            onPress={() =>
              router.push({ pathname: '/report/new', params: { placeId: place.id } })
            }>
            <Text style={styles.reportLinkText}>Hasar raporu oluştur</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  hero: {
    height: 280,
    backgroundColor: colors.cream,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  heroGrid: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  heroActions: {
    position: 'absolute',
    left: spacing.base,
    right: spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  categoryPill: {
    position: 'absolute',
    left: spacing.base,
    bottom: spacing.lg,
    backgroundColor: colors.crimson,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  categoryPillText: {
    ...typography.caption,
    color: colors.white,
    fontFamily: fontFamilies.dmMedium,
  },
  card: {
    marginTop: -spacing.lg,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 26,
    lineHeight: 32,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  metaText: {
    ...typography.caption,
    color: colors.inkMuted,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  quickText: {
    ...typography.caption,
    color: colors.ink,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  body: {
    ...typography.body,
    color: colors.inkMuted,
  },
  divider: {
    height: 0.5,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  addRouteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  addRoutePressed: {
    backgroundColor: colors.surface,
  },
  addRouteText: {
    ...typography.h3,
    fontSize: 14,
  },
  iconAction: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportLink: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  reportLinkText: {
    ...typography.h3,
    fontSize: 13,
    color: colors.crimson,
  },
})
