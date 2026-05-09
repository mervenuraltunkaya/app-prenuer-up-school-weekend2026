import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';
import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';

async function fetchWikiSummary(titleHint: string): Promise<{ extract: string; title: string } | null> {
  const searchUrl =
    `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(titleHint)}&limit=1`;
  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return null;
  const searchJson = (await searchRes.json()) as { pages?: { title: string }[] };
  const title = searchJson.pages?.[0]?.title;
  if (!title) {
    const trSearch =
      `https://tr.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(titleHint)}&limit=1`;
    const trRes = await fetch(trSearch);
    if (!trRes.ok) return null;
    const trJson = (await trRes.json()) as { pages?: { title: string }[] };
    const trTitle = trJson.pages?.[0]?.title;
    if (!trTitle) return null;
    const sumUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(trTitle)}`;
    const sumRes = await fetch(sumUrl);
    if (!sumRes.ok) return null;
    const sum = (await sumRes.json()) as { extract?: string; title?: string };
    if (!sum.extract) return null;
    return { extract: sum.extract, title: sum.title ?? trTitle };
  }

  const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  const sumRes = await fetch(sumUrl);
  if (!sumRes.ok) return null;
  const sum = (await sumRes.json()) as { extract?: string; title?: string };
  if (!sum.extract) return null;
  return { extract: sum.extract, title: sum.title ?? title };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const auth = await getUserFromRequest(req);
  if ('error' in auth) return auth.error;

  const url = new URL(req.url);
  const placeId = url.searchParams.get('place_id');
  if (!placeId) {
    return jsonResponse({ error: 'place_id required' }, 400);
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (!serviceKey || !supabaseUrl) {
    return jsonResponse({ error: 'Server misconfigured' }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: place, error: placeErr } = await admin
    .from('places')
    .select('id, name, wiki_summary')
    .eq('id', placeId)
    .maybeSingle();

  if (placeErr || !place) {
    return jsonResponse({ error: 'Place not found' }, 404);
  }

  if (place.wiki_summary && String(place.wiki_summary).length > 0) {
    return jsonResponse({ summary: place.wiki_summary, cached: true });
  }

  const wiki = await fetchWikiSummary(place.name);
  if (!wiki) {
    return jsonResponse({ summary: null, message: 'No Wikipedia article found' });
  }

  await admin.from('places').update({ wiki_summary: wiki.extract }).eq('id', placeId);

  return jsonResponse({ summary: wiki.extract, title: wiki.title, cached: false });
});
