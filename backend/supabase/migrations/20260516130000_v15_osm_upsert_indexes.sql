-- v1.5: OSM seed upsert keys + 81 il şehir kayıtları

CREATE UNIQUE INDEX IF NOT EXISTS places_google_place_id_key
  ON public.places (google_place_id)
  WHERE google_place_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS cities_name_country_key
  ON public.cities (name, country);
