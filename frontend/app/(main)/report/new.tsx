import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { useCity } from '@/contexts/CityContext'
import { analyzeDamageImage } from '@/lib/edge'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

type PlaceRow = { id: string; name: string; category: string }

const DESC_MIN = 10
const DESC_MAX = 2000

export default function NewReportScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ placeId?: string }>()
  const { cityId } = useCity()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(params.placeId ?? null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState('image/jpeg')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.placeId) setSelectedPlaceId(params.placeId)
  }, [params.placeId])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!cityId) return
      const { data } = await supabase.from('places').select('id,name,category').eq('city_id', cityId)
      if (!cancelled && data) setPlaces(data as PlaceRow[])
    })()
    return () => {
      cancelled = true
    }
  }, [cityId])

  async function pickImage() {
    const perm = await ImagePicker.requestCameraPermissionsAsync()
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted && !lib.granted) {
      Alert.alert('İzin', 'Kamera veya galeri izni gerekli.')
      return
    }

    Alert.alert('Fotoğraf', 'Kaynak seçin', [
      {
        text: 'Kamera',
        onPress: async () => {
          const r = await ImagePicker.launchCameraAsync({ quality: 0.85 })
          if (!r.canceled && r.assets[0]) {
            setMimeType(r.assets[0].mimeType ?? 'image/jpeg')
            setImageUri(r.assets[0].uri)
          }
        },
      },
      {
        text: 'Galeri',
        onPress: async () => {
          const r = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.85,
          })
          if (!r.canceled && r.assets[0]) {
            setMimeType(r.assets[0].mimeType ?? 'image/jpeg')
            setImageUri(r.assets[0].uri)
          }
        },
      },
      { text: 'İptal', style: 'cancel' },
    ])
  }

  async function submit() {
    if (!selectedPlaceId) {
      Alert.alert('Mekan', 'Bir mekan seçin.')
      return
    }
    const desc = description.trim()
    if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
      Alert.alert('Açıklama', `${DESC_MIN}-${DESC_MAX} karakter arası olmalı.`)
      return
    }
    if (!imageUri) {
      Alert.alert('Fotoğraf', 'Bir fotoğraf ekleyin.')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      Alert.alert('Oturum', 'Giriş yapmalısınız.')
      return
    }

    setSubmitting(true)
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      const analysis = await analyzeDamageImage(base64, mimeType)

      const ext = mimeType.includes('png') ? 'png' : mimeType.includes('webp') ? 'webp' : 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`
      const res = await fetch(imageUri)
      const blob = await res.blob()
      const { error: upErr } = await supabase.storage.from('damage-photos').upload(path, blob, {
        contentType: mimeType,
        upsert: false,
      })
      if (upErr) throw new Error(upErr.message)

      const { error: insErr } = await supabase.from('damage_reports').insert({
        user_id: user.id,
        place_id: selectedPlaceId,
        photo_url: path,
        description: desc,
        ai_analysis: analysis.ai_analysis,
        severity: analysis.severity,
        status: 'bekliyor',
      })

      if (insErr) throw new Error(insErr.message)

      Alert.alert('Gönderildi', 'Hasar raporu kaydedildi.', [
        { text: 'Tamam', onPress: () => router.replace('/reports') },
      ])
    } catch (e) {
      Alert.alert('Hata', e instanceof Error ? e.message : 'Bilinmeyen hata')
    } finally {
      setSubmitting(false)
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
            <Text style={[styles.chipText, selectedPlaceId === p.id && styles.chipTextOn]}>{p.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.photoBtn, pressed && styles.photoBtnPressed]}
        onPress={pickImage}>
        <Text style={styles.photoBtnText}>{imageUri ? 'Fotoğrafı değiştir' : 'Fotoğraf ekle'}</Text>
      </Pressable>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}

      <Text style={styles.label}>Açıklama ({DESC_MIN}-{DESC_MAX} karakter)</Text>
      <TextInput
        style={styles.area}
        multiline
        placeholder="Hasarı ve konumu kısaca anlatın."
        placeholderTextColor={colors.brown}
        value={description}
        onChangeText={setDescription}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Analiz et ve gönder"
        style={[styles.submit, submitting && styles.disabled]}
        onPress={submit}
        disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text lightColor={colors.white} darkColor={colors.white} style={styles.submitText}>
            Analiz et ve gönder
          </Text>
        )}
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: spacing.base, paddingBottom: spacing.xl + spacing.base, gap: 10 },
  label: { ...typography.label, marginTop: spacing.sm },
  chips: { maxHeight: 44, marginBottom: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.cream,
  },
  chipOn: {
    backgroundColor: 'rgba(166, 3, 33, 0.1)',
    borderColor: colors.crimson,
  },
  chipText: { ...typography.caption, color: colors.ink },
  chipTextOn: { color: colors.crimson, fontFamily: typography.h3.fontFamily },
  photoBtn: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    backgroundColor: colors.cream,
  },
  photoBtnPressed: { backgroundColor: colors.surface },
  photoBtnText: { ...typography.h3 },
  preview: { width: '100%', height: 200, borderRadius: radius.md, resizeMode: 'cover' },
  area: {
    minHeight: 120,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
    textAlignVertical: 'top',
  },
  submit: {
    marginTop: spacing.base,
    height: 48,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { ...typography.h3, color: colors.white },
  disabled: { opacity: 0.7 },
})
