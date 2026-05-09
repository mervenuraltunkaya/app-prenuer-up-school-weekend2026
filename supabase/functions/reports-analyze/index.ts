import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { getUserFromRequest } from '../_shared/auth.ts';

const PROMPT = `You are an expert assessing visible structural or surface damage on cultural heritage sites from a single photo.
Respond ONLY with valid JSON (no markdown) in this exact shape:
{"severity":"kritik"|"orta"|"hafif","analysis_tr":"2-4 cümle Türkçe açıklama","confidence":"low"|"medium"|"high"}
Rules:
- severity: kritik = acil müdahale; orta = orta düzey bozulma; hafif = küçük aşınma/lekelenme veya belirsiz.
- If the image is not a building/monument or damage cannot be judged, use severity "hafif" and explain uncertainty in analysis_tr.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const auth = await getUserFromRequest(req);
  if ('error' in auth) return auth.error;

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) {
    return jsonResponse({ error: 'GEMINI_API_KEY not set' }, 500);
  }

  const model = Deno.env.get('GEMINI_MODEL') ?? 'gemini-2.5-flash';

  let body: { mime_type?: string; image_base64?: string };
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON' }, 400);
  }

  const mime = body.mime_type ?? 'image/jpeg';
  const b64 = body.image_base64;
  if (!b64 || typeof b64 !== 'string') {
    return jsonResponse({ error: 'image_base64 required' }, 400);
  }

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [
          { text: PROMPT },
          {
            inline_data: {
              mime_type: mime,
              data: b64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.2,
    },
  };

  const gRes = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const gJson = (await gRes.json()) as {
    error?: { message?: string };
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  if (!gRes.ok) {
    return jsonResponse(
      { error: gJson.error?.message ?? 'Gemini request failed', raw: gJson },
      502,
    );
  }

  const text =
    gJson.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';

  let parsed: {
    severity?: string;
    analysis_tr?: string;
    confidence?: string;
  };
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    return jsonResponse({ error: 'Model did not return valid JSON', raw_text: text }, 502);
  }

  const sev = parsed.severity;
  if (sev !== 'kritik' && sev !== 'orta' && sev !== 'hafif') {
    return jsonResponse({ error: 'Invalid severity from model', parsed }, 502);
  }

  return jsonResponse({
    severity: sev,
    ai_analysis: parsed.analysis_tr ?? '',
    confidence: parsed.confidence ?? 'medium',
  });
});
