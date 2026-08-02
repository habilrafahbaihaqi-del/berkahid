-- Skema fase 2 (Al-Qur'an): katalog surah, ayat, tafsir, dan progress bacaan

CREATE TABLE public.quran_surahs (
  number INTEGER PRIMARY KEY
    CONSTRAINT quran_surahs_number_range CHECK (number BETWEEN 1 AND 114),
  name TEXT NOT NULL,
  arabic_name TEXT NOT NULL,
  meaning TEXT NOT NULL,
  ayah_count INTEGER NOT NULL
    CONSTRAINT quran_surahs_ayah_count_positive CHECK (ayah_count > 0),
  start_juz INTEGER NOT NULL
    CONSTRAINT quran_surahs_juz_range CHECK (start_juz BETWEEN 1 AND 30),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quran_surahs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quran surahs public read" ON public.quran_surahs
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.quran_surahs TO anon, authenticated;

CREATE TABLE public.quran_ayahs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INTEGER NOT NULL REFERENCES public.quran_surahs(number) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL
    CONSTRAINT quran_ayahs_ayah_number_positive CHECK (ayah_number > 0),
  juz INTEGER NOT NULL
    CONSTRAINT quran_ayahs_juz_range CHECK (juz BETWEEN 1 AND 30),
  text_uthmani TEXT NOT NULL,
  translation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT quran_ayahs_unique UNIQUE (surah_number, ayah_number)
);

ALTER TABLE public.quran_ayahs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quran ayahs public read" ON public.quran_ayahs
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_quran_ayahs_surah ON public.quran_ayahs(surah_number, ayah_number);

GRANT SELECT ON public.quran_ayahs TO anon, authenticated;

CREATE TABLE public.quran_tafsirs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_number INTEGER NOT NULL REFERENCES public.quran_surahs(number) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL
    CONSTRAINT quran_tafsirs_ayah_number_positive CHECK (ayah_number > 0),
  source TEXT NOT NULL DEFAULT 'kemenag',
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT quran_tafsirs_unique UNIQUE (surah_number, ayah_number)
);

ALTER TABLE public.quran_tafsirs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quran tafsirs public read" ON public.quran_tafsirs
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_quran_tafsirs_surah ON public.quran_tafsirs(surah_number, ayah_number);

GRANT SELECT ON public.quran_tafsirs TO anon, authenticated;

CREATE TABLE public.reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number INTEGER NOT NULL REFERENCES public.quran_surahs(number) ON DELETE CASCADE,
  ayah_number INTEGER NOT NULL
    CONSTRAINT reading_progress_ayah_number_positive CHECK (ayah_number > 0),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT reading_progress_user_unique UNIQUE (user_id)
);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can read own reading progress" ON public.reading_progress
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "user can insert own reading progress" ON public.reading_progress
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "user can update own reading progress" ON public.reading_progress
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "user can delete own reading progress" ON public.reading_progress
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX idx_reading_progress_user ON public.reading_progress(user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.reading_progress TO authenticated;

CREATE TRIGGER quran_surahs_set_updated_at
  BEFORE UPDATE ON public.quran_surahs
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER quran_ayahs_set_updated_at
  BEFORE UPDATE ON public.quran_ayahs
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER quran_tafsirs_set_updated_at
  BEFORE UPDATE ON public.quran_tafsirs
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER reading_progress_set_updated_at
  BEFORE UPDATE ON public.reading_progress
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
