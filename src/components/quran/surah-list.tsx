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
      <header className="relative mb-2 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-8 ring-1 ring-gray-200">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-teal-500/10 blur-2xl" />
        <div className="relative z-10 flex flex-col gap-1">
          <h1 className="text-2xl font-extrabold text-gray-900">Al-Qur&apos;an</h1>
          <p className="max-w-[200px] text-[13px] leading-relaxed text-gray-600">
            Bacalah, pahami, dan amalkan firman Allah setiap hari.
          </p>
        </div>
      </header>

      <ContinueReading />

      <div className="relative mt-2">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
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
          className="w-full rounded-full border-0 bg-white py-3.5 pl-11 pr-4 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#1db584] outline-none"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-hide" role="tablist" aria-label="Pilih juz">
        <div className="flex gap-2">
          <button
            type="button"
            role="tab"
            aria-selected={selectedJuz === null}
            onClick={() => setSelectedJuz(null)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
              selectedJuz === null
                ? "bg-[#188965] text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
                selectedJuz === juz
                  ? "bg-[#188965] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Juz {juz}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">
          Tidak ada surah yang cocok.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((surah) => (
            <li key={surah.number}>
              <Link
                href={`/quran/${surah.number}`}
                className="flex items-center gap-4 rounded-3xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e5f5f0] text-sm font-bold text-[#1db584]">
                  {surah.number}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-bold text-gray-900">
                    {surah.name}
                  </span>
                  <span className="block truncate text-xs text-gray-500">
                    {surah.meaning} · {surah.ayahs} ayat
                  </span>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    dir="rtl"
                    className="font-quran text-2xl text-[#188965]"
                  >
                    {surah.arabicName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                      Juz {surah.juz}
                    </span>
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9 5 7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
