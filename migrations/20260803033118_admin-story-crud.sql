-- CRUD admin untuk cerita: kebijakan RLS untuk kategori cerita.
-- Tabel stories sudah memiliki policy admin (migrasi 20260802181806);
-- di sini hanya menambahkan kategori cerita + hak akses.

CREATE POLICY "admin can insert story categories" ON public.story_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update story categories" ON public.story_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete story categories" ON public.story_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.story_categories TO authenticated;
