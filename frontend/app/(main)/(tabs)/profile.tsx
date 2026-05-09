import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).maybeSingle();
    if (data) {
      setFullName(data.full_name ?? '');
      setAvatarUrl(data.avatar_url);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim() })
      .eq('id', user.id);
    setSaving(false);
    if (error) Alert.alert('Kayıt', error.message);
    else Alert.alert('Kaydedildi', 'Profil güncellendi.');
  }

  async function pickAvatar() {
    if (!user) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('İzin', 'Galeri erişimi gerekli.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];
    const ext = asset.mimeType?.includes('png')
      ? 'png'
      : asset.mimeType?.includes('webp')
        ? 'webp'
        : 'jpg';
    const path = `${user.id}/avatar.${ext}`;
    const res = await fetch(asset.uri);
    const blob = await res.blob();

    const { error: upErr } = await supabase.storage.from('avatars').upload(path, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: asset.mimeType ?? 'image/jpeg',
    });
    if (upErr) {
      Alert.alert('Yükleme', upErr.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(path);

    const { error: dbErr } = await supabase
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', user.id);
    if (dbErr) Alert.alert('Kayıt', dbErr.message);
    else setAvatarUrl(publicUrl);
  }

  async function onSignOut() {
    await signOut();
    router.replace('/login');
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
      <Pressable style={styles.avatarWrap} onPress={pickAvatar}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPh]}>
            <Text>Foto</Text>
          </View>
        )}
        <Text style={styles.avatarHint}>Avatarı değiştir</Text>
      </Pressable>

      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Ad Soyad" />

      <Pressable style={[styles.primary, saving && styles.disabled]} onPress={saveProfile} disabled={saving}>
        <Text style={styles.primaryText}>{saving ? 'Kaydediliyor…' : 'Kaydet'}</Text>
      </Pressable>

      <Pressable style={styles.signOut} onPress={onSignOut}>
        <Text style={styles.signOutText}>Çıkış yap</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPh: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarHint: { marginTop: 8, color: '#2f95dc', fontWeight: '600' },
  label: { fontWeight: '600' },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  primary: {
    backgroundColor: '#2f95dc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  disabled: { opacity: 0.6 },
  signOut: { marginTop: 24, alignItems: 'center', padding: 12 },
  signOutText: { color: '#c00', fontWeight: '600' },
});
