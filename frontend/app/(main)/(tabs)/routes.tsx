import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { supabase } from '@/lib/supabase';

type RouteListItem = {
  id: string;
  title: string;
  created_at: string;
};

export default function RoutesTabScreen() {
  const router = useRouter();
  const [routes, setRoutes] = useState<RouteListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('routes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setRoutes(data as RouteListItem[]);
    else setRoutes([]);
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );

  async function removeRoute(id: string) {
    Alert.alert('Rotayı sil', 'Emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('routes').delete().eq('id', id);
          if (error) Alert.alert('Hata', error.message);
          else void load();
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.hint}>Kaydettiğin gezi rotaları.</Text>
      <Pressable style={styles.linkRow} onPress={() => router.push('/route-builder')}>
        <Text style={styles.link}>Rota oluştur / düzenle</Text>
      </Pressable>

      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        refreshing={loading}
        onRefresh={() => void load()}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>Henüz kayıtlı rota yok.</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
            <Pressable onPress={() => removeRoute(item.id)}>
              <Text style={styles.delete}>Sil</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  hint: { opacity: 0.7, marginBottom: 8 },
  linkRow: { marginBottom: 12 },
  link: { color: '#2f95dc', fontWeight: '600' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
    gap: 12,
  },
  title: { fontSize: 17, fontWeight: '600' },
  date: { opacity: 0.6, fontSize: 12, marginTop: 4 },
  delete: { color: '#c00', fontWeight: '600' },
  empty: { opacity: 0.65, marginTop: 24, textAlign: 'center' },
});
