import type { StyleProp, ViewStyle } from 'react-native'

export type MapRegion = {
  latitude: number
  longitude: number
  latitudeDelta: number
  longitudeDelta: number
}

export type MapMarker = {
  id: string
  latitude: number
  longitude: number
  title: string
  description?: string
}

export type MapComponentProps = {
  style?: StyleProp<ViewStyle>
  region: MapRegion
  markers: MapMarker[]
  onMarkerPress?: (markerId: string) => void
}
