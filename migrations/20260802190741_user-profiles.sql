-- Skema fase 4 (Autentikasi): profil pengguna dengan role.
-- Tabel users dikelola InsForge (auth.users); tabel ini menambah data aplikasi.

CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user'
    CONSTRAINT user_profiles_role_check CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can read own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX idx_user_profiles_user ON public.user_profiles(user_id);

GRANT SELECT ON public.user_profiles TO authenticated;

CREATE TRIGGER user_profiles_set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();

-- Perbarui helper is_admin() agar membaca role dari tabel aplikasi
-- (bukan metadata auth.users yang tidak dapat diubah dari app).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_id = (SELECT auth.uid())
      AND role = 'admin'
  );
$$;
