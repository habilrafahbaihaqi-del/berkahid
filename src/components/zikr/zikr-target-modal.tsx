"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Zikr } from "@/data/zikrs";

const PRESET_TARGETS = [3, 10, 33, 100, 1000];

interface ZikrTargetModalProps {
  zikr: Zikr | null;
  onClose: () => void;
  onConfirm: (targetCount: number) => void;
}

export default function ZikrTargetModal({
  zikr,
  onClose,
  onConfirm,
}: ZikrTargetModalProps) {
  const [target, setTarget] = useState(33);
  const [added, setAdded] = useState(false);
  const [targetZikrId, setTargetZikrId] = useState<string | null>(null);

  if (zikr && zikr.id !== targetZikrId) {
    setTargetZikrId(zikr.id);
    setTarget(33);
    setAdded(false);
  }

  useEffect(() => {
    if (!zikr) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [zikr, onClose]);

  if (!zikr) return null;

  const commit = (value: number) => {
    const clamped = Math.max(1, Math.min(100000, Math.floor(value)));
    setTarget(clamped);
    onConfirm(clamped);
    setAdded(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Atur target ${zikr.name}`}
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 text-emerald-950 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-emerald-200 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold">Atur Target Harian</h2>
            <p className="mt-0.5 text-xs text-emerald-900/60">{zikr.name}</p>
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
          className="font-quran mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-center text-lg leading-[1.9] text-emerald-950"
        >
          {zikr.arabicText}
        </p>

        <div className="mt-4 grid grid-cols-5 gap-2">
          {PRESET_TARGETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setTarget(preset)}
              aria-pressed={target === preset}
              className={`rounded-2xl px-2 py-2.5 text-sm font-bold transition-colors ${
                target === preset
                  ? "bg-emerald-700 text-white"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {preset.toLocaleString("id-ID")}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setTarget((t) => Math.max(1, t - 1))}
            aria-label="Kurangi target"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 transition-colors hover:bg-emerald-200"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path strokeLinecap="round" d="M5 12h14" />
            </svg>
          </button>
          <input
            type="number"
            min={1}
            max={100000}
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            className="w-24 rounded-2xl border border-emerald-200 bg-emerald-50/50 py-2.5 text-center text-lg font-bold tabular-nums outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            aria-label="Jumlah target"
          />
          <button
            type="button"
            onClick={() => setTarget((t) => Math.min(100000, t + 1))}
            aria-label="Tambah target"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 transition-colors hover:bg-emerald-200"
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

        <button
          type="button"
          onClick={() => commit(target)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Tambahkan ke Antrian Hari Ini
        </button>

        <p className="mt-3 text-center text-[11px] text-emerald-900/40">
          Zikir yang sama akan diperbarui targetnya jika sudah ada di antrian.
        </p>

        {added && (
          <div className="mt-4 rounded-2xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <p className="flex items-center justify-center gap-1.5 text-center text-sm font-bold text-emerald-800">
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
              Berhasil ditambahkan ke antrian
            </p>
            <p className="mt-1 text-center text-[11px] text-emerald-900/60">
              {zikr.name} · target {target.toLocaleString("id-ID")} kali hari ini
            </p>
            <Link
              href="/zikir/antrian"
              onClick={onClose}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-emerald-800"
            >
              Lihat Antrian Hari Ini
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
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
