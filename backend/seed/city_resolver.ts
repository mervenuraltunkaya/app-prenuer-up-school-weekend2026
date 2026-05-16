import { TURKIYE_ILLER } from './turkiye_provinces.js';

export type CityRow = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

/** Türkçe karşılaştırma için normalize (İ/ı, ş, ğ vb.) */
function normalizeProvinceKey(value: string): string {
  return value
    .trim()
    .replace(/\s*(Province|İli|ili|Provinsi|province)\s*$/gi, '')
    .replace(/,.*$/, '')
    .trim()
    .toLocaleLowerCase('tr-TR');
}

const PROVINCE_LOOKUP = new Map<string, string>(
  TURKIYE_ILLER.map((p) => [normalizeProvinceKey(p.name), p.name]),
);

/** Ek yazım / OSM varyantları (ASCII klavye) */
const ALIASES: Record<string, string> = {
  afyon: 'Afyonkarahisar',
  istanbul: 'İstanbul',
  izmir: 'İzmir',
  sanliurfa: 'Şanlıurfa',
  sirnak: 'Şırnak',
  hakari: 'Hakkâri',
  hakkari: 'Hakkâri',
  mugla: 'Muğla',
  kirsehir: 'Kırşehir',
  kirikkale: 'Kırıkkale',
  kirklareli: 'Kırklareli',
  canakkale: 'Çanakkale',
  corum: 'Çorum',
  ankara: 'Ankara',
  trabzon: 'Trabzon',
  giresun: 'Giresun',
};

function resolveCanonicalProvince(raw: string): string | null {
  const key = normalizeProvinceKey(raw);
  if (!key) return null;

  const fromList = PROVINCE_LOOKUP.get(key);
  if (fromList) return fromList;

  const alias = ALIASES[key];
  if (alias) return alias;

  for (const [norm, name] of PROVINCE_LOOKUP) {
    if (norm.startsWith(key) || key.startsWith(norm)) return name;
  }

  return null;
}

/** OSM etiketlerinden il adı çıkar (öncelik: addr:province, is_in:province). */
export function extractProvinceFromTags(tags: Record<string, string>): string | null {
  const direct =
    tags['addr:province']?.trim() ||
    tags['is_in:province']?.trim() ||
    tags['addr:province:tr']?.trim() ||
    tags['is_in:province:tr']?.trim();

  if (direct) return direct;

  return null;
}

export function cityIdFromProvinceTags(
  tags: Record<string, string>,
  cities: CityRow[],
): string | null {
  const raw = extractProvinceFromTags(tags);
  if (!raw) return null;

  const canonical = resolveCanonicalProvince(raw);
  if (!canonical) return null;

  const city = cities.find((c) => c.name === canonical);
  return city?.id ?? null;
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function nearestCityId(lat: number, lng: number, cities: CityRow[]): string {
  let best = cities[0];
  let bestDist = Infinity;

  for (const city of cities) {
    const d = haversineKm(lat, lng, city.lat, city.lng);
    if (d < bestDist) {
      bestDist = d;
      best = city;
    }
  }

  return best.id;
}

export function resolveCityId(
  tags: Record<string, string>,
  lat: number,
  lng: number,
  cities: CityRow[],
): string {
  const fromProvince = cityIdFromProvinceTags(tags, cities);
  if (fromProvince) return fromProvince;
  return nearestCityId(lat, lng, cities);
}
