import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/contexts/AuthContext';
import { useCity } from '@/contexts/CityContext';

export default function Index() {
  const { session, loading: authLoading } = useAuth();
  const { cityId, loading: cityLoading } = useCity();

  if (authLoading || cityLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/login" />;
  }

  if (!cityId) {
    return <Redirect href="/city-select" />;
  }

  return <Redirect href="/explore" />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
