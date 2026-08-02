"use client";

import { useEffect } from "react";
import type { Zikr } from "@/data/zikrs";

interface ZikrMeaningModalProps {
  zikr: Zikr | null;
  onClose: () => void;
  onSetTarget?: (zikr: Zikr) => void;
}

export default function ZikrMeaningModal({
  zikr,
  onClose,
  onSetTarget,
}: ZikrMeaningModalProps) {
  useEffect(() => {
    if (!zikr) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zikr, onClose]);

  if (!zikr) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Makna ${zikr.name}`}
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 pb-8 text-emerald-950 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-emerald-200 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">{zikr.name}</h2>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-800">
              {zikr.category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            aria-label="Tutup"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p
          dir="rtl"
          lang="ar"
          className="font-quran mt-4 rounded-2xl bg-emerald-50 px-4 py-5 text-center text-2xl leading-[2] text-emerald-950"
        >
          {zikr.arabicText}
        </p>

        <div className="mt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
            Arti
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-emerald-900">
            {zikr.meaning}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
            Makna &amp; Keutamaan
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-emerald-900">
            {zikr.explanation}
          </p>
        </div>

        {onSetTarget && (
          <button
            type="button"
            onClick={() => onSetTarget(zikr)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path strokeLinecap="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Atur Target Harian
          </button>
        )}
      </div>
    </div>
  );
}
