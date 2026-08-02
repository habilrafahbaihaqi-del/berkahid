-- Skema fase 3 (Cerita Islami): kategori cerita dan cerita lengkap

CREATE TABLE public.story_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.story_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story categories public read" ON public.story_categories
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.story_categories TO anon, authenticated;

CREATE TABLE public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  category_id UUID REFERENCES public.story_categories(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "stories public read" ON public.stories
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_stories_category ON public.stories(category_id);

GRANT SELECT ON public.stories TO anon, authenticated;

CREATE TRIGGER story_categories_set_updated_at
  BEFORE UPDATE ON public.story_categories
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER stories_set_updated_at
  BEFORE UPDATE ON public.stories
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
