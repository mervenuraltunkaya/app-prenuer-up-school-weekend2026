import { Stack } from 'expo-router';

import { RouteDraftProvider } from '@/contexts/RouteDraftContext';

export default function MainLayout() {
  return (
    <RouteDraftProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="city-select" options={{ title: 'Şehir seç', presentation: 'modal' }} />
        <Stack.Screen name="place/[id]" options={{ title: 'Mekan detayı' }} />
        <Stack.Screen name="route-builder" options={{ title: 'Rota oluştur' }} />
        <Stack.Screen name="report/new" options={{ title: 'Hasar raporu' }} />
      </Stack>
    </RouteDraftProvider>
  );
}
