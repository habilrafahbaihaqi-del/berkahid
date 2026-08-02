"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import ZikrCard from "@/components/zikr/zikr-card";
import ZikrMeaningModal from "@/components/zikr/zikr-meaning-modal";
import ZikrTargetModal from "@/components/zikr/zikr-target-modal";
import { type Zikr, ZIKR_CATEGORIES } from "@/data/zikrs";
import { searchZikrs } from "@/lib/zikr-api";
import { addToQueueWithTarget, useZikrQueue } from "@/lib/zikr-queue-store";

export default function ZikrCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [meaningZikr, setMeaningZikr] = useState<Zikr | null>(null);
  const [targetZikr, setTargetZikr] = useState<Zikr | null>(null);
  const [zikrs, setZikrs] = useState<Zikr[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const requestIdRef = useRef(0);
  const deferredQuery = useDeferredValue(query);
  const queue = useZikrQueue();

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    searchZikrs(deferredQuery, selectedCategory)
      .then((results) => {
        if (requestIdRef.current !== requestId) return;
        setZikrs(results);
        setError(null);
      })
      .catch(() => {
        if (requestIdRef.current !== requestId) return;
        setError("Gagal memuat daftar zikir. Coba lagi nanti.");
      });
    return () => {
      requestIdRef.current += 1;
    };
  }, [deferredQuery, selectedCategory, attempt]);

  const filtered = zikrs ?? [];

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/zikir"
          aria-label="Kembali ke zikir harian"
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
          <h1 className="text-base font-bold">Katalog Zikir</h1>
          <p className="text-[11px] text-emerald-200/70">
            Zikir pilihan beserta arti dan keutamaannya
          </p>
        </div>
        <Link
          href="/zikir/antrian"
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-2 text-[11px] font-bold text-emerald-200 ring-1 ring-emerald-300/30 transition-colors hover:bg-emerald-400/25"
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
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          Antrian Hari Ini
          {queue.items.length > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
              {queue.items.length}
            </span>
          )}
        </Link>
      </header>

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
          placeholder="Cari zikir / arti…"
          className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Pilih kategori">
        <div className="flex gap-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === null
                ? "bg-emerald-400 text-emerald-950"
                : "bg-white/10 text-emerald-100 hover:bg-white/20"
            }`}
          >
            Semua
          </button>
          {ZIKR_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === category
                  ? "bg-emerald-400 text-emerald-950"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 px-5 py-10 text-center ring-1 ring-white/15">
          <p className="text-sm text-emerald-100/80">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              setAttempt((a) => a + 1);
            }}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
          >
            Coba lagi
          </button>
        </div>
      ) : zikrs === null ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <svg
            className="h-6 w-6 animate-spin text-emerald-200"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
            />
          </svg>
          <p className="text-sm text-emerald-100/70">Memuat zikir…</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-emerald-100/60">
          Tidak ada zikir yang cocok.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          <li className="px-1 text-[11px] text-emerald-200/50">
            Menampilkan {filtered.length} zikir
            {selectedCategory && ` di kategori ${selectedCategory}`}
            {deferredQuery.trim() && ` untuk “${deferredQuery.trim()}”`}
          </li>
          {filtered.map((zikr) => (
            <ZikrCard
              key={zikr.id}
              zikr={zikr}
              onViewMeaning={() => setMeaningZikr(zikr)}
              onAddToQueue={() => setTargetZikr(zikr)}
            />
          ))}
        </ul>
      )}

      <ZikrMeaningModal
        zikr={meaningZikr}
        onClose={() => setMeaningZikr(null)}
        onSetTarget={(zikr) => {
          setMeaningZikr(null);
          setTargetZikr(zikr);
        }}
      />
      <ZikrTargetModal
        zikr={targetZikr}
        onClose={() => setTargetZikr(null)}
        onConfirm={(targetCount) => {
          if (targetZikr) addToQueueWithTarget(targetZikr.id, targetCount);
        }}
      />
    </main>
  );
}
