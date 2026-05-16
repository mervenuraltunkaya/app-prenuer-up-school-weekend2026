import type { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Nomad',
  slug: 'nomad',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'nomad',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  splash: {
    image: './assets/images/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    },
  },
  android: {
    package: "com.example.nomad",
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
      },
    },
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
<<<<<<< HEAD
  plugins: ['expo-router', 'expo-localization'],
=======
  plugins: ['expo-router'],
>>>>>>> 0229edf4646607f58a1dd422da59b64a3aab9621
  experiments: {
    typedRoutes: true,
  },
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  },
};

export default { expo: config };
