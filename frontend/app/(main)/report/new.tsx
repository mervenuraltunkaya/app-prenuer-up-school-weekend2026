<<<<<<< HEAD
import FontAwesome from '@expo/vector-icons/FontAwesome'
import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useMemo, useState } from 'react'
=======
import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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

import { ScreenHeader } from '@/components/ui/ScreenHeader'
=======
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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
<<<<<<< HEAD
  const insets = useSafeAreaInsets()
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  const params = useLocalSearchParams<{ placeId?: string }>()
  const { cityId } = useCity()
  const [places, setPlaces] = useState<PlaceRow[]>([])
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(params.placeId ?? null)
  const [imageUri, setImageUri] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState('image/jpeg')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
<<<<<<< HEAD
  const [pickerOpen, setPickerOpen] = useState(false)
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621

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

<<<<<<< HEAD
  const selectedPlace = useMemo(
    () => places.find((p) => p.id === selectedPlaceId) ?? null,
    [places, selectedPlaceId],
  )

=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
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
<<<<<<< HEAD
    <View style={styles.root}>
      <ScreenHeader
        title="Hasar raporu"
        backIcon="close"
        stepLabel="ADIM 1/3"
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: insets.bottom + spacing.xl },
        ]}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Pressable
            accessibilityRole="button"
            style={styles.uploadZone}
            onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.preview} />
            ) : (
              <>
                <FontAwesome name="camera" size={28} color={colors.brown} />
                <Text style={styles.uploadTitle}>Fotoğraf çek veya galeriden seç</Text>
                <Text style={styles.uploadHint}>JPG, PNG · Maks. 10 MB</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.fieldLabel}>MEKAN</Text>
          <Pressable
            accessibilityRole="button"
            style={styles.placeField}
            onPress={() => setPickerOpen(true)}>
            <FontAwesome name="map-marker" size={16} color={colors.brown} />
            <Text style={styles.placeValue} numberOfLines={1}>
              {selectedPlace?.name ?? 'Mekan seçin'}
            </Text>
            <FontAwesome name="chevron-down" size={12} color={colors.brown} />
          </Pressable>

          <Text style={styles.fieldLabel}>AÇIKLAMA</Text>
          <TextInput
            style={styles.area}
            multiline
            placeholder="Dış duvarda büyük bir çatlak fark ettim..."
            placeholderTextColor={colors.brown}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <View style={styles.aiBox}>
            <View style={styles.aiIcon}>
              <FontAwesome name="magic" size={14} color={colors.crimson} />
            </View>
            <View style={styles.aiTextWrap}>
              <Text style={styles.aiLabel}>GEMINI AI ANALİZİ</Text>
              <Text style={styles.aiBody}>
                Fotoğraf yüklendikten sonra yapay zeka hasarı otomatik olarak analiz edecek ve
                şiddet seviyesini belirleyecek.
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Raporu gönder"
          style={[styles.submit, submitting && styles.submitDisabled]}
          onPress={submit}
          disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color={colors.ink} />
          ) : (
            <>
              <FontAwesome name="send" size={14} color={colors.ink} />
              <Text style={styles.submitText}>Raporu gönder</Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      <Modal visible={pickerOpen} animationType="slide" transparent onRequestClose={() => setPickerOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setPickerOpen(false)}>
          <View style={[styles.modalSheet, { paddingBottom: insets.bottom + spacing.base }]}>
            <Text style={styles.modalTitle}>Mekan seç</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {places.map((p) => (
                <Pressable
                  key={p.id}
                  style={[styles.modalItem, selectedPlaceId === p.id && styles.modalItemOn]}
                  onPress={() => {
                    setSelectedPlaceId(p.id)
                    setPickerOpen(false)
                  }}>
                  <Text style={styles.modalItemText}>{p.name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  )
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  uploadZone: {
    minHeight: 160,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderMedium,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: radius.md,
    resizeMode: 'cover',
  },
  uploadTitle: {
    ...typography.h3,
    fontSize: 14,
    color: colors.ink,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  uploadHint: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  placeField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  placeValue: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
  },
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  area: {
    minHeight: 120,
    borderWidth: 0.5,
    borderColor: colors.border,
<<<<<<< HEAD
    borderRadius: radius.lg,
=======
    borderRadius: radius.md,
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    padding: spacing.md,
    ...typography.body,
    color: colors.ink,
    backgroundColor: colors.surface,
<<<<<<< HEAD
    marginBottom: spacing.lg,
  },
  aiBox: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  aiTextWrap: {
    flex: 1,
  },
  aiLabel: {
    ...typography.label,
    color: colors.crimson,
    marginBottom: spacing.xs,
  },
  aiBody: {
    ...typography.caption,
    lineHeight: 18,
    color: colors.inkMuted,
  },
  submit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    marginTop: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  submitDisabled: {
    opacity: 0.7,
  },
  submitText: {
    ...typography.h3,
    fontSize: 15,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(28, 20, 16, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.base,
    maxHeight: '70%',
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  modalItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },
  modalItemOn: {
    backgroundColor: colors.surface,
  },
  modalItemText: {
    ...typography.body,
    color: colors.ink,
  },
=======
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
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
})
