-- Nomad MVP: profiles, cities, places, routes, route_places, damage_reports
-- UUID PKs, RLS enabled on all tables

-- -----------------------------------------------------------------------------
-- profiles (linked to auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- -----------------------------------------------------------------------------
-- cities
-- -----------------------------------------------------------------------------
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Turkey',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cities_select_all"
  ON public.cities FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "cities_insert_authenticated"
  ON public.cities FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "cities_update_authenticated"
  ON public.cities FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "cities_delete_authenticated"
  ON public.cities FOR DELETE
  TO authenticated
  USING (false);

-- -----------------------------------------------------------------------------
-- places
-- -----------------------------------------------------------------------------
CREATE TABLE public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES public.cities (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  google_place_id TEXT,
  wiki_summary TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX places_city_id_idx ON public.places (city_id);
CREATE INDEX places_category_idx ON public.places (category);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "places_select_all"
  ON public.places FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "places_insert_none"
  ON public.places FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "places_update_none"
  ON public.places FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "places_delete_none"
  ON public.places FOR DELETE
  TO authenticated
  USING (false);

-- -----------------------------------------------------------------------------
-- routes
-- -----------------------------------------------------------------------------
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX routes_user_id_idx ON public.routes (user_id);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "routes_select_own"
  ON public.routes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "routes_insert_own"
  ON public.routes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "routes_update_own"
  ON public.routes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "routes_delete_own"
  ON public.routes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- route_places
-- -----------------------------------------------------------------------------
CREATE TABLE public.route_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID NOT NULL REFERENCES public.routes (id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places (id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  UNIQUE (route_id, order_index),
  UNIQUE (route_id, place_id)
);

CREATE INDEX route_places_route_id_idx ON public.route_places (route_id);

ALTER TABLE public.route_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "route_places_select_via_route"
  ON public.route_places FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.routes r
      WHERE r.id = route_places.route_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "route_places_insert_via_route"
  ON public.route_places FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.routes r
      WHERE r.id = route_places.route_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "route_places_update_via_route"
  ON public.route_places FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.routes r
      WHERE r.id = route_places.route_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "route_places_delete_via_route"
  ON public.route_places FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.routes r
      WHERE r.id = route_places.route_id AND r.user_id = auth.uid()
    )
  );

-- -----------------------------------------------------------------------------
-- damage_reports
-- -----------------------------------------------------------------------------
CREATE TYPE public.report_status AS ENUM ('bekliyor', 'incelendi', 'iletildi');

CREATE TYPE public.damage_severity AS ENUM ('kritik', 'orta', 'hafif');

CREATE TABLE public.damage_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  place_id UUID NOT NULL REFERENCES public.places (id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  description TEXT,
  ai_analysis TEXT,
  severity public.damage_severity,
  status public.report_status NOT NULL DEFAULT 'bekliyor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX damage_reports_user_id_idx ON public.damage_reports (user_id);

ALTER TABLE public.damage_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "damage_reports_select_own"
  ON public.damage_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "damage_reports_insert_own"
  ON public.damage_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "damage_reports_update_own"
  ON public.damage_reports FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "damage_reports_delete_own"
  ON public.damage_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- Seed cities (fixed UUIDs for stable references)
-- -----------------------------------------------------------------------------
INSERT INTO public.cities (id, name, country, lat, lng) VALUES
  ('a0000001-0000-4000-8000-000000000001', 'İstanbul', 'Turkey', 41.0082, 28.9784),
  ('a0000001-0000-4000-8000-000000000002', 'Ankara', 'Turkey', 39.9334, 32.8597),
  ('a0000001-0000-4000-8000-000000000003', 'İzmir', 'Turkey', 38.4237, 27.1428);

-- Istanbul places (5+)
INSERT INTO public.places (city_id, name, category, google_place_id, lat, lng) VALUES
  ('a0000001-0000-4000-8000-000000000001', 'Ayasofya-i Kebir Camii', 'cami', NULL, 41.008583, 28.980175),
  ('a0000001-0000-4000-8000-000000000001', 'Topkapı Sarayı Müzesi', 'muze', NULL, 41.011520, 28.983379),
  ('a0000001-0000-4000-8000-000000000001', 'Galata Kulesi', 'kale', NULL, 41.025688, 28.974128),
  ('a0000001-0000-4000-8000-000000000001', 'Yerebatan Sarnıcı', 'arkeolojik', NULL, 41.008388, 28.977838),
  ('a0000001-0000-4000-8000-000000000001', 'Sultanahmet Camii', 'cami', NULL, 41.005413, 28.976815),
  ('a0000001-0000-4000-8000-000000000001', 'İstanbul Arkeoloji Müzeleri', 'muze', NULL, 41.011732, 28.981518);

-- Ankara places
INSERT INTO public.places (city_id, name, category, google_place_id, lat, lng) VALUES
  ('a0000001-0000-4000-8000-000000000002', 'Anıtkabir', 'muze', NULL, 39.925533, 32.836944),
  ('a0000001-0000-4000-8000-000000000002', 'Ankara Kalesi', 'kale', NULL, 39.941938, 32.865091),
  ('a0000001-0000-4000-8000-000000000002', 'Roma Hamamı', 'arkeolojik', NULL, 39.937859, 32.854981),
  ('a0000001-0000-4000-8000-000000000002', 'Hacı Bayram Camii', 'cami', NULL, 39.941076, 32.859089),
  ('a0000001-0000-4000-8000-000000000002', 'Museum of Anatolian Civilizations', 'muze', NULL, 39.938564, 32.862378),
  ('a0000001-0000-4000-8000-000000000002', 'Julian Sütunu', 'arkeolojik', NULL, 39.936389, 32.859722);

-- Izmir places
INSERT INTO public.places (city_id, name, category, google_place_id, lat, lng) VALUES
  ('a0000001-0000-4000-8000-000000000003', 'Efes Antik Kenti', 'arkeolojik', NULL, 37.939722, 27.341111),
  ('a0000001-0000-4000-8000-000000000003', 'Saat Kulesi', 'kale', NULL, 38.418869, 27.128735),
  ('a0000001-0000-4000-8000-000000000003', 'Kemeraltı Çarşısı', 'diger', NULL, 38.417806, 27.129612),
  ('a0000001-0000-4000-8000-000000000003', 'Hisar Camii', 'cami', NULL, 38.418889, 27.129167),
  ('a0000001-0000-4000-8000-000000000003', 'İzmir Arkeoloji Müzesi', 'muze', NULL, 38.417347, 27.134953),
  ('a0000001-0000-4000-8000-000000000003', 'Kadifekale', 'kale', NULL, 38.431389, 27.142778);

-- -----------------------------------------------------------------------------
-- Storage buckets & policies (avatars, damage-photos)
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('damage-photos', 'damage-photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "avatars_select_public"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "avatars_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "damage_photos_select_own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'damage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "damage_photos_insert_own"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'damage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "damage_photos_update_own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'damage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "damage_photos_delete_own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'damage-photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow service role / edge to read damage photos when needed via signed URLs from client
