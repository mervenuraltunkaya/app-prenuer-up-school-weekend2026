import { useFocusEffect, useRouter } from 'expo-router'
import { useCallback, useState } from 'react'
import { Alert, FlatList, Pressable, StyleSheet } from 'react-native'

import { Text, View } from '@/components/Themed'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type RouteListItem = {
  id: string
  title: string
  created_at: string
}

export default function RoutesTabScreen() {
  const router = useRouter()
  const [routes, setRoutes] = useState<RouteListItem[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('routes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
    if (!error && data) setRoutes(data as RouteListItem[])
    else setRoutes([])
    setLoading(false)
  }, [])

  useFocusEffect(
    useCallback(() => {
      void load()
    }, [load]),
  )

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
    <View style={styles.container}>
      <Text style={styles.hint}>Kaydettiğin gezi rotaları.</Text>
      <Pressable accessibilityRole="button" style={styles.linkRow} onPress={() => router.push('/route-builder')}>
        <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
          Rota oluştur / düzenle
        </Text>
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
              <Text style={styles.title} lightColor={colors.ink} darkColor={colors.cream}>
                {item.title}
              </Text>
              <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Rotayı sil" onPress={() => removeRoute(item.id)}>
              <Text lightColor={colors.crimsonDark} darkColor={colors.terracotta} style={styles.delete}>
                Sil
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base },
  hint: { ...typography.body, marginBottom: spacing.sm },
  linkRow: { marginBottom: spacing.md },
  link: { ...typography.h3 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.sm + spacing.xs,
    gap: spacing.md,
    backgroundColor: colors.cream,
  },
  title: { ...typography.h3, fontSize: 16 },
  date: { ...typography.caption, marginTop: spacing.xs },
  delete: { ...typography.h3, fontSize: 14 },
  empty: { ...typography.body, marginTop: spacing.lg, textAlign: 'center' },
})
