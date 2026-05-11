import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { CATEGORY_LABELS } from '@/constants/categories'
import { useRouteDraft } from '@/contexts/RouteDraftContext'
import { fetchPlacesWiki } from '@/lib/edge'
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
  wiki_summary: string | null
}

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { addPlace } = useRouteDraft()
  const [place, setPlace] = useState<PlaceRow | null>(null)
  const [wiki, setWiki] = useState<string | null>(null)
  const [wikiLoading, setWikiLoading] = useState(false)
  const [wikiMsg, setWikiMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
        <Text>Mekan bulunamadı.</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.meta}>
        {CATEGORY_LABELS[place.category] ?? place.category} · {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
      </Text>

      <Text style={styles.section}>Wikipedia özeti</Text>
      {wikiLoading ? (
        <ActivityIndicator color={colors.crimson} />
      ) : (
        <Text style={styles.body}>{wiki ?? wikiMsg ?? 'Özet bulunamadı.'}</Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Rotaya ekle"
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
        onPress={() => {
          addPlace(place.id)
          router.push('/route-builder')
        }}>
        <Text lightColor={colors.white} darkColor={colors.white} style={styles.primaryText}>
          Rotaya ekle
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Hasar raporu oluştur"
        style={({ pressed }) => [styles.secondary, pressed && styles.secondaryPressed]}
        onPress={() =>
          router.push({ pathname: '/report/new', params: { placeId: place.id } })
        }>
        <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.secondaryText}>
          Hasar raporu oluştur
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.base, paddingBottom: spacing.xl + spacing.base, gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.h1, fontSize: 22, lineHeight: 28 },
  meta: { ...typography.body },
  section: { ...typography.label, marginTop: spacing.sm },
  body: { ...typography.body },
  primary: {
    marginTop: spacing.base,
    height: 48,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: { backgroundColor: colors.crimsonDark },
  primaryText: { ...typography.h3, color: colors.white },
  secondary: {
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.cream,
  },
  secondaryPressed: { backgroundColor: colors.surface },
  secondaryText: { ...typography.h3 },
})
