import { Redirect } from 'expo-router'
<<<<<<< HEAD
import { useEffect, useState } from 'react'
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import { ActivityIndicator, StyleSheet, View } from 'react-native'

import { useAuth } from '@/contexts/AuthContext'
import { useCity } from '@/contexts/CityContext'
<<<<<<< HEAD
import { isOnboardingComplete } from '@/lib/onboarding'
=======
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
import { colors } from '@/theme/colors'

export default function Index() {
  const { session, loading: authLoading } = useAuth()
  const { cityId, loading: cityLoading } = useCity()
<<<<<<< HEAD
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null)

  useEffect(() => {
    void isOnboardingComplete().then(setOnboardingDone)
  }, [])

  if (authLoading || cityLoading || onboardingDone === null) {
=======

  if (authLoading || cityLoading) {
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.crimson} />
      </View>
    )
  }

  if (!session) {
<<<<<<< HEAD
    return <Redirect href={onboardingDone ? '/login' : '/onboarding'} />
=======
    return <Redirect href="/login" />
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  }

  if (!cityId) {
    return <Redirect href="/city-select" />
  }

  return <Redirect href="/explore" />
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
})
