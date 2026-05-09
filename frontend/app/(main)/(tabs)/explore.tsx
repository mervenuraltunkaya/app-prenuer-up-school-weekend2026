import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View as RNView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text, View } from '@/components/Themed';
import { CATEGORY_LABELS, PLACE_CATEGORIES } from '@/constants/categories';
import { useCity } from '@/contexts/CityContext';
import { supabase } from '@/lib/supabase';

type PlaceRow = {
  id: string;
  city_id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
};

export default function ExploreScreen() {
  const router = useRouter();
  const { city, cityId } = useCity();
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);

  const loadPlaces = useCallback(async () => {
    if (!cityId) return;
    setLoading(true);
    const { data, error } = await supabase.from('places').select('*').eq('city_id', cityId);
    if (!error && data) setPlaces(data as PlaceRow[]);
    else setPlaces([]);
    setLoading(false);
  }, [cityId]);

  useEffect(() => {
    loadPlaces();
  }, [loadPlaces]);

  const filtered = useMemo(() => {
    if (!category) return places;
    return places.filter((p) => p.category === category);
  }, [places, category]);

  const region = useMemo(() => {
    if (!city) {
      return { latitude: 39, longitude: 35, latitudeDelta: 8, longitudeDelta: 8 };
    }
    return {
      latitude: city.lat,
      longitude: city.lng,
      latitudeDelta: 0.25,
      longitudeDelta: 0.25,
    };
  }, [city]);

  const mapProvider =
    Platform.OS !== 'web' && process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
      ? PROVIDER_GOOGLE
      : undefined;

  if (!cityId || !city) {
    return (
      <View style={styles.center}>
        <Text>Önce şehir seçmelisin.</Text>
        <Pressable style={styles.btn} onPress={() => router.push('/city-select')}>
          <Text style={styles.btnText}>Şehir seç</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <RNView style={styles.toolbar}>
        <Text style={styles.toolbarTitle}>{city.name}</Text>
        <RNView style={styles.toolbarActions}>
          <Pressable onPress={() => router.push('/route-builder')} style={styles.toolbarBtn}>
            <Text style={styles.link}>Rota</Text>
          </Pressable>
          <Pressable onPress={() => router.push('/city-select')}>
            <Text style={styles.link}>Şehir</Text>
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
          <Text style={styles.chipText}>Tümü</Text>
        </Pressable>
        {PLACE_CATEGORIES.map((c) => (
          <Pressable
            key={c}
            style={[styles.chip, category === c && styles.chipActive]}
            onPress={() => setCategory(c)}>
            <Text style={styles.chipText}>{CATEGORY_LABELS[c] ?? c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
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
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  toolbarTitle: { fontSize: 20, fontWeight: '700' },
  toolbarActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  toolbarBtn: { marginRight: 4 },
  link: { color: '#2f95dc', fontWeight: '600' },
  chips: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#2f95dc22', borderColor: '#2f95dc' },
  chipText: { fontSize: 13 },
  map: { flex: 1 },
  legend: { padding: 12, alignItems: 'flex-end' },
  legendText: { opacity: 0.65, fontSize: 12 },
  btn: {
    marginTop: 16,
    backgroundColor: '#2f95dc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  btnText: { color: '#fff', fontWeight: '600' },
});
