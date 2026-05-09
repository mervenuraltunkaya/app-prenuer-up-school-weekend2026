import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

import { Text, View } from '@/components/Themed';
import { useAuth } from '@/contexts/AuthContext';
import { getSupabaseConfigError } from '@/lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const cfgErr = getSupabaseConfigError();

  async function onSubmit() {
    if (cfgErr) {
      Alert.alert('Yapılandırma', cfgErr);
      return;
    }
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      Alert.alert(
        'Eksik bilgi',
        'Ad soyad ve geçerli bir e-posta girin. Şifre en az 6 karakter olmalı.',
      );
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) {
      Alert.alert('Kayıt başarısız', error.message);
      return;
    }
    Alert.alert(
      'Kayıt',
      'Hesabınız oluşturuldu. E-posta doğrulaması açıksa gelen kutunuzu kontrol edin.',
      [{ text: 'Tamam', onPress: () => router.replace('/') }],
    );
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
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre (min. 6)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={onSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Kayıt ol</Text>
          )}
        </Pressable>

        <Link href="/login" asChild>
          <Pressable>
            <Text style={styles.link}>Zaten hesabın var mı? Giriş yap</Text>
          </Pressable>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: '700' },
  sub: { opacity: 0.7, marginBottom: 8 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2f95dc',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  link: { color: '#2f95dc', textAlign: 'center', marginTop: 16 },
});
