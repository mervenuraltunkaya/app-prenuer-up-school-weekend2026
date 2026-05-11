import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle()
    if (data) {
      setFullName(data.full_name ?? '')
      setAvatarUrl(data.avatar_url)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    void load()
  }, [load])

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)
    setSaving(false)
    if (error) Alert.alert('Kayıt', error.message)
    else Alert.alert('Kaydedildi', 'Profil güncellendi.')
  }

  async function pickAvatar() {
    if (!user) return
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('İzin', 'Galeri erişimi gerekli.')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    })
    if (result.canceled || !result.assets[0]) return
    const asset = result.assets[0]
    const ext = asset.mimeType?.includes('png')
      ? 'png'
      : asset.mimeType?.includes('webp')
        ? 'webp'
        : 'jpg'
    const path = `${user.id}/avatar.${ext}`
    const res = await fetch(asset.uri)
    const blob = await res.blob()

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: asset.mimeType ?? 'image/jpeg',
    })
    if (upErr) {
      Alert.alert('Yükleme', upErr.message)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path)

    const { error: dbErr } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id)
    if (dbErr) Alert.alert('Kayıt', dbErr.message)
    else setAvatarUrl(publicUrl)
  }

  async function onSignOut() {
    await signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Pressable accessibilityRole="button" accessibilityLabel="Avatar seç" style={styles.avatarWrap} onPress={pickAvatar}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPh]}>
            <Text>Foto</Text>
          </View>
        )}
        <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.avatarHint}>
          Avatarı değiştir
        </Text>
      </Pressable>

      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Ad Soyad"
        placeholderTextColor={colors.brown}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Profili kaydet"
        style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed, saving && styles.disabled]}
        onPress={saveProfile}
        disabled={saving}>
        <Text lightColor={colors.white} darkColor={colors.white} style={styles.primaryText}>
          {saving ? 'Kaydediliyor…' : 'Kaydet'}
        </Text>
      </Pressable>

      <Pressable accessibilityRole="button" accessibilityLabel="Çıkış yap" style={styles.signOut} onPress={onSignOut}>
        <Text lightColor={colors.crimsonDark} darkColor={colors.terracotta} style={styles.signOutText}>
          Çıkış yap
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.base, gap: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { alignItems: 'center', marginBottom: spacing.base },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPh: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  avatarHint: { ...typography.h3, marginTop: spacing.sm },
  label: { ...typography.label },
  input: {
    height: 48,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
  },
  primary: {
    height: 48,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  primaryPressed: { backgroundColor: colors.crimsonDark },
  primaryText: { ...typography.h3, color: colors.white },
  disabled: { opacity: 0.6 },
  signOut: { marginTop: spacing.lg, alignItems: 'center', padding: spacing.md },
  signOutText: { ...typography.h3 },
})
