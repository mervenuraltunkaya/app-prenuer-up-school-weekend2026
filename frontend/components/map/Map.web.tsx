import { useMemo } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import type { MapComponentProps, MapRegion } from '@/components/map/types'
import { colors } from '@/theme/colors'

function latitudeDeltaToZoom(latitudeDelta: number): number {
  const zoom = Math.round(Math.log2(360 / Math.max(latitudeDelta, 0.001)))
  return Math.min(18, Math.max(4, zoom))
}

function buildEmbedUrl(region: MapRegion): string {
  const { latitude, longitude, latitudeDelta } = region
  const zoom = latitudeDeltaToZoom(latitudeDelta)
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY

  if (apiKey) {
    const params = new URLSearchParams({
      key: apiKey,
      center: `${latitude},${longitude}`,
      zoom: String(zoom),
      maptype: 'roadmap',
    })
    return `https://www.google.com/maps/embed/v1/view?${params.toString()}`
  }

  const params = new URLSearchParams({
    q: `${latitude},${longitude}`,
    z: String(zoom),
    output: 'embed',
  })
  return `https://maps.google.com/maps?${params.toString()}`
}

function markerOverlayPosition(
  lat: number,
  lng: number,
  region: MapRegion,
): { top: `${number}%`; left: `${number}%` } {
  const latMin = region.latitude - region.latitudeDelta / 2
  const latMax = region.latitude + region.latitudeDelta / 2
  const lngMin = region.longitude - region.longitudeDelta / 2
  const lngMax = region.longitude + region.longitudeDelta / 2

  const latSpan = latMax - latMin || 1
  const lngSpan = lngMax - lngMin || 1

  const topPct = ((latMax - lat) / latSpan) * 100
  const leftPct = ((lng - lngMin) / lngSpan) * 100

  return {
    top: `${Math.min(96, Math.max(4, topPct))}%`,
    left: `${Math.min(96, Math.max(4, leftPct))}%`,
  }
}

export default function MapComponent({ style, region, markers, onMarkerPress }: MapComponentProps) {
  const embedSrc = useMemo(() => buildEmbedUrl(region), [region])

  return (
    <View style={[styles.container, style]}>
      <iframe
        title="Nomad map"
        src={embedSrc}
        style={styles.iframe}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
      <View style={styles.overlay} pointerEvents="box-none">
        {markers.map((marker) => {
          const pos = markerOverlayPosition(marker.latitude, marker.longitude, region)
          return (
            <Pressable
              key={marker.id}
              accessibilityRole="button"
              accessibilityLabel={marker.title}
              onPress={() => onMarkerPress?.(marker.id)}
              style={[styles.pin, { top: pos.top, left: pos.left }]}
            />
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 0,
    backgroundColor: colors.cream,
  },
  iframe: {
    borderWidth: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    position: 'absolute',
    width: 14,
    height: 14,
    marginLeft: -7,
    marginTop: -7,
    borderRadius: 7,
    backgroundColor: colors.crimson,
    borderWidth: 2,
    borderColor: colors.white,
  },
})
