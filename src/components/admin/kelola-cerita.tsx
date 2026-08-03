"use client";

import { useEffect, useMemo, useState } from "react";
import { STORY_CATEGORIES } from "@/data/stories";
import { adminStoryApi, type AdminStory } from "@/lib/admin-api";

interface StoryFormState {
  title: string;
  category: string;
  summary: string;
  content: string;
}

function categorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-");
}

const EMPTY_FORM: StoryFormState = {
  title: "",
  category: STORY_CATEGORIES[0],
  summary: "",
  content: "",
};

function toForm(story: AdminStory): StoryFormState {
  return {
    title: story.title,
    category: story.categoryName || story.category,
    summary: story.summary,
    content: story.content,
  };
}

export default function KelolaCerita() {
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<StoryFormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<AdminStory | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    adminStoryApi
      .list()
      .then((payload) => {
        if (cancelled) return;
        setStories(payload.results);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setLoadError(
          error instanceof Error ? error.message : "Gagal memuat daftar cerita.",
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
        ? stories
        : stories.filter(
            (story) =>
              categorySlug(story.categoryName || story.category) === activeCategory,
          ),
    [stories, activeCategory],
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  };

  const openEdit = (story: AdminStory) => {
    setEditingId(story.id);
    setForm(toForm(story));
    setFormError(null);
    setFormOpen(true);
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2500);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setFormError("Judul dan isi cerita wajib diisi.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      title: form.title.trim(),
      summary: form.summary.trim(),
      content: form.content.trim(),
      category: categorySlug(form.category),
    };
    try {
      if (editingId) {
        const { result } = await adminStoryApi.update(editingId, payload);
        setStories((current) =>
          current.map((story) => (story.id === editingId ? result : story)),
        );
        showNotice("Cerita berhasil diperbarui.");
      } else {
        const { result } = await adminStoryApi.create(payload);
        setStories((current) => [result, ...current]);
        showNotice("Cerita berhasil ditambahkan.");
      }
      setFormOpen(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menyimpan cerita.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    try {
      await adminStoryApi.remove(deleting.id);
      setStories((current) => current.filter((story) => story.id !== deleting.id));
      showNotice("Cerita berhasil dihapus.");
      setDeleting(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Gagal menghapus cerita.");
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
            <h1 className="text-xl font-bold">Kelola Cerita Islami</h1>
            <p className="mt-1 text-sm text-emerald-100/60">
              {stories.length} cerita · tambah, edit, dan hapus cerita Islami
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
            Tambah Cerita
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {["semua", ...STORY_CATEGORIES.map(categorySlug)].map((slug) => {
            const active = slug === activeCategory;
            const label =
              slug === "semua"
                ? "Semua"
                : STORY_CATEGORIES.find((c) => categorySlug(c) === slug) ?? slug;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => setActiveCategory(slug)}
                aria-pressed={active}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition-colors ${
                  active
                    ? "bg-emerald-400/20 text-emerald-100 ring-emerald-300/40"
                    : "bg-white/5 text-emerald-100/60 ring-white/10 hover:bg-white/10"
                }`}
              >
                {label}
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
            Memuat daftar cerita…
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
                adminStoryApi
                  .list()
                  .then((payload) => setStories(payload.results))
                  .catch((error: unknown) =>
                    setLoadError(
                      error instanceof Error
                        ? error.message
                        : "Gagal memuat daftar cerita.",
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
                Belum ada cerita pada kategori ini.
              </li>
            )}
          {filtered.map((story) => (
            <li
              key={story.id}
              className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold">{story.title}</p>
                  <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200 ring-1 ring-emerald-300/20">
                    {story.categoryName || story.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-emerald-100/50">
                  {story.summary || story.content}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(story)}
                  aria-label={`Edit ${story.title}`}
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
                  onClick={() => setDeleting(story)}
                  aria-label={`Hapus ${story.title}`}
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
            aria-label={editingId ? "Edit cerita" : "Tambah cerita"}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-emerald-950 p-6 ring-1 ring-white/15 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">
                {editingId ? "Edit Cerita" : "Tambah Cerita"}
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
                <label htmlFor="story-title" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Judul Cerita
                </label>
                <input
                  id="story-title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                  placeholder="Contoh: Kisah Nabi Ibrahim"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="story-category" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Kategori
                </label>
                <select
                  id="story-category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  className={inputClass}
                >
                  {STORY_CATEGORIES.map((category) => (
                    <option key={category} value={category} className="bg-emerald-950">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="story-summary" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Ringkasan
                </label>
                <input
                  id="story-summary"
                  value={form.summary}
                  onChange={(event) => setForm({ ...form, summary: event.target.value })}
                  placeholder="Ringkasan singkat cerita"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="story-content" className="mb-1.5 block text-xs font-semibold text-emerald-100/80">
                  Isi Cerita
                </label>
                <textarea
                  id="story-content"
                  value={form.content}
                  onChange={(event) => setForm({ ...form, content: event.target.value })}
                  rows={8}
                  placeholder="Tulis isi cerita lengkap di sini..."
                  className={`${inputClass} resize-y`}
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
            aria-label="Konfirmasi hapus cerita"
            className="w-full max-w-sm rounded-3xl bg-emerald-950 p-6 ring-1 ring-white/15"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-base font-bold">Hapus cerita ini?</h2>
            <p className="mt-2 text-sm text-emerald-100/70">
              “{deleting.title}” akan dihapus permanen dan tidak dapat dikembalikan.
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
