import { useMemo } from 'react'
import { Platform, StyleSheet } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import type { MapComponentProps } from '@/components/map/types'

export default function MapComponent({ style, region, markers, onMarkerPress }: MapComponentProps) {
  const mapProvider = useMemo(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ? PROVIDER_GOOGLE : undefined
    }
    return undefined
  }, [])

  return (
    <MapView style={[styles.map, style]} provider={mapProvider} initialRegion={region} region={region}>
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          title={marker.title}
          description={marker.description}
          onPress={() => onMarkerPress?.(marker.id)}
        />
      ))}
    </MapView>
  )
}

const styles = StyleSheet.create({
  map: { flex: 1, width: '100%' },
})
