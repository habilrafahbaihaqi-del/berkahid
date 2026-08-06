"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CalendarData } from "@/lib/muslim-api";

interface CalendarApiResponse {
  data?: CalendarData;
  error?: string;
}

interface HolidayItem {
  date: string;
  name: string;
  type: string | null;
  isJointLeave: boolean;
}

function todayLabel(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function DateCard({
  title,
  subtitle,
  date,
  accent,
}: {
  title: string;
  subtitle: string;
  date: string;
  accent: string;
}) {
  return (
    <div className="flex flex-1 flex-col rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/70">
        {title}
      </p>
      <p className={`mt-1 text-xs font-semibold ${accent}`}>{subtitle}</p>
      <p className="mt-3 text-lg font-bold leading-snug text-white">{date}</p>
    </div>
  );
}

export default function CalendarView() {
  const [today, setToday] = useState<CalendarData | null>(null);
  const [todayError, setTodayError] = useState(false);
  const [holidays, setHolidays] = useState<HolidayItem[] | null>(null);
  const [holidaysError, setHolidaysError] = useState(false);
  const [mode, setMode] = useState<"toHijr" | "toCe">("toHijr");
  const [inputDate, setInputDate] = useState(todayLabel());
  const [result, setResult] = useState<CalendarData | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);

  const loadToday = async (): Promise<CalendarData> => {
    const response = await fetch("/api/muslim/cal/today", { cache: "no-store" });
    if (!response.ok) throw new Error("Gagal memuat kalender.");
    const payload = (await response.json()) as CalendarApiResponse;
    if (!payload.data) throw new Error("Data kalender tidak tersedia.");
    return payload.data;
  };

  useEffect(() => {
    let cancelled = false;
    loadToday()
      .then((data) => {
        if (cancelled) return;
        setToday(data);
        setTodayError(false);
      })
      .catch(() => {
        if (!cancelled) setTodayError(true);
      });
    fetch("/api/kalender/libur", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("failed"))))
      .then((payload: { results?: HolidayItem[] }) => {
        if (cancelled) return;
        setHolidays(payload.results ?? []);
        setHolidaysError(false);
      })
      .catch(() => {
        if (!cancelled) setHolidaysError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    setTodayError(false);
    loadToday()
      .then((data) => {
        setToday(data);
        setTodayError(false);
      })
      .catch(() => setTodayError(true));
  };

  const handleConvert = async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(inputDate)) {
      setConvertError("Format tanggal harus YYYY-MM-DD.");
      return;
    }
    setConverting(true);
    setConvertError(null);
    setResult(null);
    try {
      const response = await fetch(
        `/api/muslim/cal/convert?date=${inputDate}&to=${mode === "toHijr" ? "hijr" : "ce"}`,
        { cache: "no-store" },
      );
      const payload = (await response.json()) as CalendarApiResponse;
      if (!response.ok || !payload.data) {
        throw new Error(payload.error ?? "Konversi gagal.");
      }
      setResult(payload.data);
    } catch (error) {
      setConvertError(
        error instanceof Error ? error.message : "Konversi gagal. Coba lagi.",
      );
    } finally {
      setConverting(false);
    }
  };

  const inputPlaceholder =
    mode === "toHijr" ? "Tanggal Masehi (YYYY-MM-DD)" : "Tanggal Hijriah (YYYY-MM-DD)";

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
          <h1 className="text-base font-bold">Kalender Islam</h1>
          <p className="text-[11px] text-emerald-200/70">
            Masehi & Hijriah · sumber api.myquran.com
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-3">
        {todayError ? (
          <div className="rounded-3xl bg-white/10 px-5 py-8 text-center ring-1 ring-white/15">
            <p className="text-sm text-emerald-100/80">
              Gagal memuat kalender hari ini.
            </p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50"
            >
              Coba lagi
            </button>
          </div>
        ) : today ? (
          <div className="flex flex-col gap-3 sm:flex-row">
            <DateCard
              title="Hari Ini"
              subtitle={`${today.ce.dayName}, ${today.ce.day} ${today.ce.monthName} ${today.ce.year}`}
              date={today.ce.today}
              accent="text-emerald-300"
            />
            <DateCard
              title="Hijriah"
              subtitle={`${today.hijr.dayName}, ${today.hijr.day} ${today.hijr.monthName} ${today.hijr.year} H`}
              date={today.hijr.today}
              accent="text-amber-300"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-3xl bg-white/10 px-5 py-8 ring-1 ring-white/15">
            <svg
              className="h-5 w-5 animate-spin text-emerald-200"
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
            <p className="text-sm text-emerald-100/70">Memuat kalender…</p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
        <div>
          <h2 className="text-sm font-bold text-emerald-100">Konversi Tanggal</h2>
          <p className="mt-1 text-[11px] leading-relaxed text-emerald-100/60">
            Ubah tanggal Masehi ke Hijriah, atau sebaliknya.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-emerald-950/40 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMode("toHijr");
              setResult(null);
              setConvertError(null);
            }}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              mode === "toHijr"
                ? "bg-emerald-500 text-white shadow"
                : "text-emerald-100/60 hover:text-emerald-100"
            }`}
          >
            Masehi → Hijriah
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("toCe");
              setResult(null);
              setConvertError(null);
            }}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              mode === "toCe"
                ? "bg-emerald-500 text-white shadow"
                : "text-emerald-100/60 hover:text-emerald-100"
            }`}
          >
            Hijriah → Masehi
          </button>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="date"
              value={inputDate}
              onChange={(e) => {
                setInputDate(e.target.value);
                setConvertError(null);
              }}
              aria-label={inputPlaceholder}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white outline-none [color-scheme:dark] focus:border-emerald-300"
            />
          </div>
          <button
            type="button"
            onClick={handleConvert}
            disabled={converting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-400 disabled:opacity-60"
          >
            {converting && (
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
            )}
            Konversi
          </button>
        </div>

        {convertError && (
          <p className="text-xs font-medium text-rose-300">{convertError}</p>
        )}

        {result && (
          <div className="rounded-2xl bg-emerald-400/10 p-4 ring-1 ring-emerald-300/20">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200/70">
              {mode === "toHijr" ? "Hasil Hijriah" : "Hasil Masehi"}
            </p>
            <p className="mt-1 text-base font-bold text-white">
              {mode === "toHijr" ? result.hijr.today : result.ce.today}
            </p>
            <p className="mt-1 text-[11px] text-emerald-100/60">
              {mode === "toHijr"
                ? `${result.hijr.day} ${result.hijr.monthName} ${result.hijr.year} H (metode ${result.method})`
                : `${result.ce.day} ${result.ce.monthName} ${result.ce.year} (metode ${result.method})`}
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-emerald-100">Hari Libur Terdekat</h2>
          <span className="text-[10px] font-medium text-emerald-200/60">
            SKB 3 Menteri
          </span>
        </div>
        {holidaysError && (
          <p className="text-xs text-emerald-100/60">
            Gagal memuat hari libur. Coba lagi nanti.
          </p>
        )}
        {holidays === null && !holidaysError && (
          <div className="flex items-center gap-2 py-2 text-xs text-emerald-100/60">
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
            Memuat hari libur…
          </div>
        )}
        {holidays && (
          <ul className="flex flex-col gap-2">
            {holidays.slice(0, 8).map((holiday) => (
              <li
                key={`${holiday.date}-${holiday.name}`}
                className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-400/10 px-4 py-3 ring-1 ring-emerald-300/20"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-white">
                    {holiday.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-emerald-100/60">
                    {new Date(`${holiday.date}T00:00:00`).toLocaleDateString(
                      "id-ID",
                      { weekday: "long", day: "numeric", month: "long", year: "numeric" },
                    )}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ring-1 ${
                    holiday.type === "keagamaan"
                      ? "bg-amber-400/15 text-amber-200 ring-amber-300/30"
                      : holiday.isJointLeave
                        ? "bg-sky-400/15 text-sky-200 ring-sky-300/30"
                        : "bg-emerald-400/15 text-emerald-200 ring-emerald-300/30"
                  }`}
                >
                  {holiday.isJointLeave
                    ? "Cuti Bersama"
                    : holiday.type === "keagamaan"
                      ? "Keagamaan"
                      : "Nasional"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-center text-[11px] text-emerald-200/50">
        Data kalender dari api.myquran.com · hari libur dari API Indonesia · penyesuaian ±
        {today?.adjustment ?? 0} hari
      </p>
    </main>
  );
}
