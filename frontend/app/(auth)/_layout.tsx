import { Stack } from 'expo-router'

import { colors } from '@/theme/colors'
import { fontFamilies } from '@/theme/typography'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        title: 'Nomad',
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.crimson,
        headerTitleStyle: { fontFamily: fontFamilies.playfairMedium, fontSize: 18, color: colors.ink },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.surface },
      }}>
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Kayıt' }} />
    </Stack>
  )
}
