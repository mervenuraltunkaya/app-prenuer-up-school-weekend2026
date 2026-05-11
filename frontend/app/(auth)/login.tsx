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

export default function LoginScreen() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const cfgErr = getSupabaseConfigError()

  async function onSubmit() {
    if (cfgErr) {
      Alert.alert('Yapılandırma', cfgErr)
      return
    }
    if (!email.trim() || !password) {
      Alert.alert('Eksik bilgi', 'E-posta ve şifre girin.')
      return
    }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      Alert.alert('Giriş başarısız', error.message)
      return
    }
    router.replace('/')
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}>
      <View style={styles.container}>
        <Text style={styles.title}>Tekrar hoş geldin</Text>
        <Text style={styles.sub}>E-posta ve şifrenle giriş yap.</Text>

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
          placeholder="Şifre"
          placeholderTextColor={colors.brown}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giriş yap"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={onSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text lightColor={colors.white} darkColor={colors.white} style={styles.buttonText}>
              Giriş yap
            </Text>
          )}
        </Pressable>

        <Link href="/register" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel="Kayıt ol">
            <Text lightColor={colors.crimson} darkColor={colors.crimsonLight} style={styles.link}>
              Hesabın yok mu? Kayıt ol
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
