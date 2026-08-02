"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDoaCategories, type DoaCategoryApi } from "@/lib/doa-api";

export default function DoaCategories() {
  const [categories, setCategories] = useState<DoaCategoryApi[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchDoaCategories(true)
      .then((results) => {
        if (cancelled) return;
        setCategories(results);
        setError(null);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Gagal memuat kategori doa. Coba lagi nanti.");
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke beranda"
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
          <h1 className="text-base font-bold">Doa Harian</h1>
          <p className="text-[11px] text-emerald-200/70">
            Pilih kategori doa sesuai kebutuhanmu
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
      ) : categories === null ? (
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
          <p className="text-sm text-emerald-100/70">Memuat kategori…</p>
        </div>
      ) : categories.length === 0 ? (
        <p className="py-10 text-center text-sm text-emerald-100/60">
          Belum ada kategori doa.
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/doa/${category.slug}`}
                className="flex h-full flex-col gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                    />
                  </svg>
                </span>
                <span>
                  <span className="block text-sm font-bold text-white">
                    {category.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed text-emerald-100/60">
                    {category.description}
                  </span>
                </span>
                <span className="mt-auto inline-flex w-fit items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-100/70">
                  {category.count} doa
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
