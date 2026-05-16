/** Uygulama kategorileri: cami | muze | kale | arkeolojik | diger */

export type AppCategory = 'cami' | 'muze' | 'kale' | 'arkeolojik' | 'diger';

export function mapOsmTagsToCategory(tags: Record<string, string>): AppCategory {
  const tourism = tags.tourism ?? '';
  const historic = tags.historic ?? '';
  const building = tags.building ?? '';

  if (tourism === 'museum' || tags.amenity === 'museum') {
    return 'muze';
  }

  if (historic === 'castle' || building === 'castle') {
    return 'kale';
  }

  if (
    historic === 'ruins' ||
    historic === 'archaeological_site' ||
    historic === 'city_gate' ||
    historic === 'fort'
  ) {
    return 'arkeolojik';
  }

  if (historic === 'monument' || historic === 'memorial' || historic === 'tomb') {
    return 'diger';
  }

  if (tags.amenity === 'place_of_worship' || tags.building === 'mosque') {
    return 'cami';
  }

  return 'diger';
}

export function pickPlaceName(tags: Record<string, string>, fallbackId: string): string {
  const name =
    tags['name:tr'] ??
    tags.name ??
    tags['name:en'] ??
    tags['official_name'] ??
    tags['alt_name'];

  if (name && name.trim().length > 0) {
    return name.trim().slice(0, 200);
  }

  return `Tarihi alan ${fallbackId}`;
}
