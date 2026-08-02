"use client";

import Link from "next/link";
import { SURAHS } from "@/data/quran/surahs";
import { useQuranProgress } from "@/lib/quran-progress-store";

export default function ContinueReading() {
  const progress = useQuranProgress();
  if (!progress) return null;

  const surah = SURAHS.find((s) => s.number === progress.surah);
  if (!surah) return null;

  return (
    <Link
      href={`/quran/${surah.number}#ayah-${progress.ayah}`}
      className="flex items-center gap-3 rounded-3xl bg-emerald-400/15 p-4 ring-1 ring-emerald-300/30 transition-colors hover:bg-emerald-400/20"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-emerald-950">
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
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white">
          Lanjutkan Bacaan
        </span>
        <span className="block truncate text-xs text-emerald-100/70">
          {surah.name} — Ayat {progress.ayah}
        </span>
      </span>
      <svg
        className="h-4 w-4 shrink-0 text-emerald-100/60"
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
  );
}
