"use client";

import Link from "next/link";
import { useState } from "react";
import DoaEmptyState from "@/components/doa/doa-empty-state";
import { DOA_CATEGORIES, MOCK_DOAS } from "@/data/doas";

export default function DoaQuickCategories() {
  const [selectedSlug, setSelectedSlug] = useState(DOA_CATEGORIES[0].slug);
  const selectedCategory = DOA_CATEGORIES.find((c) => c.slug === selectedSlug);
  const doas = MOCK_DOAS.filter((d) => d.category === selectedSlug);

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke jadwal sholat"
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
          <h1 className="text-base font-bold">Doa Cepat</h1>
          <p className="text-[11px] text-emerald-200/70">
            Pilih kategori, baca doa langsung
          </p>
        </div>
      </header>

      <div
        className="-mx-4 overflow-x-auto px-4 pb-1"
        role="tablist"
        aria-label="Pilih kategori doa"
      >
        <div className="flex gap-1.5">
          {DOA_CATEGORIES.map((category) => {
            const count = MOCK_DOAS.filter((d) => d.category === category.slug).length;
            const active = category.slug === selectedSlug;
            return (
              <button
                key={category.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedSlug(category.slug)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "bg-emerald-400 text-emerald-950"
                    : "bg-white/10 text-emerald-100 hover:bg-white/20"
                }`}
              >
                {category.name} Â· {count}
              </button>
            );
          })}
        </div>
      </div>

      {selectedCategory && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-emerald-100">
            {selectedCategory.name}
          </h2>
          <Link
            href={`/doa/${selectedCategory.slug}`}
            className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Lihat lengkap â†’
          </Link>
        </div>
      )}

      {doas.length === 0 ? (
        <DoaEmptyState
          message={`Belum ada doa pada kategori ${selectedCategory?.name ?? "ini"}.`}
          actionHref="/doa"
          actionLabel="Jelajahi Doa Harian"
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {doas.map((doa) => (
            <li key={doa.id} className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
              <h3 className="text-center text-sm font-bold text-emerald-100">
                {doa.title}
              </h3>
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
            </li>
          ))}
        </ul>
      )}

      <p className="text-center text-[11px] text-emerald-200/50">
        Semua kategori &amp; doa tersedia di{" "}
        <Link href="/doa" className="font-semibold text-emerald-200 underline underline-offset-2">
          Doa Harian
        </Link>
      </p>
    </main>
  );
}
