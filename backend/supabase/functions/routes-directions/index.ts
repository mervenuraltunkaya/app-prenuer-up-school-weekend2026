import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';

type LatLng = { lat: number; lng: number };

function parseWaypoints(param: string | null): LatLng[] {
  if (!param) return [];
  const parts = param.split('|');
  const out: LatLng[] = [];
  for (const p of parts) {
    const [latS, lngS] = p.split(',');
    const lat = Number(latS);
    const lng = Number(lngS);
    if (Number.isFinite(lat) && Number.isFinite(lng)) out.push({ lat, lng });
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const auth = await getUserFromRequest(req);
  if ('error' in auth) return auth.error;

  const url = new URL(req.url);
  const origin = url.searchParams.get('origin');
  const destination = url.searchParams.get('destination');
  const waypointsParam = url.searchParams.get('waypoints');

  if (!origin || !destination) {
    return jsonResponse({ error: 'origin and destination required (lat,lng)' }, 400);
  }

  const apiKey = Deno.env.get('GOOGLE_MAPS_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'GOOGLE_MAPS_API_KEY not set' }, 500);
  }

  const extra = parseWaypoints(waypointsParam);
  let directionsUrl =
    `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=driving&key=${apiKey}`;

  if (extra.length > 0) {
    const wp = extra.map((w) => `${w.lat},${w.lng}`).join('|');
    directionsUrl += `&waypoints=${encodeURIComponent(wp)}`;
  }

  const gRes = await fetch(directionsUrl);
  const gJson = (await gRes.json()) as {
    status: string;
    routes?: {
      legs: { duration: { value: number }; distance: { value: number } }[];
    }[];
    error_message?: string;
  };

  if (gJson.status !== 'OK' || !gJson.routes?.[0]) {
    return jsonResponse(
      {
        error: gJson.error_message ?? gJson.status,
        details: gJson,
      },
      502,
    );
  }

  const route = gJson.routes[0];
  let totalSeconds = 0;
  let totalMeters = 0;
  for (const leg of route.legs) {
    totalSeconds += leg.duration.value;
    totalMeters += leg.distance.value;
  }

  return jsonResponse({
    duration_seconds: totalSeconds,
    distance_meters: totalMeters,
    duration_text: `${Math.round(totalSeconds / 60)} dk`,
    raw_status: gJson.status,
  });
});
