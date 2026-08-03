-- CRUD admin untuk zikir: kebijakan RLS + hak akses
-- Akses baca sudah publik; di sini hanya menambah operasi tulis untuk admin.

CREATE POLICY "admin can insert zikrs" ON public.zikrs
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update zikrs" ON public.zikrs
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete zikrs" ON public.zikrs
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.zikrs TO authenticated;

CREATE POLICY "admin can insert zikr categories" ON public.zikr_categories
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can update zikr categories" ON public.zikr_categories
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "admin can delete zikr categories" ON public.zikr_categories
  FOR DELETE TO authenticated
  USING (public.is_admin());

GRANT INSERT, UPDATE, DELETE ON public.zikr_categories TO authenticated;
