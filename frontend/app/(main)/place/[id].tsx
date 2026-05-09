import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { CATEGORY_LABELS } from '@/constants/categories';
import { useRouteDraft } from '@/contexts/RouteDraftContext';
import { fetchPlacesWiki } from '@/lib/edge';
import { supabase } from '@/lib/supabase';

type PlaceRow = {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  wiki_summary: string | null;
};

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addPlace } = useRouteDraft();
  const [place, setPlace] = useState<PlaceRow | null>(null);
  const [wiki, setWiki] = useState<string | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiMsg, setWikiMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('places').select('*').eq('id', id).maybeSingle();
      if (cancelled) return;
      if (error || !data) setPlace(null);
      else setPlace(data as PlaceRow);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!place?.id) return;
    let cancelled = false;
    (async () => {
      if (place.wiki_summary) {
        setWiki(place.wiki_summary);
        return;
      }
      setWikiLoading(true);
      setWikiMsg(null);
      try {
        const res = await fetchPlacesWiki(place.id);
        if (cancelled) return;
        setWiki(res.summary);
        if (res.message && !res.summary) setWikiMsg(res.message);
      } catch (e) {
        if (!cancelled) setWikiMsg(e instanceof Error ? e.message : 'Özet yüklenemedi');
      } finally {
        if (!cancelled) setWikiLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [place]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!place) {
    return (
      <View style={styles.center}>
        <Text>Mekan bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.meta}>
        {CATEGORY_LABELS[place.category] ?? place.category} · {place.lat.toFixed(4)}, {place.lng.toFixed(4)}
      </Text>

      <Text style={styles.section}>Wikipedia özeti</Text>
      {wikiLoading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.body}>{wiki ?? wikiMsg ?? 'Özet bulunamadı.'}</Text>
      )}

      <Pressable
        style={styles.primary}
        onPress={() => {
          addPlace(place.id);
          router.push('/route-builder');
        }}>
        <Text style={styles.primaryText}>Rotaya ekle</Text>
      </Pressable>

      <Pressable
        style={styles.secondary}
        onPress={() =>
          router.push({ pathname: '/report/new', params: { placeId: place.id } })
        }>
        <Text style={styles.secondaryText}>Hasar raporu oluştur</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 12 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  meta: { opacity: 0.7 },
  section: { marginTop: 8, fontWeight: '600' },
  body: { lineHeight: 22 },
  primary: {
    marginTop: 16,
    backgroundColor: '#2f95dc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondary: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  secondaryText: { fontWeight: '600' },
});
