"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import ContinueReading from "@/components/quran/continue-reading";
import type { Surah } from "@/data/quran/surahs";

export default function SurahList({ surahs }: { surahs: Surah[] }) {
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.toLowerCase().trim();

  const filtered = surahs.filter((s) => {
    if (selectedJuz !== null && s.juz !== selectedJuz) return false;
    if (!normalizedQuery) return true;
    return (
      s.name.toLowerCase().includes(normalizedQuery) ||
      s.meaning.toLowerCase().includes(normalizedQuery) ||
      s.arabicName.includes(deferredQuery.trim())
    );
  });

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
          <h1 className="text-base font-bold">Al-Qur&apos;an</h1>
          <p className="text-[11px] text-emerald-200/70">Daftar 114 surah</p>
        </div>
      </header>

      <ContinueReading />

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-100/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari surah / arti…"
          className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Pilih juz">
        <div className="flex gap-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={selectedJuz === null}
            onClick={() => setSelectedJuz(null)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedJuz === null
                ? "bg-emerald-400 text-emerald-950"
                : "bg-white/10 text-emerald-100 hover:bg-white/20"
            }`}
          >
            Semua
          </button>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
            <button
              key={juz}
              type="button"
              role="tab"
              aria-selected={selectedJuz === juz}
              onClick={() => setSelectedJuz(juz)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedJuz === juz
                  ? "bg-emerald-400 text-emerald-950"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              Juz {juz}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-emerald-100/60">
          Tidak ada surah yang cocok.
        </p>
      ) : (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
          {filtered.map((surah) => (
            <li key={surah.number}>
              <Link
                href={`/quran/${surah.number}`}
                className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-sm font-bold text-emerald-200 ring-1 ring-emerald-300/30">
                  {surah.number}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {surah.name}
                  </span>
                  <span className="block truncate text-xs text-emerald-100/60">
                    {surah.meaning} · {surah.ayahs} ayat
                  </span>
                </span>
                <span
                  dir="rtl"
                  className="font-quran text-xl text-emerald-100/90"
                >
                  {surah.arabicName}
                </span>
                <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-emerald-100/80">
                  Juz {surah.juz}
                </span>
                <svg
                  className="h-4 w-4 shrink-0 text-emerald-100/40"
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
