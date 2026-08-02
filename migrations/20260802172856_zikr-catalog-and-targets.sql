-- Skema fase 2 (Zikir): katalog zikir, kategori, dan target harian pengguna

CREATE TABLE public.zikr_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.zikr_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zikr categories public read" ON public.zikr_categories
  FOR SELECT TO anon, authenticated
  USING (true);

GRANT SELECT ON public.zikr_categories TO anon, authenticated;

CREATE TABLE public.zikrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  arabic_text TEXT NOT NULL,
  meaning TEXT NOT NULL,
  explanation TEXT NOT NULL,
  category_id UUID REFERENCES public.zikr_categories(id) ON DELETE SET NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.zikrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "zikrs public read" ON public.zikrs
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE INDEX idx_zikrs_category ON public.zikrs(category_id);

GRANT SELECT ON public.zikrs TO anon, authenticated;

CREATE TABLE public.zikr_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  zikr_id UUID NOT NULL REFERENCES public.zikrs(id) ON DELETE CASCADE,
  target_count INTEGER NOT NULL
    CONSTRAINT zikr_targets_target_positive CHECK (target_count > 0),
  current_count INTEGER NOT NULL DEFAULT 0
    CONSTRAINT zikr_targets_current_nonnegative CHECK (current_count >= 0),
  target_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT zikr_targets_unique_per_day UNIQUE (user_id, zikr_id, target_date)
);

ALTER TABLE public.zikr_targets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can read own zikr targets" ON public.zikr_targets
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE POLICY "user can insert own zikr targets" ON public.zikr_targets
  FOR INSERT TO authenticated
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "user can update own zikr targets" ON public.zikr_targets
  FOR UPDATE TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "user can delete own zikr targets" ON public.zikr_targets
  FOR DELETE TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX idx_zikr_targets_user_date ON public.zikr_targets(user_id, target_date);
CREATE INDEX idx_zikr_targets_zikr ON public.zikr_targets(zikr_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.zikr_targets TO authenticated;

CREATE TRIGGER zikr_categories_set_updated_at
  BEFORE UPDATE ON public.zikr_categories
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER zikrs_set_updated_at
  BEFORE UPDATE ON public.zikrs
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

CREATE TRIGGER zikr_targets_set_updated_at
  BEFORE UPDATE ON public.zikr_targets
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
