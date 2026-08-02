"use client";

import type { Zikr } from "@/data/zikrs";
import {
  decrementQueueItem,
  incrementQueueItem,
  setQueueTarget,
  type QueueItem,
} from "@/lib/zikr-queue-store";

function formatArabicNumber(number: number) {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return number
    .toString()
    .split("")
    .map((d) => digits[Number(d)])
    .join("");
}

export default function ZikrQueueItem({
  zikrId,
  zikr,
  targetCount,
  currentCount,
  onViewMeaning,
}: QueueItem & { zikr: Zikr; onViewMeaning: () => void }) {
  const done = currentCount >= targetCount;
  const percent = Math.min(100, (currentCount / targetCount) * 100);

  return (
    <li
      className={`rounded-3xl p-4 ring-1 transition-colors ${
        done
          ? "bg-emerald-400/15 ring-emerald-300/50"
          : "bg-white/10 ring-white/15"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition-colors ${
            done
              ? "border-emerald-300 bg-emerald-400 text-emerald-950"
              : "border-white/25 bg-white/5 text-emerald-100/70"
          }`}
        >
          {done ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            formatArabicNumber(currentCount)
          )}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="truncate text-sm font-bold text-white">
              {zikr.name}
              <button
                type="button"
                onClick={onViewMeaning}
                aria-label={`Lihat makna ${zikr.name}`}
                className="ml-1.5 inline-flex align-middle text-emerald-200/60 transition-colors hover:text-emerald-200"
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
                    d="M11.25 11.25l.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </button>
              {done && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-400 px-2 py-0.5 align-middle text-[9px] font-bold uppercase tracking-wide text-emerald-950">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                  Selesai
                </span>
              )}
            </h2>
            <span
              className={`shrink-0 text-xs font-semibold tabular-nums ${
                done ? "text-emerald-200" : "text-emerald-100/80"
              }`}
            >
              {currentCount}/{targetCount}
            </span>
          </div>
          <p
            dir="rtl"
            lang="ar"
            className="font-quran mt-0.5 truncate text-sm text-emerald-100/80"
          >
            {zikr.arabicText}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full transition-all ${
                  done ? "bg-emerald-300" : "bg-emerald-400"
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <label className="flex items-center gap-1 text-[10px] text-emerald-200/60">
              Target
              <input
                type="number"
                min={1}
                value={targetCount}
                onChange={(e) => setQueueTarget(zikrId, Number(e.target.value))}
                className="w-14 rounded-lg border border-white/15 bg-white/10 px-1.5 py-0.5 text-center text-[11px] tabular-nums text-white outline-none focus:border-emerald-300"
                aria-label={`Target ${zikr.name}`}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => decrementQueueItem(zikrId)}
          disabled={currentCount === 0}
          aria-label={`Kurangi ${zikr.name}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition-colors hover:bg-white/20 disabled:opacity-40"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path strokeLinecap="round" d="M5 12h14" />
          </svg>
        </button>
        <span className="text-[10px] text-emerald-200/50">
          {done ? "Alhamdulillah, target tercapai" : "Amalkan lalu tambah"}
        </span>
        <button
          type="button"
          onClick={() => incrementQueueItem(zikrId)}
          disabled={done}
          aria-label={`Tambah ${zikr.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 transition-colors hover:bg-emerald-400 disabled:opacity-40"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </li>
  );
}
