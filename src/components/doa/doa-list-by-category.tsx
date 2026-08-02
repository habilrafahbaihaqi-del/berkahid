"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DoaEmptyState from "@/components/doa/doa-empty-state";
import { DOA_CATEGORIES } from "@/data/doas";
import { fetchDoasByCategory, type DoaApi } from "@/lib/doa-api";

export default function DoaListByCategory() {
  const params = useParams<{ slug: string }>();
  const category = DOA_CATEGORIES.find((c) => c.slug === params.slug);
  const [doas, setDoas] = useState<DoaApi[] | null>(null);
  const [loadedSlug, setLoadedSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!category) return;
    fetchDoasByCategory(category.slug, true)
      .then((results) => {
        if (cancelled) return;
        setDoas(results);
        setLoadedSlug(category.slug);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Gagal memuat daftar doa. Coba lagi nanti.");
      });
    return () => {
      cancelled = true;
    };
  }, [category, attempt]);

  if (!category) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pb-10 pt-6 text-center sm:max-w-lg">
        <p className="py-10 text-sm text-emerald-100/70">
          Kategori doa tidak ditemukan.
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

  const doaList = doas ?? [];
  const visibleDoas = loadedSlug === category.slug ? doas : null;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/doa"
          aria-label="Kembali ke kategori doa"
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
          <h1 className="text-base font-bold">{category.name}</h1>
          <p className="text-[11px] text-emerald-200/70">
            {category.description} · {doaList.length} doa
          </p>
        </div>
      </header>

      {error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 px-5 py-10 text-center ring-1 ring-white/15">
          <p className="text-sm text-emerald-100/80">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setAttempt((a) => a + 1);
            }}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
          >
            Coba lagi
          </button>
        </div>
      ) : visibleDoas === null ? (
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
      ) : doaList.length === 0 ? (
        <DoaEmptyState
          message={`Belum ada doa pada kategori ${category.name}.`}
          actionHref="/doa"
          actionLabel="Pilih Kategori Lain"
        />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {doaList.map((doa) => (
              <li key={doa.id}>
                <Link
                  href={`/doa/${category.slug}/${doa.id}`}
                  className="block rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15"
                >
                  <h2 className="text-center text-sm font-bold text-emerald-100">
                    {doa.title}
                  </h2>
                  <p
                    dir="rtl"
                    lang="ar"
                    className="font-quran mt-3 text-xl leading-[2.1] text-white [text-align:center] [overflow-wrap:anywhere]"
                  >
                    {doa.arabicText}
                  </p>
                  <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-emerald-100/80">
                    {doa.translation}
                  </p>
                  <span className="mt-3 flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-300">
                    Baca doa &amp; artinya
                    <svg
                      className="h-3.5 w-3.5"
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
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <nav
            className="flex items-center justify-between gap-3"
            aria-label="Navigasi kategori doa"
          >
            {(() => {
              const index = DOA_CATEGORIES.findIndex((c) => c.slug === category.slug);
              const prev = index > 0 ? DOA_CATEGORIES[index - 1] : null;
              const next =
                index < DOA_CATEGORIES.length - 1
                  ? DOA_CATEGORIES[index + 1]
                  : null;
              return (
                <>
                  {prev ? (
                    <Link
                      href={`/doa/${prev.slug}`}
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
                      <span className="truncate">{prev.name}</span>
                    </Link>
                  ) : (
                    <span className="px-4 py-2.5 text-xs text-emerald-100/40">
                      Kategori pertama
                    </span>
                  )}
                  {next ? (
                    <Link
                      href={`/doa/${next.slug}`}
                      className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
                    >
                      <span className="truncate">{next.name}</span>
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
                      Kategori terakhir
                    </span>
                  )}
                </>
              );
            })()}
          </nav>
        </>
      )}
    </main>
  );
}
