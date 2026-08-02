-- Skema fase 4 (Verifikasi Email): status verifikasi & token per pengguna.
-- Kolom tidak ditambahkan ke auth.users (dikelola InsForge); gunakan tabel kustom.

CREATE TABLE public.user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  verification_token TEXT,
  token_expires_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.user_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user can read own verification status" ON public.user_verifications
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

CREATE INDEX idx_user_verifications_user ON public.user_verifications(user_id);

GRANT SELECT ON public.user_verifications TO authenticated;

CREATE TRIGGER user_verifications_set_updated_at
  BEFORE UPDATE ON public.user_verifications
  FOR EACH ROW
  EXECUTE FUNCTION system.update_updated_at();
