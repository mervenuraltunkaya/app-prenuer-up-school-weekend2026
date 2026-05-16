import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useAuth } from '@/contexts/AuthContext'
import { getSupabaseConfigError } from '@/lib/supabase'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { fontFamilies, typography } from '@/theme/typography'

export default function LoginScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + spacing.base, paddingBottom: insets.bottom + spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          style={styles.backBtn}
          onPress={() => router.back()}>
          <FontAwesome name="chevron-left" size={14} color={colors.ink} />
        </Pressable>

        <Text style={styles.title}>
          Hoş geldin<Text style={styles.titleAccent}>.</Text>
        </Text>
        <Text style={styles.subtitle}>Tarihi keşfetmeye devam et</Text>

        <Text style={styles.fieldLabel}>E-POSTA</Text>
        <View style={styles.inputWrap}>
          <FontAwesome name="envelope-o" size={16} color={colors.brown} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="ornek@email.com"
            placeholderTextColor={colors.brown}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <Text style={styles.fieldLabel}>ŞİFRE</Text>
        <View style={styles.inputWrap}>
          <FontAwesome name="lock" size={18} color={colors.brown} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.brown}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
            onPress={() => setShowPassword((v) => !v)}
            style={styles.eyeBtn}>
            <FontAwesome name={showPassword ? 'eye-slash' : 'eye'} size={16} color={colors.brown} />
          </Pressable>
        </View>

        <Pressable accessibilityRole="button" style={styles.forgotWrap}>
          <Text style={styles.forgot}>Şifremi unuttum</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Giriş yap"
          style={({ pressed }) => [styles.primary, pressed && styles.primaryPressed]}
          onPress={onSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.primaryText}>Giriş yap</Text>
          )}
        </Pressable>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn} accessibilityRole="button">
            <FontAwesome name="google" size={18} color={colors.ink} />
            <Text style={styles.socialText}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialBtn} accessibilityRole="button">
            <FontAwesome name="apple" size={20} color={colors.ink} />
            <Text style={styles.socialText}>Apple</Text>
          </Pressable>
        </View>

        <Link href="/register" asChild>
          <Pressable accessibilityRole="button" style={styles.registerWrap}>
            <Text style={styles.registerMuted}>Hesabın yok mu? </Text>
            <Text style={styles.registerLink}>Kayıt ol</Text>
          </Pressable>
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  scroll: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamilies.playfairSemi,
    fontSize: 32,
    lineHeight: 38,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  titleAccent: {
    color: colors.crimson,
  },
  subtitle: {
    fontFamily: fontFamilies.playfairMedium,
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.brown,
    marginBottom: spacing.xl,
  },
  fieldLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.ink,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
  },
  eyeBtn: {
    padding: spacing.sm,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
  },
  forgot: {
    ...typography.h3,
    fontSize: 13,
    color: colors.crimson,
    textDecorationLine: 'underline',
  },
  primary: {
    height: 52,
    backgroundColor: colors.crimson,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryPressed: {
    backgroundColor: colors.crimsonDark,
  },
  primaryText: {
    fontFamily: fontFamilies.dmMedium,
    fontSize: 16,
    color: colors.white,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.brown,
  },
  socialRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 48,
    backgroundColor: colors.cream,
    borderRadius: radius.full,
    borderWidth: 0.5,
    borderColor: colors.border,
  },
  socialText: {
    ...typography.h3,
    fontSize: 14,
    color: colors.ink,
  },
  registerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  registerMuted: {
    ...typography.body,
    color: colors.inkMuted,
  },
  registerLink: {
    ...typography.h3,
    color: colors.crimson,
    textDecorationLine: 'underline',
  },
})
