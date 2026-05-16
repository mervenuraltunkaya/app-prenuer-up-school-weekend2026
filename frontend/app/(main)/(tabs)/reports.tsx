<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { supabase } from '@/lib/supabase'
import { formatRelativeTime } from '@/lib/time'
import { colors, semantic } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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

<<<<<<< HEAD
type FilterKey = 'all' | 'bekliyor' | 'iletildi'

const SEVERITY_LABEL: Record<string, string> = {
  kritik: 'KRİTİK',
  orta: 'ORTA',
  hafif: 'HAFİF',
}

const STATUS_LABEL: Record<string, string> = {
  bekliyor: 'BEKLİYOR',
  incelendi: 'İNCELENDİ',
  iletildi: 'İLETİLDİ',
=======
const SEVERITY_LABEL: Record<string, string> = {
  kritik: 'Kritik',
  orta: 'Orta',
  hafif: 'Hafif',
}

const STATUS_LABEL: Record<string, string> = {
  bekliyor: 'Bekliyor',
  incelendi: 'İncelendi',
  iletildi: 'İletildi',
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
}

function severityColors(sev: string | null) {
  if (sev === 'kritik') return { bg: semantic.criticalBg, text: semantic.criticalText }
  if (sev === 'orta') return { bg: semantic.mediumBg, text: semantic.mediumText }
  if (sev === 'hafif') return { bg: semantic.lowBg, text: semantic.lowText }
  return { bg: colors.surface, text: colors.inkMuted }
}

function statusColors(st: string) {
<<<<<<< HEAD
  if (st === 'iletildi' || st === 'incelendi') return { bg: semantic.lowBg, text: semantic.lowText }
  return { bg: semantic.criticalBg, text: semantic.criticalText }
}

export default function ReportsTabScreen() {
  const insets = useSafeAreaInsets()
  const [items, setItems] = useState<
    (ReportRow & { place_name: string })[]
  >([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>('all')
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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
<<<<<<< HEAD
    const { data: places } = await supabase.from('places').select('id, name').in('id', ids)
    const pmap = new Map((places ?? []).map((p) => [p.id, p]))
    setItems(
      (reports as ReportRow[]).map((r) => ({
        ...r,
        place_name: pmap.get(r.place_id)?.name ?? 'Mekan',
      })),
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    )
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

<<<<<<< HEAD
  const filtered = useMemo(() => {
    if (filter === 'all') return items
    if (filter === 'bekliyor') return items.filter((i) => i.status === 'bekliyor')
    return items.filter((i) => i.status === 'iletildi' || i.status === 'incelendi')
  }, [items, filter])

  const activeCount = useMemo(
    () => items.filter((i) => i.status === 'bekliyor').length,
    [items],
  )

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.sm }]}>
      <Text style={styles.title}>Raporlarım</Text>
      <Text style={styles.subtitle}>{activeCount} aktif rapor</Text>

      <View style={styles.filters}>
        {(
          [
            ['all', 'Tümü'],
            ['bekliyor', 'Bekliyor'],
            ['iletildi', 'İletildi'],
          ] as const
        ).map(([key, label]) => (
          <Pressable
            key={key}
            style={[styles.filterChip, filter === key && styles.filterChipOn]}
            onPress={() => setFilter(key)}>
            <Text style={[styles.filterText, filter === key && styles.filterTextOn]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: spacing.sm }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} tintColor={colors.crimson} />}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.crimson} />
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
          ) : (
            <Text style={styles.empty}>Henüz rapor yok.</Text>
          )
        }
        renderItem={({ item }) => <ReportCard row={item} />}
      />
    </View>
  )
}

<<<<<<< HEAD
function ReportCard({ row }: { row: ReportRow & { place_name: string } }) {
  const [uri, setUri] = useState<string | null>(null)
  const sev = severityColors(row.severity)
  const st = statusColors(row.status)
  const issueTitle =
    row.description?.trim().split('\n')[0]?.slice(0, 48) ||
    row.ai_analysis?.trim().slice(0, 48) ||
    'Hasar raporu'
=======
function ReportCard({
  row,
}: {
  row: ReportRow & { place_name: string; place_category: string }
}) {
  const [uri, setUri] = useState<string | null>(null)
  const sev = severityColors(row.severity)
  const st = statusColors(row.status)
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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
<<<<<<< HEAD
    <View style={styles.card}>
      <View style={styles.cardTop}>
        {uri ? (
          <Image source={{ uri }} style={styles.thumb} />
        ) : (
          <View style={[styles.thumb, styles.thumbPh]}>
            <FontAwesome name="image" size={20} color={colors.sand} />
          </View>
        )}
        <View style={styles.cardInfo}>
          <Text style={styles.placeLabel}>{row.place_name.toUpperCase()}</Text>
          <Text style={styles.issueTitle} numberOfLines={2}>
            {issueTitle}
          </Text>
          <View style={styles.badgeRow}>
            {row.severity ? (
              <View style={[styles.badge, { backgroundColor: sev.bg }]}>
                <Text style={[styles.badgeText, { color: sev.text }]}>
                  {SEVERITY_LABEL[row.severity] ?? row.severity}
                </Text>
              </View>
            ) : null}
            <View style={[styles.badge, { backgroundColor: st.bg }]}>
              <Text style={[styles.badgeText, { color: st.text }]}>
                {STATUS_LABEL[row.status] ?? row.status}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.time}>{formatRelativeTime(row.created_at)}</Text>
        <Pressable accessibilityRole="button">
          <Text style={styles.detail}>Detay ›</Text>
        </Pressable>
      </View>
    </View>
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  )
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  root: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.base,
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
    marginBottom: spacing.md,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  filterChipOn: {
    backgroundColor: colors.crimson,
    borderColor: colors.crimson,
  },
  filterText: {
    ...typography.caption,
    color: colors.ink,
  },
  filterTextOn: {
    color: colors.white,
    fontFamily: typography.h3.fontFamily,
  },
  empty: {
    ...typography.body,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: radius.md,
    backgroundColor: colors.cream,
  },
  thumbPh: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  placeLabel: {
    ...typography.label,
    fontSize: 9,
    marginBottom: spacing.xs,
  },
  issueTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: radius.full,
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
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
})
