/**
 * OpenStreetMap Overpass → Supabase places seed
 *
 * Kullanım:
 *   cd backend/seed && npm install && cp .env.example .env
 *   npm run seed:osm
 */
import WebSocket from 'ws';
import 'dotenv/config';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import {
  type CityRow,
  resolveCityId,
} from './city_resolver.js';
import { mapOsmTagsToCategory, pickPlaceName } from './map_category.js';
import { TURKIYE_ILLER } from './turkiye_provinces.js';
import { fetchWikipediaImageUrl, placeholderForCategory } from './wikipedia_image.js';

const OVERPASS_URL =
  process.env.OVERPASS_URL ?? 'https://overpass-api.de/api/interpreter';
const BATCH_SIZE = Number(process.env.BATCH_SIZE ?? '200');
const DRY_RUN = (process.env.DRY_RUN ?? 'false').toLowerCase() === 'true';
const MAX_RETRIES = 4;

type OsmElement = {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

type OverpassResponse = {
  elements?: OsmElement[];
};

type PlaceUpsertRow = {
  city_id: string;
  name: string;
  category: string;
  google_place_id: string;
  lat: number;
  lng: number;
  image_url: string;
};

const OVERPASS_QUERY = `
[out:json][timeout:300];
area["ISO3166-1"="TR"]["admin_level"="2"]->.turkey;
(
  node(area.turkey)["historic"~"^(ruins|castle|monument)$"];
  node(area.turkey)["tourism"="museum"];
  way(area.turkey)["historic"~"^(ruins|castle|monument)$"];
  way(area.turkey)["tourism"="museum"];
);
out center tags;
`.trim();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value?.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
}

function resolveCoordinates(el: OsmElement): { lat: number; lng: number } | null {
  if (typeof el.lat === 'number' && typeof el.lon === 'number') {
    return { lat: el.lat, lng: el.lon };
  }
  if (el.center && typeof el.center.lat === 'number' && typeof el.center.lon === 'number') {
    return { lat: el.center.lat, lng: el.center.lon };
  }
  return null;
}

function osmExternalId(el: OsmElement): string {
  return `osm:${el.type}:${el.id}`;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchOverpass(query: string): Promise<OsmElement[]> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(OVERPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          'User-Agent': 'NomadSeed/1.5 (educational; contact@nomad.local)',
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (res.status === 429 || res.status === 504) {
        const wait = attempt * 15_000;
        console.warn(`Overpass ${res.status}, retry ${attempt}/${MAX_RETRIES} in ${wait / 1000}s`);
        await sleep(wait);
        continue;
      }

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Overpass HTTP ${res.status}: ${text.slice(0, 500)}`);
      }

      const json = (await res.json()) as OverpassResponse;
      return json.elements ?? [];
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await sleep(attempt * 10_000);
      }
    }
  }

  throw lastError ?? new Error('Overpass request failed');
}

async function ensureProvinces(supabase: SupabaseClient): Promise<CityRow[]> {
  console.log(`Upserting ${TURKIYE_ILLER.length} provinces into cities...`);

  const rows = TURKIYE_ILLER.map((p) => ({
    name: p.name,
    country: 'Turkey',
    lat: p.lat,
    lng: p.lng,
  }));

  if (DRY_RUN) {
    console.log('[DRY_RUN] Skipping cities upsert');
    return TURKIYE_ILLER.map((p, i) => ({
      id: `dry-run-${i}`,
      name: p.name,
      lat: p.lat,
      lng: p.lng,
    }));
  }

  const { error } = await supabase
    .from('cities')
    .upsert(rows, { onConflict: 'name,country', ignoreDuplicates: false });

  if (error) {
    throw new Error(`Cities upsert failed: ${error.message}`);
  }

  const { data, error: selectError } = await supabase
    .from('cities')
    .select('id, name, lat, lng')
    .eq('country', 'Turkey');

  if (selectError || !data?.length) {
    throw new Error(`Cities load failed: ${selectError?.message ?? 'empty result'}`);
  }

  console.log(`Loaded ${data.length} cities from database.`);
  return data as CityRow[];
}

function elementsToPlaces(elements: OsmElement[], cities: CityRow[]): PlaceUpsertRow[] {
  const seen = new Set<string>();
  const places: PlaceUpsertRow[] = [];
  let provinceHits = 0;
  let distanceHits = 0;

  for (const el of elements) {
    if (!el.tags || Object.keys(el.tags).length === 0) continue;

    const coords = resolveCoordinates(el);
    if (!coords) continue;

    const externalId = osmExternalId(el);
    if (seen.has(externalId)) continue;
    seen.add(externalId);

    const name = pickPlaceName(el.tags, String(el.id));
    const category = mapOsmTagsToCategory(el.tags);

    const fromTags = resolveCityId(el.tags, coords.lat, coords.lng, cities);
    const usedProvince =
      el.tags['addr:province'] ||
      el.tags['is_in:province'] ||
      el.tags['addr:province:tr'] ||
      el.tags['is_in:province:tr'];
    if (usedProvince) provinceHits += 1;
    else distanceHits += 1;

    places.push({
      city_id: fromTags,
      name,
      category,
      google_place_id: externalId,
      lat: coords.lat,
      lng: coords.lng,
      image_url: placeholderForCategory(category),
    });
  }

  console.log(
    `City assignment: ${provinceHits} via province tags, ${distanceHits} via nearest distance.`,
  );
  return places;
}

async function enrichPlacesWithImages(places: PlaceUpsertRow[]): Promise<void> {
  const nameToUrl = new Map<string, string>();
  let wikiFound = 0;
  let placeholderUsed = 0;

  console.log(`Fetching Wikipedia images for ${places.length} places...`);

  for (let i = 0; i < places.length; i++) {
    const place = places[i];
    const cacheKey = place.name.trim().toLowerCase();

    if (nameToUrl.has(cacheKey)) {
      place.image_url = nameToUrl.get(cacheKey)!;
      continue;
    }

    const wikiUrl = await fetchWikipediaImageUrl(place.name);
    const finalUrl = wikiUrl ?? placeholderForCategory(place.category);
    if (wikiUrl) wikiFound += 1;
    else placeholderUsed += 1;

    nameToUrl.set(cacheKey, finalUrl);
    place.image_url = finalUrl;

    if ((i + 1) % 50 === 0) {
      console.log(`  Wikipedia images: ${i + 1}/${places.length}`);
    }
  }

  console.log(
    `Images: ${wikiFound} from Wikipedia, ${placeholderUsed} category placeholders (deduped by name).`,
  );
}

async function upsertPlacesBatch(
  supabase: SupabaseClient,
  batch: PlaceUpsertRow[],
  batchIndex: number,
  totalBatches: number,
): Promise<void> {
  if (DRY_RUN) {
    console.log(`[DRY_RUN] Would upsert batch ${batchIndex + 1}/${totalBatches} (${batch.length} rows)`);
    return;
  }

  const { error } = await supabase.from('places').upsert(batch, {
    onConflict: 'google_place_id',
    ignoreDuplicates: false,
  });

  if (error) {
    throw new Error(`Places upsert batch ${batchIndex + 1} failed: ${error.message}`);
  }

  console.log(`Upserted batch ${batchIndex + 1}/${totalBatches} (${batch.length} places)`);
}

async function upsertAllPlaces(supabase: SupabaseClient, places: PlaceUpsertRow[]): Promise<void> {
  if (places.length === 0) {
    console.warn('No places to upsert.');
    return;
  }

  const totalBatches = Math.ceil(places.length / BATCH_SIZE);
  console.log(`Upserting ${places.length} places in ${totalBatches} batch(es)...`);

  for (let i = 0; i < places.length; i += BATCH_SIZE) {
    const batch = places.slice(i, i + BATCH_SIZE);
    await upsertPlacesBatch(supabase, batch, Math.floor(i / BATCH_SIZE), totalBatches);
    await sleep(200);
  }
}

async function main(): Promise<void> {
  const supabaseUrl = requireEnv('SUPABASE_URL');
  const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  console.log('Nomad OSM seed — v1.5');
  console.log(`Overpass: ${OVERPASS_URL}`);
  console.log(`DRY_RUN: ${DRY_RUN}`);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: {
      transport: WebSocket as any
    }
  });

  const cities = await ensureProvinces(supabase);

  console.log('Fetching OSM data from Overpass API (Turkey)...');
  const elements = await fetchOverpass(OVERPASS_QUERY);
  console.log(`Received ${elements.length} raw OSM elements.`);

  const places = elementsToPlaces(elements, cities);
  console.log(`Prepared ${places.length} unique places after filtering.`);

  await enrichPlacesWithImages(places);

  const byCategory = places.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  console.log('By category:', byCategory);

  await upsertAllPlaces(supabase, places);

  console.log('OSM seed completed successfully.');
}

main().catch((err) => {
  console.error('OSM seed failed:', err);
  process.exit(1);
});
