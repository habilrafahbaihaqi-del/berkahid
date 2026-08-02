-- Skema fase 3 (Doa Harian): katalog doa dan kategori doa

CREATE TABLE public.doa_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.doa_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "doa categories public read" ON public.doa_categories
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.doa_categories TO anon, authenticated;

CREATE TABLE public.doas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  translation TEXT NOT NULL,
  category_id UUID REFERENCES public.doa_categories(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.doas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "doas public read" ON public.doas
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_doas_category ON public.doas(category_id);

GRANT SELECT ON public.doas TO anon, authenticated;

CREATE TRIGGER doa_categories_set_updated_at
  BEFORE UPDATE ON public.doa_categories
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER doas_set_updated_at
  BEFORE UPDATE ON public.doas
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
