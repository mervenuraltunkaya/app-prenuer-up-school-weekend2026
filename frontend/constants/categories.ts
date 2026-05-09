export const PLACE_CATEGORIES = ['cami', 'muze', 'kale', 'arkeolojik', 'diger'] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<string, string> = {
  cami: 'Cami',
  muze: 'Müze',
  kale: 'Kale',
  arkeolojik: 'Arkeolojik',
  diger: 'Diğer',
};
