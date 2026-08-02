"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Zikr } from "@/data/zikrs";
import { fetchZikrs } from "@/lib/zikr-api";
import { useZikrQueue } from "@/lib/zikr-queue-store";

export default function ZikrHome() {
  const queue = useZikrQueue();
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
  const overallPercent =
    totalTarget > 0 ? Math.min(100, (totalCurrent / totalTarget) * 100) : 0;

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke beranda"
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
          <h1 className="text-base font-bold">Zikir Harian</h1>
          <p className="text-[11px] text-emerald-200/70">
            Atur target, amalkan, dan pantau hari ini
          </p>
        </div>
      </header>

      <Link
        href="/zikir/antrian"
        className="rounded-3xl bg-emerald-400/15 p-5 ring-1 ring-emerald-300/30 transition-colors hover:bg-emerald-400/20"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-100">
            {items.length === 0
              ? "Belum ada antrian hari ini"
              : `${completed} dari ${items.length} zikir selesai`}
          </span>
          <span className="tabular-nums text-emerald-200/70">
            {totalCurrent}/{totalTarget} amalan
          </span>
        </div>
        <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-emerald-200">
          Buka Antrian Hari Ini
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </span>
      </Link>

      <section>
        <h2 className="text-sm font-bold text-emerald-100">Menu</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/zikir/katalog"
            className="flex flex-col gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
              <svg
                className="h-5.5 w-5.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V13.5Zm0 2.25h.008v.008H8.25v-.008Zm0 2.25h.008v.008H8.25V18Zm2.498-6.75h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V13.5Zm0 2.25h.007v.008h-.007v-.008Zm0 2.25h.007v.008h-.007V18Zm2.504-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5Zm0 2.25h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V18Zm2.498-6.75h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V13.5ZM8.25 6h7.5v2.25h-7.5V6ZM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 0 0 2.25 2.25h10.5a2.25 2.25 0 0 0 2.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0 0 12 2.25Z"
                />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-bold text-white">
                Katalog Zikir
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-emerald-100/60">
                Jelajahi zikir, makna &amp; keutamaannya
              </span>
            </span>
          </Link>
          <Link
            href="/zikir/antrian"
            className="flex flex-col gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
              {items.length > 0 ? (
                <span className="text-sm font-bold tabular-nums">
                  {completed}/{items.length}
                </span>
              ) : (
                <svg
                  className="h-5.5 w-5.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              )}
            </span>
            <span>
              <span className="block text-sm font-bold text-white">
                Antrian Hari Ini
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-emerald-100/60">
                Centang zikir yang sudah diamalkan
              </span>
            </span>
          </Link>
        </div>
      </section>

      <section className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
        <h2 className="text-sm font-bold text-emerald-100">Cara Menggunakan</h2>
        <ol className="mt-3 flex flex-col gap-2.5 text-xs leading-relaxed text-emerald-100/70">
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              1
            </span>
            Pilih zikir dari katalog, atur target harian.
          </li>
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              2
            </span>
            Zikir masuk ke antrian hari ini secara otomatis.
          </li>
          <li className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
              3
            </span>
            Amalkan, lalu tambah hitungan hingga target tercapai.
          </li>
        </ol>
      </section>
    </main>
  );
}
