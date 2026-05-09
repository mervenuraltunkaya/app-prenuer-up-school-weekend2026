import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, title: 'Nomad' }}>
      <Stack.Screen name="login" options={{ title: 'Giriş' }} />
      <Stack.Screen name="register" options={{ title: 'Kayıt' }} />
    </Stack>
  );
}
