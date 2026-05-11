import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View as RNView } from 'react-native'

import { Text, View } from '@/components/Themed'
import { CATEGORY_LABELS } from '@/constants/categories'
import { supabase } from '@/lib/supabase'
import { colors, semantic } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type ReportRow = {
  id: string
  place_id: string
  description: string | null
  ai_analysis: string | null
  severity: 'kritik' | 'orta' | 'hafif' | null
  status: 'bekliyor' | 'incelendi' | 'iletildi'
  created_at: string
  photo_url: string
}

const SEVERITY_LABEL: Record<string, string> = {
  kritik: 'Kritik',
  orta: 'Orta',
  hafif: 'Hafif',
}

const STATUS_LABEL: Record<string, string> = {
  bekliyor: 'Bekliyor',
  incelendi: 'İncelendi',
  iletildi: 'İletildi',
}

function severityColors(sev: string | null) {
  if (sev === 'kritik') return { bg: semantic.criticalBg, text: semantic.criticalText }
  if (sev === 'orta') return { bg: semantic.mediumBg, text: semantic.mediumText }
  if (sev === 'hafif') return { bg: semantic.lowBg, text: semantic.lowText }
  return { bg: colors.surface, text: colors.inkMuted }
}

function statusColors(st: string) {
  if (st === 'iletildi') return { bg: semantic.lowBg, text: semantic.lowText }
  if (st === 'bekliyor') return { bg: semantic.statusPendingBg, text: semantic.statusPendingText }
  return { bg: colors.cream, text: colors.inkMuted }
}

export default function ReportsTabScreen() {
  const router = useRouter()
  const [items, setItems] = useState<
    (ReportRow & { place_name: string; place_category: string })[]
  >([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data: reports, error: rErr } = await supabase
      .from('damage_reports')
      .select('id, place_id, description, ai_analysis, severity, status, created_at, photo_url')
      .order('created_at', { ascending: false })
    if (rErr || !reports || reports.length === 0) {
      setItems([])
      setLoading(false)
      return
    }
    const ids = [...new Set(reports.map((r) => r.place_id))]
    const { data: places, error: pErr } = await supabase
      .from('places')
      .select('id, name, category')
      .in('id', ids)
    const pmap = new Map((places ?? []).map((p) => [p.id, p]))
    setItems(
      (reports as ReportRow[]).map((r) => {
        const p = pmap.get(r.place_id)
        return {
          ...r,
          place_name: p?.name ?? 'Mekan',
          place_category: p?.category ?? '',
        }
      }),
    )
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Yeni hasar raporu"
        style={({ pressed }) => [styles.newBtn, pressed && styles.newBtnPressed]}
        onPress={() => router.push('/report/new')}>
        <Text lightColor={colors.white} darkColor={colors.white} style={styles.newBtnText}>
          Yeni rapor
        </Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.lg }}
        refreshing={loading}
        onRefresh={() => void load()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: spacing.lg }} color={colors.crimson} />
          ) : (
            <Text style={styles.empty}>Henüz rapor yok.</Text>
          )
        }
        renderItem={({ item }) => <ReportCard row={item} />}
      />
    </View>
  )
}

function ReportCard({
  row,
}: {
  row: ReportRow & { place_name: string; place_category: string }
}) {
  const [uri, setUri] = useState<string | null>(null)
  const sev = severityColors(row.severity)
  const st = statusColors(row.status)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase.storage
        .from('damage-photos')
        .createSignedUrl(row.photo_url, 3600)
      if (!cancelled && !error && data?.signedUrl) setUri(data.signedUrl)
    })()
    return () => {
      cancelled = true
    }
  }, [row.photo_url])

  return (
    <RNView style={styles.card}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} />
      ) : (
        <RNView style={[styles.thumb, styles.thumbPlaceholder]} />
      )}
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={styles.placeName} lightColor={colors.ink} darkColor={colors.cream}>
          {row.place_name}
        </Text>
        <Text style={styles.cat}>{CATEGORY_LABELS[row.place_category] ?? row.place_category}</Text>
        <RNView style={styles.badgeRow}>
          <RNView style={[styles.badge, { backgroundColor: st.bg }]}>
            <Text style={[styles.badgeText, { color: st.text }]}>{STATUS_LABEL[row.status] ?? row.status}</Text>
          </RNView>
          {row.severity ? (
            <RNView style={[styles.badge, { backgroundColor: sev.bg }]}>
              <Text style={[styles.badgeText, { color: sev.text }]}>
                {SEVERITY_LABEL[row.severity] ?? row.severity}
              </Text>
            </RNView>
          ) : null}
        </RNView>
        {row.ai_analysis ? (
          <Text style={styles.analysis} numberOfLines={4}>
            AI: {row.ai_analysis}
          </Text>
        ) : null}
        <Text style={styles.date}>{new Date(row.created_at).toLocaleString()}</Text>
      </View>
    </RNView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base },
  newBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.crimson,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.full,
    marginBottom: spacing.md,
  },
  newBtnPressed: { backgroundColor: colors.crimsonDark },
  newBtnText: { ...typography.h3, color: colors.white },
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    backgroundColor: colors.cream,
  },
  thumb: { width: 88, height: 88, borderRadius: radius.sm },
  thumbPlaceholder: { backgroundColor: colors.surface },
  placeName: { ...typography.h3, fontSize: 16 },
  cat: { ...typography.caption },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.full,
  },
  badgeText: { ...typography.caption, fontFamily: typography.h3.fontFamily },
  analysis: { ...typography.body, marginTop: spacing.xs },
  date: { ...typography.caption, marginTop: spacing.xs },
  empty: { ...typography.body, textAlign: 'center', marginTop: spacing.lg },
})
