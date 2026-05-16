/**
 * Metro çalışma zamanında Map.native.tsx veya Map.web.tsx dosyasını seçer.
 * Bu dosya TypeScript çözümlemesi ve ortam belirsiz fallback içindir.
 */
export { default } from './Map.native'
export type { MapComponentProps, MapMarker, MapRegion } from './types'
