import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { useCity } from '@/contexts/CityContext';
import type { CityRow } from '@/contexts/CityContext';
import { supabase } from '@/lib/supabase';

export default function CitySelectScreen() {
  const router = useRouter();
  const { setCityId } = useCity();
  const [cities, setCities] = useState<CityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (cancelled) return;
      if (error || !data) {
        setCities([]);
      } else {
        setCities(
          data.map((r) => ({
            id: r.id,
            name: r.name,
            country: r.country,
            lat: r.lat,
            lng: r.lng,
          })),
        );
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function select(id: string) {
    await setCityId(id);
    router.replace('/explore');
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Keşfetmek istediğin şehri seç.</Text>
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => select(item.id)}>
            <Text style={styles.cityName}>{item.name}</Text>
            <Text style={styles.country}>{item.country}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hint: { marginBottom: 12, opacity: 0.75 },
  row: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  sep: { height: 8 },
  cityName: { fontSize: 18, fontWeight: '600' },
  country: { opacity: 0.65, marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
