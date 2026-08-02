"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DOA_CATEGORIES } from "@/data/doas";
import {
  fetchDoaById,
  fetchDoasByCategory,
  type DoaDetailApi,
} from "@/lib/doa-api";

export default function DoaDetail() {
  const params = useParams<{ slug: string; doaId: string }>();
  const category = DOA_CATEGORIES.find((c) => c.slug === params.slug);
  const [doa, setDoa] = useState<DoaDetailApi | null>(null);
  const [siblingIds, setSiblingIds] = useState<string[]>([]);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error" | "notfound">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);

  const currentKey = `${params.slug}/${params.doaId}`;

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetchDoaById(params.doaId),
      fetchDoasByCategory(params.slug),
    ])
      .then(([detail, siblingDoas]) => {
        if (cancelled) return;
        if (detail.category !== params.slug) {
          setState("notfound");
          return;
        }
        setDoa(detail);
        setSiblingIds(siblingDoas.map((d) => d.id));
        setLoadedKey(currentKey);
        setState("ready");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState(
          error instanceof Error && error.message === "Doa tidak ditemukan."
            ? "notfound"
            : "error",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [params.doaId, params.slug, attempt, currentKey]);

  const visible = loadedKey === currentKey ? doa : null;

  if (state === "loading" || (state === "ready" && !visible)) {
    return (
      <div className="flex flex-col items-center gap-3 py-16">
        <svg
          className="h-6 w-6 animate-spin text-emerald-200"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
          />
        </svg>
        <p className="text-sm text-emerald-100/70">Memuat doa…</p>
      </div>
    );
  }

  if (state === "notfound" || !visible) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pb-10 pt-6 text-center sm:max-w-lg">
        <p className="py-10 text-sm text-emerald-100/70">
          Doa tidak ditemukan.
        </p>
        <Link
          href="/doa"
          className="rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white"
        >
          Kembali ke Doa Harian
        </Link>
      </main>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 px-5 py-10 text-center ring-1 ring-white/15">
        <p className="text-sm text-emerald-100/80">
          Gagal memuat doa. Coba lagi nanti.
        </p>
        <button
          type="button"
          onClick={() => setAttempt((a) => a + 1)}
          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  const doaIndex = siblingIds.indexOf(visible.id);
  const prevDoaId = doaIndex > 0 ? siblingIds[doaIndex - 1] : null;
  const nextDoaId =
    doaIndex >= 0 && doaIndex < siblingIds.length - 1
      ? siblingIds[doaIndex + 1]
      : null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href={`/doa/${params.slug}`}
          aria-label={`Kembali ke ${category?.name ?? "kategori"}`}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-base font-bold">{visible.title}</h1>
          <p className="text-[11px] text-emerald-200/70">
            {visible.categoryName} · {doaIndex + 1} dari {siblingIds.length}
          </p>
        </div>
      </header>

      <nav
        className="flex items-center gap-1.5 text-[11px] text-emerald-200/60"
        aria-label="Breadcrumb"
      >
        <Link href="/doa" className="transition-colors hover:text-emerald-200">
          Doa Harian
        </Link>
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <Link
          href={`/doa/${params.slug}`}
          className="transition-colors hover:text-emerald-200"
        >
          {visible.categoryName}
        </Link>
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
        <span className="truncate font-semibold text-emerald-100">
          {visible.title}
        </span>
      </nav>

      <section className="flex flex-col items-center gap-4 rounded-3xl bg-white/10 px-6 py-10 ring-1 ring-white/20">
        <p
          dir="rtl"
          lang="ar"
          className="font-quran text-2xl leading-[2.2] text-white [text-align:center] [overflow-wrap:anywhere]"
        >
          {visible.arabicText}
        </p>
      </section>

      <section className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-emerald-300">
          Artinya
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-emerald-50">
          {visible.translation}
        </p>
      </section>

      <nav
        className="mt-1 flex items-center justify-between gap-3"
        aria-label="Navigasi doa"
      >
        {prevDoaId ? (
          <Link
            href={`/doa/${params.slug}/${prevDoaId}`}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span className="truncate">Sebelumnya</span>
          </Link>
        ) : (
          <span className="px-4 py-2.5 text-xs text-emerald-100/40">
            Awal kategori
          </span>
        )}
        {nextDoaId ? (
          <Link
            href={`/doa/${params.slug}/${nextDoaId}`}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            <span className="truncate">Berikutnya</span>
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        ) : (
          <span className="px-4 py-2.5 text-xs text-emerald-100/40">
            Akhir kategori
          </span>
        )}
      </nav>
    </main>
  );
}
