import type { AppCategory } from './map_category.js';

const WIKI_SUMMARY_BASE_TR = 'https://tr.wikipedia.org/api/rest_v1/page/summary';
const WIKI_SUMMARY_BASE_EN = 'https://en.wikipedia.org/api/rest_v1/page/summary';
const WIKI_SEARCH_TR = 'https://tr.wikipedia.org/w/rest.php/v1/search/title';
const WIKI_SEARCH_EN = 'https://en.wikipedia.org/w/rest.php/v1/search/title';

type WikiSummaryJson = {
  thumbnail?: { source?: string };
  originalimage?: { source?: string };
};

type WikiSearchJson = {
  pages?: { title?: string }[];
};

const imageCache = new Map<string, string | null>();

/** Kategori bazlı varsayılan görseller (Wikimedia Commons, stabil URL). */
export const CATEGORY_PLACEHOLDER: Record<AppCategory, string> = {
  cami:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Blue_Mosque%2C_Istanbul%2C_Turkey_%28cropped%29.jpg/640px-Blue_Mosque%2C_Istanbul%2C_Turkey_%28cropped%29.jpg',
  muze:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Hagia_Sophia_Mars2013.jpg/640px-Hagia_Sophia_Mars2013.jpg',
  kale:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Rumelihisari_2018.jpg/640px-Rumelihisari_2018.jpg',
  arkeolojik:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Ephesus_Celsus_Library_Fa%C3%A7ade.jpg/640px-Ephesus_Celsus_Library_Fa%C3%A7ade.jpg',
  diger:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Galata_Tower_2014.jpg/640px-Galata_Tower_2014.jpg',
};

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchWikiTitle(query: string, lang: 'tr' | 'en'): Promise<string | null> {
  const base = lang === 'tr' ? WIKI_SEARCH_TR : WIKI_SEARCH_EN;
  const url = `${base}?q=${encodeURIComponent(query)}&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NomadSeed/1.5 (educational; contact@nomad.local)' },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as WikiSearchJson;
  return json.pages?.[0]?.title ?? null;
}

async function fetchSummaryImage(title: string, lang: 'tr' | 'en'): Promise<string | null> {
  const base = lang === 'tr' ? WIKI_SUMMARY_BASE_TR : WIKI_SUMMARY_BASE_EN;
  const url = `${base}/${encodeURIComponent(title)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'NomadSeed/1.5 (educational; contact@nomad.local)' },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as WikiSummaryJson;
  return json.thumbnail?.source ?? json.originalimage?.source ?? null;
}

/**
 * Mekan adına göre Wikipedia görsel URL'i (TR öncelikli, sonra EN).
 * Sonuç null ise çağıran CATEGORY_PLACEHOLDER kullanmalı.
 */
export async function fetchWikipediaImageUrl(placeName: string): Promise<string | null> {
  const cacheKey = placeName.trim().toLowerCase();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey) ?? null;
  }

  let imageUrl: string | null = null;

  try {
    const trTitle = await searchWikiTitle(placeName, 'tr');
    if (trTitle) {
      imageUrl = await fetchSummaryImage(trTitle, 'tr');
    }

    if (!imageUrl) {
      const enTitle = await searchWikiTitle(placeName, 'en');
      if (enTitle) {
        imageUrl = await fetchSummaryImage(enTitle, 'en');
      }
    }
  } catch {
    imageUrl = null;
  }

  imageCache.set(cacheKey, imageUrl);
  await sleep(120);
  return imageUrl;
}

export function placeholderForCategory(category: string): string {
  const key = category as AppCategory;
  return CATEGORY_PLACEHOLDER[key] ?? CATEGORY_PLACEHOLDER.diger;
}
