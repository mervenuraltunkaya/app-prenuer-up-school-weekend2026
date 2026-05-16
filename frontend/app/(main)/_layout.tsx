import { Stack } from 'expo-router'

import { RouteDraftProvider } from '@/contexts/RouteDraftContext'
import { colors } from '@/theme/colors'
import { fontFamilies } from '@/theme/typography'

const headerOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.crimson,
  headerTitleStyle: { fontFamily: fontFamilies.dmMedium, fontSize: 17, color: colors.ink },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.surface },
} as const

export default function MainLayout() {
  return (
    <RouteDraftProvider>
      <Stack screenOptions={headerOptions}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="city-select" options={{ title: 'Şehir seç', presentation: 'modal' }} />
        <Stack.Screen name="place/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="route-builder" options={{ headerShown: false }} />
        <Stack.Screen name="report/new" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </RouteDraftProvider>
  )
}
