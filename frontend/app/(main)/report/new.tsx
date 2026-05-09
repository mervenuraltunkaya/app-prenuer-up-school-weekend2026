import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { useCity } from '@/contexts/CityContext';
import { analyzeDamageImage } from '@/lib/edge';
import { supabase } from '@/lib/supabase';

type PlaceRow = { id: string; name: string; category: string };

const DESC_MIN = 10;
const DESC_MAX = 2000;

export default function NewReportScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ placeId?: string }>();
  const { cityId } = useCity();
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(params.placeId ?? null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.placeId) setSelectedPlaceId(params.placeId);
  }, [params.placeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!cityId) return;
      const { data } = await supabase.from('places').select('id,name,category').eq('city_id', cityId);
      if (!cancelled && data) setPlaces(data as PlaceRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [cityId]);

  async function pickImage() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted && !lib.granted) {
      Alert.alert('İzin', 'Kamera veya galeri izni gerekli.');
      return;
    }

    Alert.alert('Fotoğraf', 'Kaynak seçin', [
      {
        text: 'Kamera',
        onPress: async () => {
          const r = await ImagePicker.launchCameraAsync({ quality: 0.85 });
          if (!r.canceled && r.assets[0]) {
            setMimeType(r.assets[0].mimeType ?? 'image/jpeg');
            setImageUri(r.assets[0].uri);
          }
        },
      },
      {
        text: 'Galeri',
        onPress: async () => {
          const r = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
          });
          if (!r.canceled && r.assets[0]) {
            setMimeType(r.assets[0].mimeType ?? 'image/jpeg');
            setImageUri(r.assets[0].uri);
          }
        },
      },
      { text: 'İptal', style: 'cancel' },
    ]);
  }

  async function submit() {
    if (!selectedPlaceId) {
      Alert.alert('Mekan', 'Bir mekan seçin.');
      return;
    }
    const desc = description.trim();
    if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      Alert.alert('Açıklama', `${DESC_MIN}-${DESC_MAX} karakter arası olmalı.`);
      return;
    }
    if (!imageUri) {
      Alert.alert('Fotoğraf', 'Bir fotoğraf ekleyin.');
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Oturum', 'Giriş yapmalısınız.');
      return;
    }

    setSubmitting(true);
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const analysis = await analyzeDamageImage(base64, mimeType);

      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg';
      const path = `${user.id}/${Date.now()}.${ext}`;
      const res = await fetch(imageUri);
      const blob = await res.blob();
      const { error: upErr } = await supabase.storage.from('damage-photos').upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      });
      if (upErr) throw new Error(upErr.message);

      const { error: insErr } = await supabase.from('damage_reports').insert({
        user_id: user.id,
        place_id: selectedPlaceId,
        photo_url: path,
        description: desc,
        ai_analysis: analysis.ai_analysis,
        severity: analysis.severity,
        status: 'bekliyor',
      });

      if (insErr) throw new Error(insErr.message);

      Alert.alert('Gönderildi', 'Hasar raporu kaydedildi.', [
        { text: 'Tamam', onPress: () => router.replace('/reports') },
      ]);
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Bilinmeyen hata');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Mekan</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {places.map((p) => (
          <Pressable
            key={p.id}
            style={[styles.chip, selectedPlaceId === p.id && styles.chipOn]}
            onPress={() => setSelectedPlaceId(p.id)}>
            <Text style={styles.chipText}>{p.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable style={styles.photoBtn} onPress={pickImage}>
        <Text style={styles.photoBtnText}>{imageUri ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}</Text>
      </Pressable>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

      <Text style={styles.label}>Açıklama ({DESC_MIN}-{DESC_MAX} karakter)</Text>
      <TextInput
        style={styles.area}
        multiline
        placeholder="Hasarı ve konumu kısaca anlatın."
        value={description}
        onChangeText={setDescription}
      />

      <Pressable style={[styles.submit, submitting && styles.disabled]} onPress={submit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Analiz et ve gönder</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40, gap: 10 },
  label: { fontWeight: '600', marginTop: 8 },
  chips: { maxHeight: 44, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 8,
  },
  chipOn: { backgroundColor: '#2f95dc22', borderColor: '#2f95dc' },
  chipText: { fontSize: 13 },
  photoBtn: {
    padding: 12,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  photoBtnText: { fontWeight: '600' },
  preview: { width: '100%', height: 200, borderRadius: 12, resizeMode: 'cover' },
  area: {
    minHeight: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: 16,
    backgroundColor: '#2f95dc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontWeight: '700' },
  disabled: { opacity: 0.7 },
});
