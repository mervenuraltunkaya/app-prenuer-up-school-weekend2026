<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome'
import type { ComponentProps } from 'react'
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
<<<<<<< HEAD
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

=======
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
<<<<<<< HEAD
import { fontFamilies, typography } from '@/theme/typography'

type Stats = {
  routes: number
  places: number
  reports: number
}

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { user, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarVersion, setAvatarVersion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState<Stats>({ routes: 0, places: 0, reports: 0 })
  const [editOpen, setEditOpen] = useState(false)
  const [editName, setEditName] = useState('')
=======
import { typography } from '@/theme/typography'

export default function ProfileScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
<<<<<<< HEAD
    const [{ data: profile }, routesRes, reportsRes] = await Promise.all([
      supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle(),
      supabase.from('routes').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase
        .from('damage_reports')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ])

    if (profile) {
      setFullName(profile.full_name ?? '')
      if (profile.avatar_url) {
        setAvatarUrl(`${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}v=${Date.now()}`)
        setAvatarVersion((v) => v + 1)
      } else {
        setAvatarUrl(null)
      }
    }

    let placeCount = 0
    if (routesRes.count && routesRes.count > 0) {
      const { data: routeIds } = await supabase.from('routes').select('id').eq('user_id', user.id)
      const ids = (routeIds ?? []).map((r) => r.id)
      if (ids.length > 0) {
        const { count } = await supabase
          .from('route_places')
          .select('place_id', { count: 'exact', head: true })
          .in('route_id', ids)
        placeCount = count ?? 0
      }
    }

    setStats({
      routes: routesRes.count ?? 0,
      places: placeCount,
      reports: reportsRes.count ?? 0,
    })
=======
    const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle()
    if (data) {
      setFullName(data.full_name ?? '')
      setAvatarUrl(data.avatar_url)
    }
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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
<<<<<<< HEAD
      .update({ full_name: editName.trim() })
      .eq('id', user.id)
    setSaving(false)
    if (error) Alert.alert('Kayıt', error.message)
    else {
      setFullName(editName.trim())
      setEditOpen(false)
      Alert.alert('Kaydedildi', 'Profil güncellendi.')
    }
=======
      .update({ full_name: fullName.trim() })
      .eq('id', user.id)
    setSaving(false)
    if (error) Alert.alert('Kayıt', error.message)
    else Alert.alert('Kaydedildi', 'Profil güncellendi.')
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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
<<<<<<< HEAD

    setAvatarUrl(asset.uri)
    setAvatarVersion((v) => v + 1)

=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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
<<<<<<< HEAD
    if (dbErr) {
      Alert.alert('Kayıt', dbErr.message)
      void load()
      return
    }

    const busted = `${publicUrl}${publicUrl.includes('?') ? '&' : '?'}v=${Date.now()}`
    setAvatarUrl(busted)
    setAvatarVersion((v) => v + 1)
=======
    if (dbErr) Alert.alert('Kayıt', dbErr.message)
    else setAvatarUrl(publicUrl)
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  }

  async function onSignOut() {
    await signOut()
    router.replace('/login')
  }

<<<<<<< HEAD
  const initial = (fullName || user?.email || 'N').charAt(0).toUpperCase()

=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  return (
<<<<<<< HEAD
    <View style={styles.root}>
      <ScrollView
        bounces={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 88 }}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.base }]}>
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Profil</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Ayarlar" style={styles.settingsBtn}>
              <FontAwesome name="cog" size={18} color={colors.cream} />
            </Pressable>
          </View>

          <View style={styles.profileRow}>
            <Pressable accessibilityRole="button" accessibilityLabel="Avatar seç" onPress={pickAvatar}>
              {avatarUrl ? (
                <Image
                  key={`avatar-${avatarVersion}`}
                  source={{ uri: avatarUrl }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarLetter}>{initial}</Text>
                </View>
              )}
            </Pressable>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{fullName || 'Kullanıcı'}</Text>
              <Text style={styles.email}>{user?.email ?? ''}</Text>
            </View>
          </View>

          <View style={styles.statsCard}>
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{stats.routes}</Text>
              <Text style={styles.statLabel}>ROTA</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{stats.places}</Text>
              <Text style={styles.statLabel}>MEKAN</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCell}>
              <Text style={styles.statValue}>{stats.reports}</Text>
              <Text style={styles.statLabel}>RAPOR</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionLabel}>HESAP</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="user"
              label="Profili düzenle"
              onPress={() => {
                setEditName(fullName)
                setEditOpen(true)
              }}
            />
            <MenuRow
              icon="bell"
              label="Bildirimler"
              onPress={() => Alert.alert('Bildirimler', 'Bildirim ayarları yakında eklenecek.')}
            />
            <MenuRow
              icon="lock"
              label="Gizlilik & güvenlik"
              onPress={() => Alert.alert('Gizlilik', 'Gizlilik ayarları yakında eklenecek.')}
              last
            />
          </View>

          <Text style={styles.sectionLabel}>UYGULAMA</Text>
          <View style={styles.menuCard}>
            <MenuRow
              icon="question-circle"
              label="Yardım & destek"
              onPress={() => Alert.alert('Yardım', 'destek@nomad.app adresine yazabilirsiniz.')}
            />
            <MenuRow icon="sign-out" label="Çıkış yap" onPress={onSignOut} danger last />
          </View>

          <Text style={styles.footer}>Nomad v1.0.0 · Future Talent 2026</Text>
        </View>
      </ScrollView>

      <Modal visible={editOpen} animationType="fade" transparent onRequestClose={() => setEditOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Profili düzenle</Text>
            <Text style={styles.fieldLabel}>AD SOYAD</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Ad Soyad"
              placeholderTextColor={colors.brown}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalCancel} onPress={() => setEditOpen(false)}>
                <Text style={styles.modalCancelText}>İptal</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSave, saving && styles.modalSaveDisabled]}
                onPress={saveProfile}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.modalSaveText}>Kaydet</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    </View>
  )
}

<<<<<<< HEAD
function MenuRow({
  icon,
  label,
  onPress,
  danger,
  last,
}: {
  icon: ComponentProps<typeof FontAwesome>['name']
  label: string
  onPress: () => void
  danger?: boolean
  last?: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={[styles.menuRow, !last && styles.menuRowBorder]}
      onPress={onPress}>
      <FontAwesome name={icon} size={18} color={danger ? colors.crimson : colors.brown} />
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {!danger ? <FontAwesome name="chevron-right" size={12} color={colors.brown} /> : null}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    backgroundColor: colors.ink,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 26,
    color: colors.cream,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLetter: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 28,
    color: colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 22,
    color: colors.cream,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.body,
    color: colors.sand,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statDivider: {
    width: 0.5,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 22,
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.label,
    color: colors.sand,
    fontSize: 9,
  },
  body: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  sectionLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    minHeight: 52,
  },
  menuRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    ...typography.h3,
    fontSize: 14,
  },
  menuLabelDanger: {
    color: colors.crimson,
  },
  footer: {
    ...typography.caption,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 16, 0.5)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  modalInput: {
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    height: 48,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
<<<<<<< HEAD
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modalCancel: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    ...typography.h3,
    color: colors.inkMuted,
  },
  modalSave: {
    flex: 1,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.crimson,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveDisabled: {
    opacity: 0.6,
  },
  modalSaveText: {
    ...typography.h3,
    color: colors.white,
  },
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
})
