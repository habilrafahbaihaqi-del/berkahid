-- CRUD admin untuk doa: kebijakan RLS + hak akses
-- Akses baca sudah publik; di sini hanya menambah operasi tulis untuk admin.

CREATE POLICY "admin can insert doas" ON public.doas
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update doas" ON public.doas
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete doas" ON public.doas
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.doas TO authenticated;

CREATE POLICY "admin can insert doa categories" ON public.doa_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update doa categories" ON public.doa_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete doa categories" ON public.doa_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.doa_categories TO authenticated;
