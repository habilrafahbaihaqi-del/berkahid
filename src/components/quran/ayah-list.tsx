"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getMockTafsir } from "@/data/quran/mock-tafsir";
import { saveQuranProgress } from "@/lib/quran-progress-store";

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string;
  translation: string;
}

interface AyahListProps {
  surahNumber: number;
  surahName: string;
  prevSurah: number | null;
  nextSurah: number | null;
}

function formatArabicNumber(number: number) {
  const digits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return number
    .toString()
    .split("")
    .map((d) => digits[Number(d)])
    .join("");
}

function AyahCard({
  ayah,
  surahNumber,
}: {
  ayah: Ayah;
  surahNumber: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const tafsir = getMockTafsir(surahNumber, ayah.numberInSurah);

  return (
    <li
      id={`ayah-${ayah.numberInSurah}`}
      className="scroll-mt-20 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"
    >
      <p
        dir="rtl"
        lang="ar"
        className="font-quran text-2xl leading-[2.2] text-white [text-align:justify]"
      >
        {ayah.text}
        <span className="mx-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/10 align-middle text-base font-bold text-emerald-200">
          {formatArabicNumber(ayah.numberInSurah)}
        </span>
      </p>
      <p className="mt-3 border-t border-white/10 pt-3 text-sm leading-relaxed text-emerald-100/80">
        {ayah.translation}
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
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
          {expanded ? "Sembunyikan Tafsir" : "Lihat Tafsir"}
        </button>
      </div>
      {expanded && (
        <div className="mt-2 rounded-2xl bg-emerald-400/10 p-4 ring-1 ring-emerald-300/20">
          {tafsir ? (
            <>
              <p className="text-sm leading-relaxed text-emerald-50">{tafsir}</p>
              <p className="mt-2 text-[10px] text-emerald-200/50">
                Tafsir ringkas · data tiruan untuk pengembangan
              </p>
            </>
          ) : (
            <p className="text-xs text-emerald-100/70">
              Tafsir ayat ini akan tersedia setelah integrasi data tafsir.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

interface QuranApiAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  text: string;
}

interface QuranApiEdition {
  edition: { identifier: string };
  ayahs: QuranApiAyah[];
}

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  savedAt: number;
  ayahs: Ayah[];
}

export default function AyahList({
  surahNumber,
  surahName,
  prevSurah,
  nextSurah,
}: AyahListProps) {
  const [ayahs, setAyahs] = useState<Ayah[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fromCache, setFromCache] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [currentAyah, setCurrentAyah] = useState(1);
  const requestIdRef = useRef(0);
  const lastSavedAyahRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ayahs || ayahs.length === 0) return;
    lastSavedAyahRef.current = null;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const num = Number(entry.target.id.replace("ayah-", ""));
            if (Number.isFinite(num)) {
              setCurrentAyah(num);
              if (lastSavedAyahRef.current !== num) {
                lastSavedAyahRef.current = num;
                saveQuranProgress(surahNumber, num);
              }
            }
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    for (const ayah of ayahs) {
      const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [ayahs, surahNumber]);

  useEffect(() => {
    const requestId = ++requestIdRef.current;

    async function load() {
      const cacheKey = `berkahid:quran:${surahNumber}`;
      let cached: CacheEntry | null = null;
      try {
        const raw = window.localStorage.getItem(cacheKey);
        if (raw) {
          cached = JSON.parse(raw) as CacheEntry;
          if (Array.isArray(cached.ayahs) && cached.ayahs.length > 0) {
            setAyahs(cached.ayahs);
            setFromCache(true);
          }
        }
      } catch {
        cached = null;
      }

      try {
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,id.indonesian`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const payload = (await response.json()) as {
          data?: QuranApiEdition[];
        };
        const editions = payload.data ?? [];
        const arabic = editions.find((e) =>
          e.edition.identifier.startsWith("quran-uthmani"),
        );
        const indonesian = editions.find((e) =>
          e.edition.identifier.startsWith("id.indonesian"),
        );
        if (!arabic || !indonesian) throw new Error("Edition tidak ditemukan");

        const merged: Ayah[] = arabic.ayahs.map((ayah) => {
          const translation =
            indonesian.ayahs.find((t) => t.numberInSurah === ayah.numberInSurah)
              ?.text ?? "";
          return {
            number: ayah.number,
            numberInSurah: ayah.numberInSurah,
            juz: ayah.juz,
            text: ayah.text,
            translation,
          };
        });

        if (requestIdRef.current !== requestId) return;

        setAyahs(merged);
        setFromCache(false);
        setError(null);
        try {
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ savedAt: Date.now(), ayahs: merged } satisfies CacheEntry),
          );
        } catch {
          // localStorage penuh — abaikan
        }
      } catch {
        if (requestIdRef.current !== requestId) return;
        if (!cached || cached.savedAt + CACHE_TTL_MS < Date.now()) {
          setError("Gagal memuat ayat. Periksa koneksi lalu coba lagi.");
        }
      }
    }

    load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [surahNumber, attempt]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white/10 px-5 py-10 text-center ring-1 ring-white/15">
        <p className="text-sm text-emerald-100/80">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAyahs(null);
            setFromCache(false);
            setAttempt((a) => a + 1);
          }}
          className="rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  if (!ayahs) {
    return (
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
        <p className="text-sm text-emerald-100/70">Memuat ayat…</p>
      </div>
    );
  }

  const scrollToAyah = (numberInSurah: number) => {
    document
      .getElementById(`ayah-${numberInSurah}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lastAyah = ayahs.length;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-col items-center gap-2 rounded-3xl bg-white/10 px-5 py-7 backdrop-blur-sm ring-1 ring-white/20">
        <span dir="rtl" className="font-quran text-3xl text-emerald-100">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
        <span className="text-[11px] text-emerald-200/60">Basmalah</span>
      </div>

      {ayahs.length > 1 && (
        <div className="sticky top-2 z-10 flex items-center gap-2 rounded-2xl bg-emerald-900/80 px-4 py-2.5 shadow-lg backdrop-blur-md ring-1 ring-white/15">
          <span className="truncate text-xs font-semibold text-white">
            {surahName} · {ayahs.length} ayat
          </span>
          <div className="relative ml-auto shrink-0">
            <select
              aria-label="Lompat ke ayat"
              defaultValue=""
              onChange={(e) => {
                const target = document.getElementById(
                  `ayah-${e.target.value}`,
                );
                target?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="appearance-none rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-8 text-xs font-medium text-white outline-none [&>option]:text-emerald-950 focus:border-emerald-300"
            >
              <option value="" disabled>
                Ayat…
              </option>
              {ayahs.map((ayah) => (
                <option key={ayah.numberInSurah} value={ayah.numberInSurah}>
                  Ayat {ayah.numberInSurah}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-emerald-100/70"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {ayahs.map((ayah) => (
          <AyahCard key={ayah.number} ayah={ayah} surahNumber={surahNumber} />
        ))}
      </ul>

      {fromCache && (
        <p className="text-center text-[11px] text-emerald-200/50">
          Ditampilkan dari penyimpanan perangkat — diperbarui saat online.
        </p>
      )}

      <nav
        className="mt-2 flex items-center justify-between gap-3"
        aria-label="Navigasi surah"
      >
        {prevSurah !== null ? (
          <Link
            href={`/quran/${prevSurah}`}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            <span className="truncate">Surah {prevSurah}</span>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2.5 text-xs font-semibold text-emerald-100/40">
            Awal Al-Qur&apos;an
          </span>
        )}
        {nextSurah !== null ? (
          <Link
            href={`/quran/${nextSurah}`}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            <span className="truncate">Surah {nextSurah}</span>
            <svg
              className="h-3.5 w-3.5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-4 py-2.5 text-xs font-semibold text-emerald-100/40">
            Akhir Al-Qur&apos;an
          </span>
        )}
      </nav>

      {ayahs.length > 1 && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-md items-center justify-between gap-2 bg-emerald-950/85 px-4 py-3 shadow-2xl ring-1 ring-white/15 backdrop-blur-md sm:max-w-lg">
            <button
              type="button"
              onClick={() => scrollToAyah(Math.max(1, currentAyah - 1))}
              disabled={currentAyah <= 1}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 transition-colors hover:bg-white/20 disabled:opacity-40"
            >
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
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
              Sebelumnya
            </button>
            <span className="text-xs font-semibold tabular-nums text-emerald-100/80">
              Ayat {currentAyah} / {lastAyah}
            </span>
            <button
              type="button"
              onClick={() => scrollToAyah(Math.min(lastAyah, currentAyah + 1))}
              disabled={currentAyah >= lastAyah}
              className="flex items-center gap-1 rounded-full bg-white/10 px-3.5 py-2 text-xs font-semibold text-emerald-100 transition-colors hover:bg-white/20 disabled:opacity-40"
            >
              Berikutnya
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
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
