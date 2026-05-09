import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View as RNView } from 'react-native';

import { Text, View } from '@/components/Themed';
import { CATEGORY_LABELS } from '@/constants/categories';
import { supabase } from '@/lib/supabase';

type ReportRow = {
  id: string;
  place_id: string;
  description: string | null;
  ai_analysis: string | null;
  severity: 'kritik' | 'orta' | 'hafif' | null;
  status: 'bekliyor' | 'incelendi' | 'iletildi';
  created_at: string;
  photo_url: string;
};

const SEVERITY_LABEL: Record<string, string> = {
  kritik: 'Kritik',
  orta: 'Orta',
  hafif: 'Hafif',
};

const STATUS_LABEL: Record<string, string> = {
  bekliyor: 'Bekliyor',
  incelendi: 'İncelendi',
  iletildi: 'İletildi',
};

export default function ReportsTabScreen() {
  const router = useRouter();
  const [items, setItems] = useState<
    (ReportRow & { place_name: string; place_category: string })[]
  >([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data: reports, error: rErr } = await supabase
      .from('damage_reports')
      .select('id, place_id, description, ai_analysis, severity, status, created_at, photo_url')
      .order('created_at', { ascending: false });
    if (rErr || !reports || reports.length === 0) {
      setItems([]);
      setLoading(false);
      return;
    }
    const ids = [...new Set(reports.map((r) => r.place_id))];
    const { data: places, error: pErr } = await supabase
      .from('places')
      .select('id, name, category')
      .in('id', ids);
    const pmap = new Map((places ?? []).map((p) => [p.id, p]));
    setItems(
      (reports as ReportRow[]).map((r) => {
        const p = pmap.get(r.place_id);
        return {
          ...r,
          place_name: p?.name ?? 'Mekan',
          place_category: p?.category ?? '',
        };
      }),
    );
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.newBtn} onPress={() => router.push('/report/new')}>
        <Text style={styles.newBtnText}>Yeni rapor</Text>
      </Pressable>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshing={loading}
        onRefresh={() => void load()}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={{ marginTop: 24 }} />
          ) : (
            <Text style={styles.empty}>Henüz rapor yok.</Text>
          )
        }
        renderItem={({ item }) => <ReportCard row={item} />}
      />
    </View>
  );
}

function ReportCard({
  row,
}: {
  row: ReportRow & { place_name: string; place_category: string };
}) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.storage
        .from('damage-photos')
        .createSignedUrl(row.photo_url, 3600);
      if (!cancelled && !error && data?.signedUrl) setUri(data.signedUrl);
    })();
    return () => {
      cancelled = true;
    };
  }, [row.photo_url]);

  return (
    <RNView style={styles.card}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumb} />
      ) : (
        <RNView style={[styles.thumb, styles.thumbPlaceholder]} />
      )}
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.placeName}>{row.place_name}</Text>
        <Text style={styles.cat}>{CATEGORY_LABELS[row.place_category] ?? row.place_category}</Text>
        <Text style={styles.status}>
          {STATUS_LABEL[row.status] ?? row.status} ·{' '}
          {row.severity ? SEVERITY_LABEL[row.severity] ?? row.severity : '—'}
        </Text>
        {row.ai_analysis ? (
          <Text style={styles.analysis} numberOfLines={4}>
            AI: {row.ai_analysis}
          </Text>
        ) : null}
        <Text style={styles.date}>{new Date(row.created_at).toLocaleString()}</Text>
      </View>
    </RNView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  newBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#2f95dc',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    marginBottom: 12,
  },
  newBtnText: { color: '#fff', fontWeight: '700' },
  card: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },
  thumb: { width: 88, height: 88, borderRadius: 8 },
  thumbPlaceholder: { backgroundColor: '#ddd' },
  placeName: { fontWeight: '700', fontSize: 16 },
  cat: { opacity: 0.65, fontSize: 12 },
  status: { fontSize: 13 },
  analysis: { fontSize: 13, opacity: 0.85 },
  date: { opacity: 0.55, fontSize: 11 },
  empty: { textAlign: 'center', opacity: 0.65, marginTop: 24 },
});
