"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ZikrMeaningModal from "@/components/zikr/zikr-meaning-modal";
import ZikrQueueItem from "@/components/zikr/zikr-queue-item";
import type { Zikr } from "@/data/zikrs";
import { fetchZikrs } from "@/lib/zikr-api";
import {
  clearQueue,
  seedDefaultQueue,
  useZikrQueue,
} from "@/lib/zikr-queue-store";

export default function ZikrQueuePage() {
  const queue = useZikrQueue();
  const [meaningZikr, setMeaningZikr] = useState<Zikr | null>(null);
  const [zikrMap, setZikrMap] = useState<Record<string, Zikr>>({});

  useEffect(() => {
    let cancelled = false;
    fetchZikrs()
      .then((zikrs) => {
        if (cancelled) return;
        setZikrMap(Object.fromEntries(zikrs.map((z) => [z.id, z])));
      })
      .catch(() => {
        // gagal memuat katalog — antrian tetap tampil tanpa detail
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const items = queue.items.flatMap((item) => {
    const zikr = zikrMap[item.zikrId];
    return zikr ? [{ ...item, zikr }] : [];
  });

  const totalTarget = items.reduce((sum, i) => sum + i.targetCount, 0);
  const totalCurrent = items.reduce((sum, i) => sum + i.currentCount, 0);
  const completed = items.filter((i) => i.currentCount >= i.targetCount).length;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/zikir"
          aria-label="Kembali ke katalog zikir"
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
          <h1 className="text-base font-bold">Antrian Zikir Hari Ini</h1>
          <p className="text-[11px] text-emerald-200/70">
            {new Intl.DateTimeFormat("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
        </div>
      </header>

      {items.length > 0 && (
        <section className="rounded-3xl bg-white/10 p-4 ring-1 ring-white/15">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-100">
              {completed} dari {items.length} zikir selesai
            </span>
            <span className="tabular-nums text-emerald-200/70">
              {totalCurrent}/{totalTarget} amalan
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{
                width: `${totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0}%`,
              }}
            />
          </div>
        </section>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/10 px-6 py-12 text-center ring-1 ring-white/15">
          <svg
            className="h-10 w-10 text-emerald-200/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <div>
            <h2 className="text-sm font-bold text-white">
              Antrian masih kosong
            </h2>
            <p className="mt-1 text-xs text-emerald-100/70">
              Pilih zikir dari katalog untuk membentuk antrian harianmu.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/zikir/katalog"
              className="rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-400"
            >
              Pilih dari Katalog
            </Link>
            <button
              type="button"
              onClick={seedDefaultQueue}
              className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              Muat contoh antrian
            </button>
          </div>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <ZikrQueueItem
              key={item.zikrId}
              {...item}
              onViewMeaning={() => setMeaningZikr(item.zikr)}
            />
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="flex justify-center gap-3">
          <Link
            href="/zikir/katalog"
            className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            + Tambah Zikir
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Kosongkan seluruh antrian hari ini?")) {
                clearQueue();
              }
            }}
            className="rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-emerald-100/60 transition-colors hover:bg-white/10"
          >
            Kosongkan
          </button>
        </div>
      )}

      <ZikrMeaningModal
        zikr={meaningZikr}
        onClose={() => setMeaningZikr(null)}
      />
    </main>
  );
}
