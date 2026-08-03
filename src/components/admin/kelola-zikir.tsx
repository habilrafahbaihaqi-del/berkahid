"use client";

import { useEffect, useMemo, useState } from "react";
import { ZIKR_CATEGORIES } from "@/data/zikrs";
import { adminZikrApi, type AdminZikr } from "@/lib/admin-api";

interface ZikrFormState {
  name: string;
  category: string;
  arabicText: string;
  meaning: string;
  explanation: string;
}

const EMPTY_FORM: ZikrFormState = {
  name: "",
  category: ZIKR_CATEGORIES[0],
  arabicText: "",
  meaning: "",
  explanation: "",
};

function toForm(zikr: AdminZikr): ZikrFormState {
  return {
    name: zikr.name,
    category: zikr.category,
    arabicText: zikr.arabicText,
    meaning: zikr.meaning,
    explanation: zikr.explanation,
  };
}

export default function KelolaZikir() {
  const [zikrs, setZikrs] = useState<AdminZikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ZikrFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminZikr | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminZikrApi
      .list()
      .then((payload) => {
        if (cancelled) return;
        setZikrs(payload.results);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(
          error instanceof Error ? error.message : "Gagal memuat daftar zikir.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory === "semua"
        ? zikrs
        : zikrs.filter((zikr) => zikr.category === activeCategory),
    [zikrs, activeCategory],
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (zikr: AdminZikr) => {
    setEditingId(zikr.id);
    setForm(toForm(zikr));
    setFormError(null);
    setFormOpen(true);
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.arabicText.trim() || !form.meaning.trim()) {
      setFormError("Nama, teks Arab, dan arti wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      if (editingId) {
        const { result } = await adminZikrApi.update(editingId, form);
        setZikrs((current) =>
          current.map((zikr) => (zikr.id === editingId ? result : zikr)),
        );
        showNotice("Zikir berhasil diperbarui.");
      } else {
        const { result } = await adminZikrApi.create(form);
        setZikrs((current) => [result, ...current]);
        showNotice("Zikir berhasil ditambahkan.");
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menyimpan zikir.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminZikrApi.remove(deleting.id);
      setZikrs((current) => current.filter((zikr) => zikr.id !== deleting.id));
      showNotice("Zikir berhasil dihapus.");
      setDeleting(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menghapus zikir.");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-emerald-100/40 ring-1 ring-white/15 outline-none focus:ring-2 focus:ring-emerald-300/60";

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-950 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold">Kelola Zikir</h1>
            <p className="mt-1 text-sm text-emerald-100/60">
              {zikrs.length} zikir · tambah, edit, dan hapus zikir beserta maknanya
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="flex items-center gap-1.5 rounded-2xl bg-emerald-400/15 px-4 py-2.5 text-sm font-bold text-emerald-200 ring-1 ring-emerald-300/30 transition-colors hover:bg-emerald-400/25"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Zikir
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["semua", ...ZIKR_CATEGORIES].map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-colors ${
                  active
                    ? "bg-emerald-400/20 text-emerald-100 ring-emerald-300/40"
                    : "bg-white/5 text-emerald-100/60 ring-white/10 hover:bg-white/10"
                }`}
              >
                {category === "semua" ? "Semua" : category}
              </button>
            );
          })}
        </div>

        {notice && (
          <p className="mt-4 rounded-2xl bg-emerald-400/15 px-4 py-2.5 text-sm font-semibold text-emerald-200 ring-1 ring-emerald-300/30">
            {notice}
          </p>
        )}

        {loading && (
          <div className="mt-4 rounded-3xl bg-white/10 px-5 py-10 text-center text-sm text-emerald-100/60 ring-1 ring-white/15">
            Memuat daftar zikir…
          </div>
        )}

        {!loading && loadError && (
          <div className="mt-4 rounded-3xl bg-red-400/10 px-5 py-8 text-center ring-1 ring-red-400/20">
            <p className="text-sm font-semibold text-red-200">{loadError}</p>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setLoadError(null);
                adminZikrApi
                  .list()
                  .then((payload) => setZikrs(payload.results))
                  .catch((error: unknown) =>
                    setLoadError(
                      error instanceof Error
                        ? error.message
                        : "Gagal memuat daftar zikir.",
                    ),
                  )
                  .finally(() => setLoading(false));
              }}
              className="mt-3 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              Coba lagi
            </button>
          </div>
        )}

        {!loading && !loadError && (
          <ul className="mt-4 overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/15">
            {filtered.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-emerald-100/60">
                Belum ada zikir pada kategori ini.
              </li>
            )}
          {filtered.map((zikr) => (
            <li
              key={zikr.id}
              className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold">{zikr.name}</p>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                    {zikr.category}
                  </span>
                </div>
                <p
                  dir="rtl"
                  lang="ar"
                  className="mt-1 truncate text-sm text-emerald-100/80 font-quran"
                >
                  {zikr.arabicText}
                </p>
                <p className="mt-1 truncate text-xs text-emerald-100/50">{zikr.meaning}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(zikr)}
                  aria-label={`Edit ${zikr.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(zikr)}
                  aria-label={`Hapus ${zikr.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-400/10 text-red-200 ring-1 ring-red-400/20 transition-colors hover:bg-red-400/20"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
          </ul>
        )}
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
          role="presentation"
          onClick={() => setFormOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={editingId ? "Edit zikir" : "Tambah zikir"}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-emerald-950 p-6 ring-1 ring-white/15 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingId ? "Edit Zikir" : "Tambah Zikir"}
              </h2>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                aria-label="Tutup"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition-colors hover:bg-white/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formError && (
              <p className="mt-4 rounded-2xl bg-red-400/10 px-4 py-2.5 text-xs font-semibold text-red-200 ring-1 ring-red-400/20">
                {formError}
              </p>
            )}

            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label htmlFor="zikr-name" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Nama Zikir
                </label>
                <input
                  id="zikr-name"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  placeholder="Contoh: Tasbih"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="zikr-category" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Kategori
                </label>
                <select
                  id="zikr-category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className={inputClass}
                >
                  {ZIKR_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-emerald-950">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="zikr-arabic" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Teks Arab
                </label>
                <textarea
                  id="zikr-arabic"
                  dir="rtl"
                  lang="ar"
                  value={form.arabicText}
                  onChange={(event) => setForm({ ...form, arabicText: event.target.value })}
                  rows={2}
                  placeholder="سُبْحَانَ اللَّهِ"
                  className={`${inputClass} font-quran resize-none`}
                />
              </div>
              <div>
                <label htmlFor="zikr-meaning" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Arti
                </label>
                <input
                  id="zikr-meaning"
                  value={form.meaning}
                  onChange={(event) => setForm({ ...form, meaning: event.target.value })}
                  placeholder="Maha Suci Allah."
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="zikr-explanation" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Penjelasan / Keutamaan
                </label>
                <textarea
                  id="zikr-explanation"
                  value={form.explanation}
                  onChange={(event) => setForm({ ...form, explanation: event.target.value })}
                  rows={3}
                  placeholder="Keutamaan zikir ini..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="rounded-2xl bg-emerald-400/20 px-5 py-2.5 text-sm font-bold text-emerald-100 ring-1 ring-emerald-300/40 transition-colors hover:bg-emerald-400/30 disabled:opacity-60"
              >
                {saving ? "Menyimpan…" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          role="presentation"
          onClick={() => setDeleting(null)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-label="Konfirmasi hapus zikir"
            className="w-full max-w-sm rounded-3xl bg-emerald-950 p-6 ring-1 ring-white/15"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-base font-bold">Hapus zikir ini?</h2>
            <p className="mt-2 text-sm text-emerald-100/70">
              “{deleting.name}” akan dihapus permanen dan tidak dapat dikembalikan.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                className="rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="rounded-2xl bg-red-400/15 px-5 py-2.5 text-sm font-bold text-red-200 ring-1 ring-red-400/30 transition-colors hover:bg-red-400/25 disabled:opacity-60"
              >
                {saving ? "Menghapus…" : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
