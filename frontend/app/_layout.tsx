import {
  DMSans_400Regular,
  DMSans_500Medium,
  useFonts as useDMSansFonts,
} from '@expo-google-fonts/dm-sans'
import {
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  useFonts as usePlayfairFonts,
} from '@expo-google-fonts/playfair-display'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/components/useColorScheme'
import { AuthProvider } from '@/contexts/AuthContext'
import { CityProvider } from '@/contexts/CityContext'
import { NomadDarkTheme, NomadLightTheme } from '@/theme/navigation'

export { ErrorBoundary } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [playfairLoaded, playfairError] = usePlayfairFonts({
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
  })
  const [dmLoaded, dmError] = useDMSansFonts({
    DMSans_400Regular,
    DMSans_500Medium,
  })

  const loaded = playfairLoaded && dmLoaded
  const error = playfairError || dmError

  useEffect(() => {
    if (error) throw error
  }, [error])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <AuthProvider>
      <CityProvider>
        <RootLayoutNav />
      </CityProvider>
    </AuthProvider>
  )
}

function RootLayoutNav() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? NomadDarkTheme : NomadLightTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
    </ThemeProvider>
  )
}
