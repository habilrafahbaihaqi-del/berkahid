-- Helper role admin + RLS CRUD admin untuk cerita Islami

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
      AND (profile->>'role') = 'admin'
  );
$$;

CREATE POLICY "admin can insert stories" ON public.stories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update stories" ON public.stories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete stories" ON public.stories
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.stories TO authenticated;
