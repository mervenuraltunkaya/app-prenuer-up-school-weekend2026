import AsyncStorage from '@react-native-async-storage/async-storage'

const KEY = 'nomad_onboarding_complete'

export async function isOnboardingComplete(): Promise<boolean> {
  const v = await AsyncStorage.getItem(KEY)
  return v === '1'
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEY, '1')
}
