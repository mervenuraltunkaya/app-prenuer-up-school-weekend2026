import Constants from 'expo-constants';
import { supabase } from '@/lib/supabase';

function projectUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const extra = Constants.expoConfig?.extra as { supabaseUrl?: string } | undefined;
  return (extra?.supabaseUrl ?? '').replace(/\/$/, '');
}

export async function fetchPlacesWiki(placeId: string): Promise<{
  summary: string | null;
  cached?: boolean;
  message?: string;
}> {
  const base = projectUrl();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Oturum yok');

  const url = `${base}/functions/v1/places-wiki?place_id=${encodeURIComponent(placeId)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
  });
  const json = (await res.json()) as { summary?: string | null; cached?: boolean; message?: string; error?: string };
  if (!res.ok) throw new Error(json.error ?? 'Wiki isteği başarısız');
  return {
    summary: json.summary ?? null,
    cached: json.cached,
    message: json.message,
  };
}

export async function fetchRouteDirections(
  points: { lat: number; lng: number }[],
): Promise<{ duration_seconds: number; distance_meters: number; duration_text: string }> {
  if (points.length < 2) {
    return { duration_seconds: 0, distance_meters: 0, duration_text: '—' };
  }
  const base = projectUrl();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Oturum yok');

  const origin = `${points[0].lat},${points[0].lng}`;
  const destination = `${points[points.length - 1].lat},${points[points.length - 1].lng}`;
  const middle = points.slice(1, -1);
  const params = new URLSearchParams({
    origin,
    destination,
  });
  if (middle.length > 0) {
    params.set('waypoints', middle.map((p) => `${p.lat},${p.lng}`).join('|'));
  }

  const url = `${base}/functions/v1/routes-directions?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
  });
  const json = (await res.json()) as {
    duration_seconds?: number;
    distance_meters?: number;
    duration_text?: string;
    error?: string;
  };
  if (!res.ok) throw new Error(json.error ?? 'Yön tarifi alınamadı');
  return {
    duration_seconds: json.duration_seconds ?? 0,
    distance_meters: json.distance_meters ?? 0,
    duration_text: json.duration_text ?? '—',
  };
}

export async function analyzeDamageImage(
  imageBase64: string,
  mimeType: string,
): Promise<{ severity: 'kritik' | 'orta' | 'hafif'; ai_analysis: string }> {
  const base = projectUrl();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('Oturum yok');

  const url = `${base}/functions/v1/reports-analyze`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
    },
    body: JSON.stringify({ image_base64: imageBase64, mime_type: mimeType }),
  });
  const json = (await res.json()) as {
    severity?: 'kritik' | 'orta' | 'hafif';
    ai_analysis?: string;
    error?: string;
  };
  if (!res.ok) throw new Error(json.error ?? 'Analiz başarısız');
  if (!json.severity) throw new Error('Geçersiz analiz yanıtı');
  return {
    severity: json.severity,
    ai_analysis: json.ai_analysis ?? '',
  };
}
