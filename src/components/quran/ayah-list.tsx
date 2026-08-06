"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { saveQuranProgress } from "@/lib/quran-progress-store";

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number | null;
  page: number | null;
  text: string;
  translation: string;
  audioUrl: string | null;
  tafsir: {
    kemenagShort: string | null;
    kemenagLong: string | null;
    quraish: string | null;
    jalalayn: string | null;
  };
  sajda: {
    recommended: boolean;
    obligatory: boolean;
  };
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

type TafsirSource = "kemenag" | "quraish" | "jalalayn";

const TAFSIR_LABELS: Record<TafsirSource, string> = {
  kemenag: "Kemenag",
  quraish: "Quraish",
  jalalayn: "Jalalayn",
};

function stripQuraishIntro(text: string) {
  const match = /^\[\[.*?\]\]/.exec(text);
  if (!match) return text;
  return text.slice(match[0].length).trim();
}

function AyahCard({ ayah }: { ayah: Ayah }) {
  const [expanded, setExpanded] = useState(false);
  const [tafsirSource, setTafsirSource] = useState<TafsirSource>("kemenag");
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleAudio = () => {
    if (!ayah.audioUrl) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(ayah.audioUrl);
      audioRef.current.onended = () => setPlaying(false);
    }
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  const hasSajda = Boolean(ayah.sajda?.recommended || ayah.sajda?.obligatory);
  const tafsirKemenag = ayah.tafsir?.kemenagShort ?? ayah.tafsir?.kemenagLong;
  const tafsirLongAvailable = Boolean(ayah.tafsir?.kemenagLong);
  const [showLongTafsir, setShowLongTafsir] = useState(false);

  const tafsirContent =
      tafsirSource === "kemenag"
      ? showLongTafsir && ayah.tafsir?.kemenagLong
        ? ayah.tafsir.kemenagLong
        : tafsirKemenag
      : tafsirSource === "quraish"
        ? ayah.tafsir?.quraish
          ? stripQuraishIntro(ayah.tafsir.quraish)
          : null
        : ayah.tafsir?.jalalayn;

  const availableSources: TafsirSource[] = (
    ["kemenag", "quraish", "jalalayn"] as TafsirSource[]
  ).filter(
    (source) =>
      source === "kemenag"
        ? Boolean(tafsirKemenag)
        : Boolean(
            source === "quraish" ? ayah.tafsir?.quraish : ayah.tafsir?.jalalayn,
          ),
  );

  return (
    <li
      id={`ayah-${ayah.numberInSurah}`}
      className="scroll-mt-20 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
    >
      <p
        dir="rtl"
        lang="ar"
        className="font-quran text-3xl leading-[2.2] text-gray-900 [text-align:justify]"
      >
        {ayah.text}
        <span className="mx-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#e5f5f0] align-middle text-base font-bold text-[#1db584]">
          {formatArabicNumber(ayah.numberInSurah)}
        </span>
      </p>
      {hasSajda && (
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200">
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
          </svg>
          Ayat Sajdah
        </span>
      )}
      <p className="mt-4 border-t border-gray-100 pt-4 text-[15px] leading-relaxed text-gray-600">
        {ayah.translation}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
        {ayah.audioUrl && (
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={playing}
            className="flex items-center gap-1.5 rounded-full bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-100"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              {playing ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
              )}
            </svg>
            {playing ? "Hentikan" : "Putar"}
          </button>
        )}
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="flex items-center gap-1.5 rounded-full bg-[#e5f5f0] px-3.5 py-1.5 text-xs font-semibold text-[#1db584] transition-colors hover:bg-[#c9ebe0]"
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
        <div className="mt-4 rounded-2xl bg-gray-50 p-4 ring-1 ring-gray-100">
          {availableSources.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2">
                {availableSources.map((source) => (
                  <button
                    key={source}
                    type="button"
                    onClick={() => setTafsirSource(source)}
                    className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-colors ${
                      tafsirSource === source
                        ? "bg-[#188965] text-white"
                        : "bg-white text-gray-500 ring-1 ring-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {TAFSIR_LABELS[source]}
                  </button>
                ))}
              </div>
              {tafsirContent ? (
                <>
                  <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-gray-700">
                    {tafsirContent}
                  </p>
                  {tafsirSource === "kemenag" &&
                    tafsirLongAvailable &&
                    ayah.tafsir.kemenagLong &&
                    !showLongTafsir && (
                      <button
                        type="button"
                        onClick={() => setShowLongTafsir(true)}
                        className="mt-4 rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#1db584] ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
                      >
                        Baca tafsir lengkap
                      </button>
                    )}
                  <p className="mt-4 text-[11px] font-medium text-gray-400">
                    {tafsirSource === "kemenag"
                      ? showLongTafsir
                        ? "Tafsir Kemenag (lengkap)"
                        : "Tafsir Kemenag (ringkas)"
                      : tafsirSource === "quraish"
                        ? "Tafsir Al-Qurthubi versi Quraish Shihab"
                        : "Tafsir Jalalayn"}
                    {ayah.juz != null && ` · Juz ${ayah.juz}`}
                    {ayah.page != null && ` · Hal. ${ayah.page}`}
                  </p>
                </>
              ) : (
                <p className="mt-4 text-sm text-gray-500">
                  Tafsir {TAFSIR_LABELS[tafsirSource]} tidak tersedia untuk ayat ini.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-gray-500">
              Tafsir ayat ini tidak tersedia.
            </p>
          )}
        </div>
      )}
    </li>
  );
}

interface ApiAyah {
  number: number;
  surahNumber: number;
  arab: string;
  translation: string;
  audioUrl: string | null;
  tafsir: Ayah["tafsir"];
  meta: {
    juz: number | null;
    page: number | null;
    sajda: { recommended: boolean; obligatory: boolean };
  };
}

interface ApiSurahPage {
  ayahs: ApiAyah[];
  pagination: { page: number; limit: number; total: number };
}

const PAGE_SIZE = 50;
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry {
  savedAt: number;
  ayahs: Ayah[];
}

function isValidCachedAyah(ayah: unknown): ayah is Ayah {
  if (!ayah || typeof ayah !== "object") return false;
  const candidate = ayah as Partial<Ayah>;
  return (
    typeof candidate.number === "number" &&
    typeof candidate.numberInSurah === "number" &&
    typeof candidate.text === "string" &&
    typeof candidate.translation === "string" &&
    typeof candidate.tafsir === "object" &&
    typeof candidate.sajda === "object"
  );
}

function mapApiAyah(ayah: ApiAyah): Ayah {
  return {
    number: ayah.number,
    numberInSurah: ayah.number,
    juz: ayah.meta.juz,
    page: ayah.meta.page,
    text: ayah.arab,
    translation: ayah.translation,
    audioUrl: ayah.audioUrl,
    tafsir: ayah.tafsir,
    sajda: ayah.meta.sajda,
  };
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
  const [loadingMore, setLoadingMore] = useState(false);
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

    async function fetchPage(page: number): Promise<ApiSurahPage> {
      const response = await fetch(
        `/api/muslim/quran/surah/${surahNumber}?page=${page}&limit=${PAGE_SIZE}`,
        { cache: "no-store" },
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = (await response.json()) as ApiSurahPage;
      if (!Array.isArray(payload.ayahs)) throw new Error("Data ayat tidak valid");
      return payload;
    }

    async function load() {
      const cacheKey = `berkahid:quran:${surahNumber}:v2`;
      try {
        const legacyKey = `berkahid:quran:${surahNumber}`;
        if (window.localStorage.getItem(legacyKey)) {
          window.localStorage.removeItem(legacyKey);
        }
      } catch {
        // abaikan
      }
      let cached: CacheEntry | null = null;
      try {
        const raw = window.localStorage.getItem(cacheKey);
        if (raw) {
          cached = JSON.parse(raw) as CacheEntry;
          if (
            Array.isArray(cached.ayahs) &&
            cached.ayahs.length > 0 &&
            cached.ayahs.every(isValidCachedAyah)
          ) {
            setAyahs(cached.ayahs);
            setFromCache(true);
          } else {
            cached = null;
          }
        }
      } catch {
        cached = null;
      }

      try {
        const firstPage = await fetchPage(1);
        if (requestIdRef.current !== requestId) return;

        const firstBatch = firstPage.ayahs.map(mapApiAyah);
        setAyahs(firstBatch);
        setFromCache(false);
        setError(null);

        const total = firstPage.pagination?.total ?? firstBatch.length;
        const totalPages = Math.ceil(total / PAGE_SIZE);

        if (totalPages > 1) {
          setLoadingMore(true);
          const rest: Ayah[] = [];
          for (let page = 2; page <= totalPages; page += 1) {
            const nextPage = await fetchPage(page);
            if (requestIdRef.current !== requestId) return;
            rest.push(...nextPage.ayahs.map(mapApiAyah));
          }
          if (requestIdRef.current !== requestId) return;
          const complete = [...firstBatch, ...rest];
          setAyahs(complete);
          try {
            window.localStorage.setItem(
              cacheKey,
              JSON.stringify({ savedAt: Date.now(), ayahs: complete } satisfies CacheEntry),
            );
          } catch {
            // localStorage penuh — abaikan
          }
          setLoadingMore(false);
        } else {
          try {
            window.localStorage.setItem(
              cacheKey,
              JSON.stringify({ savedAt: Date.now(), ayahs: firstBatch } satisfies CacheEntry),
            );
          } catch {
            // localStorage penuh — abaikan
          }
        }
      } catch {
        if (requestIdRef.current !== requestId) return;
        if (!cached || cached.savedAt + CACHE_TTL_MS < Date.now()) {
          setError("Gagal memuat ayat. Periksa koneksi lalu coba lagi.");
        }
        setLoadingMore(false);
      }
    }

    load();
    return () => {
      requestIdRef.current += 1;
    };
  }, [surahNumber, attempt]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-5 py-10 text-center ring-1 ring-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">{error}</p>
        <button
          type="button"
          onClick={() => {
            setError(null);
            setAyahs(null);
            setFromCache(false);
            setAttempt((a) => a + 1);
          }}
          className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
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
          className="h-6 w-6 animate-spin text-[#1db584]"
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
        <p className="text-sm text-gray-500">Memuat ayat…</p>
      </div>
    );
  }

  const scrollToAyah = (numberInSurah: number) => {
    document
      .getElementById(`ayah-${numberInSurah}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const lastAyah = ayahs.length;
  const showBasmalah = surahNumber !== 1 && surahNumber !== 9;

  return (
    <section className="flex flex-col gap-2">
      {showBasmalah && (
        <div className="flex flex-col items-center gap-2 rounded-3xl bg-white px-5 py-7 shadow-sm ring-1 ring-gray-100">
          <span dir="rtl" className="font-quran text-3xl text-[#1db584]">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>
          <span className="text-[12px] font-medium text-gray-400">Basmalah</span>
        </div>
      )}

      {ayahs.length > 1 && (
        <div className="sticky top-2 z-10 flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-md ring-1 ring-gray-200">
          <span className="truncate text-[13px] font-bold text-gray-900">
            {surahName} · {lastAyah} ayat
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
              className="appearance-none rounded-full border-0 bg-gray-50 py-1.5 pl-4 pr-8 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-200 outline-none focus:ring-2 focus:ring-inset focus:ring-[#1db584]"
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
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
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
          <AyahCard key={ayah.number} ayah={ayah} />
        ))}
      </ul>

      {loadingMore && (
        <div className="flex items-center justify-center gap-2 py-4 text-xs font-medium text-gray-400">
          <svg
            className="h-4 w-4 animate-spin"
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
          Memuat ayat lainnya…
        </div>
      )}

      {fromCache && (
        <p className="text-center text-[11px] text-gray-400">
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
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
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
          <span className="flex items-center gap-1.5 rounded-full bg-transparent px-4 py-2.5 text-xs font-semibold text-gray-400">
            Awal Al-Qur&apos;an
          </span>
        )}
        {nextSurah !== null ? (
          <Link
            href={`/quran/${nextSurah}`}
            className="flex min-w-0 items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
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
          <span className="flex items-center gap-1.5 rounded-full bg-transparent px-4 py-2.5 text-xs font-semibold text-gray-400">
            Akhir Al-Qur&apos;an
          </span>
        )}
      </nav>

      {ayahs.length > 1 && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          <div className="mx-auto flex max-w-md items-center justify-between gap-2 bg-white/90 px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] ring-1 ring-gray-200 backdrop-blur-md sm:max-w-lg">
            <button
              type="button"
              onClick={() => scrollToAyah(Math.max(1, currentAyah - 1))}
              disabled={currentAyah <= 1}
              className="flex items-center gap-1 rounded-full bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-100 disabled:opacity-40"
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
            <span className="text-xs font-bold tabular-nums text-gray-600">
              Ayat {currentAyah} / {lastAyah}
            </span>
            <button
              type="button"
              onClick={() => scrollToAyah(Math.min(lastAyah, currentAyah + 1))}
              disabled={currentAyah >= lastAyah}
              className="flex items-center gap-1 rounded-full bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition-colors hover:bg-gray-100 disabled:opacity-40"
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
