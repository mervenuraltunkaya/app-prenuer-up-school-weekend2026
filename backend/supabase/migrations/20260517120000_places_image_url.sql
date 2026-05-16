-- Mekan kapak görselleri (Wikipedia veya kategori placeholder)
ALTER TABLE public.places
  ADD COLUMN IF NOT EXISTS image_url TEXT;

COMMENT ON COLUMN public.places.image_url IS 'Wikipedia thumbnail veya kategori placeholder URL';
