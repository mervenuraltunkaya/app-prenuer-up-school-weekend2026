import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'

import { Text, View } from '@/components/Themed'
import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseConfigError } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export default function RegisterScreen() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const cfgErr = getSupabaseConfigError()

  async function onSubmit() {
    if (cfgErr) {
      Alert.alert('Yapılandırma', cfgErr)
      return
    }
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      Alert.alert(
        'Eksik bilgi',
        'Ad soyad ve geçerli bir e-posta girin. Şifre en az 6 karakter olmalı.',
      )
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)
    if (error) {
      Alert.alert('Kayıt başarısız', error.message)
      return
    }
    Alert.alert(
      'Kayıt',
      'Hesabınız oluşturuldu. E-posta doğrulaması açıksa gelen kutunuzu kontrol edin.',
      [{ text: 'Tamam', onPress: () => router.replace('/') }],
    )
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <View style={styles.container}>
        <Text style={styles.title}>Nomad&apos;a katıl</Text>
        <Text style={styles.sub}>Gezi ve hasar raporları için hesap oluştur.</Text>

        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor={colors.brown}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor={colors.brown}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre (min. 6)"
          placeholderTextColor={colors.brown}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kayıt ol"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text lightColor={colors.white} darkColor={colors.white} style={styles.buttonText}>
              Kayıt ol
            </Text>
          )}
        </Pressable>

        <Link href="/login" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Giriş yap">
            <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
              Zaten hesabın var mı? Giriş yap
            </Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
  },
  title: {
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  sub: { ...typography.body, marginBottom: spacing.sm },
  input: {
    height: 48,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    ...typography.body,
    color: colors.ink,
  },
  button: {
    height: 48,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  buttonPressed: { backgroundColor: colors.crimsonDark },
  buttonText: {
    ...typography.h3,
    color: colors.white,
  },
  link: {
    ...typography.h3,
    textAlign: 'center',
    marginTop: spacing.base,
  },
})
