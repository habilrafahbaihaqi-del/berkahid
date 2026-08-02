"use client";

import type { Zikr } from "@/data/zikrs";

export default function ZikrCard({
  zikr,
  onViewMeaning,
  onAddToQueue,
}: {
  zikr: Zikr;
  onViewMeaning: () => void;
  onAddToQueue: () => void;
}) {
  return (
    <li className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
      <p
        dir="rtl"
        lang="ar"
        className="font-quran text-xl leading-[2] text-white [text-align:center]"
      >
        {zikr.arabicText}
      </p>
      <h2 className="mt-2 text-center text-sm font-bold text-emerald-100">
        {zikr.name}
      </h2>
      <p className="mt-1.5 text-center text-xs text-emerald-100/70">
        {zikr.meaning}
      </p>
      <span className="mx-auto mt-3 block w-fit rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-100/70">
        {zikr.category}
      </span>
      <div className="mt-3 flex justify-center gap-2">
        <button
          type="button"
          onClick={onViewMeaning}
          className="flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3.5 py-1.5 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-300/30 transition-colors hover:bg-emerald-400/25"
        >
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
              d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
            />
          </svg>
          Lihat Makna &amp; Keutamaan
        </button>
        <button
          type="button"
          onClick={onAddToQueue}
          className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-emerald-400"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Antrian
        </button>
      </div>
    </li>
  );
}
