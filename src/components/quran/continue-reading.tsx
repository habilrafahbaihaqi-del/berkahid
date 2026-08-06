"use client";

import Link from "next/link";
import { SURAHS } from "@/data/quran/surahs";
import { useQuranProgress } from "@/lib/quran-progress-store";

export default function ContinueReading() {
  const progress = useQuranProgress();
  if (!progress) return null;

  const surah = SURAHS.find((s) => s.number === progress.surah);
  if (!surah) return null;

  const percentage = Math.round((progress.ayah / surah.ayahs) * 100);

  return (
    <Link
      href={`/quran/${surah.number}#ayah-${progress.ayah}`}
      className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1db584] text-white shadow-sm">
        <svg
          className="h-6 w-6 translate-x-[1px]"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-gray-900">
          Lanjutkan Bacaan
        </span>
        <span className="mt-0.5 block truncate text-[13px] text-gray-500">
          {surah.name} — Ayat {progress.ayah}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <div className="flex w-24 items-center justify-between text-[11px] font-medium text-gray-500">
          <span>{progress.ayah} / {surah.ayahs} Ayat</span>
          <span>{percentage}%</span>
        </div>
        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-[#1db584]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <svg
        className="ml-1 h-5 w-5 shrink-0 text-gray-400"
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
    </Link>
  );
}
