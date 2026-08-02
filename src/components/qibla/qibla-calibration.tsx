"use client";

import { useEffect } from "react";

export default function QiblaCalibration({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Kalibrasi kompas"
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
            <h2 className="text-base font-bold">Kalibrasi Kompas</h2>
            <p className="mt-0.5 text-xs text-emerald-900/60">
              Ikuti gerakan agar sensor akurat
            </p>
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

        <div className="mt-5 rounded-2xl bg-emerald-50 p-5">
          <svg
            viewBox="0 0 200 160"
            className="mx-auto h-40 w-auto"
            role="img"
            aria-label="Animasi gerakan angka delapan"
          >
            <path
              d="M60 130 C 20 130, 20 30, 60 30 C 100 30, 100 130, 140 130 C 180 130, 180 30, 140 30"
              fill="none"
              stroke="#34d399"
              strokeWidth="6"
              strokeLinecap="round"
              className="animate-pulse"
            />
            <circle r="8" fill="#059669">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path="M60 130 C 20 130, 20 30, 60 30 C 100 30, 100 130, 140 130 C 180 130, 180 30, 140 30"
              />
            </circle>
          </svg>
          <p className="mt-3 text-center text-xs font-semibold text-emerald-800">
            Gerakkan perangkat membentuk angka 8 selama beberapa detik
          </p>
        </div>

        <ol className="mt-5 flex flex-col gap-3">
          <li className="flex gap-3 rounded-2xl bg-emerald-50 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              1
            </span>
            <span className="text-xs leading-relaxed text-emerald-900">
              Jauhkan perangkat dari benda logam, magnet, dan casing bermagnet.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl bg-emerald-50 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              2
            </span>
            <span className="text-xs leading-relaxed text-emerald-900">
              Gerakkan perangkat mengikuti pola angka 8 seperti animasi di atas.
            </span>
          </li>
          <li className="flex gap-3 rounded-2xl bg-emerald-50 p-3.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              3
            </span>
            <span className="text-xs leading-relaxed text-emerald-900">
              Pegang perangkat datar, lalu arahkan sesuai jarum kiblat.
            </span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onDone}
          className="mt-6 w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          Selesai Kalibrasi
        </button>
      </div>
    </div>
  );
}
