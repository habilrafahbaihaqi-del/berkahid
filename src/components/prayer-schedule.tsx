"use client";

import Link from "next/link";
import { useState } from "react";
import LocationPermissionDialog from "@/components/location-permission-dialog";
import LocationSearch from "@/components/location-search";
import NextAdhanBadge from "@/components/next-adhan-badge";
import SignOutButton from "@/components/auth/sign-out-button";
import {
  MOCK_LOCATION,
  MOCK_PRAYER_TIMES,
  type PrayerTime,
} from "@/data/mock-prayer-times";
import type { Location } from "@/data/mock-cities";
import { applyAutoLocation } from "@/lib/geo";
import {
  dismissLocationPrompt,
  saveLocation,
  saveLocationSource,
  useAutoCoords,
  useLocationPromptDismissed,
  useLocationSource,
  useStoredLocation,
} from "@/lib/location-store";
import { useNow } from "@/lib/use-now";

const ARABIC_NAMES: Record<string, string> = {
  imsak: "",
  subuh: "الفجر",
  terbit: "الشروق",
  dzuhur: "الظهر",
  ashar: "العصر",
  maghrib: "المغرب",
  isya: "العشاء",
};

function formatTwo(n: number) {
  return n.toString().padStart(2, "0");
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getNextPrayer(now: Date): { prayer: PrayerTime; isToday: boolean } {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const prayer of MOCK_PRAYER_TIMES) {
    if (toMinutes(prayer.time) > nowMinutes) {
      return { prayer, isToday: true };
    }
  }
  return { prayer: MOCK_PRAYER_TIMES[0], isToday: false };
}

function Countdown({
  target,
  isToday,
  now,
}: {
  target: PrayerTime;
  isToday: boolean;
  now: Date;
}) {
  const targetMinutes = toMinutes(target.time);
  const targetDate = new Date(now);
  targetDate.setHours(Math.floor(targetMinutes / 60), targetMinutes % 60, 0, 0);
  if (!isToday) {
    targetDate.setDate(targetDate.getDate() + 1);
  }
  const diff = Math.max(0, Math.floor((targetDate.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(diff / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = diff % 60;

  return (
    <div className="flex items-center gap-2">
      {[
        { value: formatTwo(hours), label: "Jam" },
        { value: formatTwo(minutes), label: "Menit" },
        { value: formatTwo(seconds), label: "Detik" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-xl font-semibold text-emerald-950/40">:</span>}
          <div className="flex min-w-16 flex-col items-center rounded-2xl bg-white/15 px-3 py-2 backdrop-blur-sm">
            <span className="text-2xl font-bold tabular-nums tracking-wider text-white">
              {unit.value}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-white/70">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PrayerSchedule() {
  const now = useNow();
  const storedLocation = useStoredLocation();
  const locationSource = useLocationSource();
  const promptDismissed = useLocationPromptDismissed();
  const autoCoords = useAutoCoords();
  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);

  const activeLocation: Location | null = storedLocation ?? null;
  const permissionOpen =
    storedLocation === null && promptDismissed !== true && !locationSearchOpen;

  const dateLabel = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "";

  const next = now ? getNextPrayer(now) : null;

  const refreshLocation = async () => {
    setRefreshing(true);
    setRefreshError(false);
    try {
      await applyAutoLocation();
    } catch {
      setRefreshError(true);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <main className="mx-auto flex max-w-md flex-col gap-6 px-4 pb-10 pt-6 sm:max-w-lg">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
                />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-widest text-emerald-200/80">
                BerkahID
              </p>
              <p className="text-sm font-semibold">Jadwal Sholat</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/quran"
              aria-label="Baca Al-Qur'an"
              title="Al-Qur'an"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                />
              </svg>
            </Link>
            <Link
              href="/zikir"
              aria-label="Katalog zikir"
              title="Zikir"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-4.5 w-4.5"
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
            </Link>
            <Link
              href="/doa"
              aria-label="Doa harian"
              title="Doa"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
            <Link
              href="/pengaturan"
              aria-label="Pengaturan notifikasi"
              title="Pengaturan"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20"
            >              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </Link>
            <SignOutButton />
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-emerald-100 backdrop-blur-sm">
              {MOCK_LOCATION.method}
            </span>
          </div>
        </header>

        <section className="rounded-3xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => setLocationSearchOpen(true)}
              className="group flex min-w-0 items-center gap-1.5 text-left text-sm font-semibold text-emerald-100 hover:text-white"
            >
              <svg
                className="h-4 w-4 shrink-0 text-emerald-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              <span className="truncate">
                {activeLocation
                  ? `${activeLocation.city}, ${activeLocation.district}`
                  : `${MOCK_LOCATION.city}, ${MOCK_LOCATION.district}`}
              </span>
              <svg
                className="h-3.5 w-3.5 shrink-0 text-emerald-300/70 transition-opacity group-hover:opacity-100 sm:opacity-60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 14.25-7.5 7.5-7.5-7.5m15-6-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>
            <div className="flex shrink-0 items-center gap-2">
              {locationSource === "auto" && (
                <button
                  type="button"
                  onClick={refreshLocation}
                  disabled={refreshing}
                  aria-label="Perbarui lokasi otomatis"
                  title="Perbarui lokasi"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition-colors hover:bg-white/20 disabled:opacity-60"
                >
                  <svg
                    className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              )}
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100">
                {locationSource === "auto" ? "Lokasi otomatis" : "Ganti lokasi"}
              </span>
            </div>
          </div>
          {refreshError && (
            <p className="mt-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-amber-200">
              Gagal memperbarui lokasi. Periksa izin lokasi atau pilih manual.
            </p>
          )}
          {locationSource === "auto" && autoCoords && (
            <p className="mt-1.5 text-[11px] tabular-nums text-emerald-200/70">
              Terdeteksi: {autoCoords.latitude.toFixed(4)},{" "}
              {autoCoords.longitude.toFixed(4)}
            </p>
          )}
          <p className="mt-1 text-xs text-emerald-200/80">{dateLabel || "\u00A0"}</p>

          <div className="mt-5 flex flex-col items-center gap-4 border-t border-white/15 pt-5">
            {next && now ? (
              <>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">
                    {next.prayer.name}
                  </span>
                  <span className="text-3xl font-light text-emerald-200">
                    {ARABIC_NAMES[next.prayer.key]}
                  </span>
                </div>
                <p className="text-sm text-emerald-100/90">
                  {next.isToday ? "Menuju waktu" : "Waktu terdekat besok"}
                </p>
                <Countdown target={next.prayer} isToday={next.isToday} now={now} />
                <p className="text-4xl font-bold tabular-nums tracking-wide text-white">
                  {next.prayer.time}
                </p>
              </>
            ) : (
              <div className="py-6 text-sm text-emerald-100/70">Memuat jadwal…</div>
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
          <div className="flex items-center justify-between border-b border-white/15 px-5 py-4">
            <h2 className="text-sm font-semibold">Jadwal Hari Ini</h2>
            <span className="text-[11px] text-emerald-200/80">WIB (Data tiruan)</span>
          </div>
          <ul className="divide-y divide-white/10">
            {MOCK_PRAYER_TIMES.map((prayer) => {
              const isNext = next?.prayer.key === prayer.key && next.isToday;
              return (
                <li
                  key={prayer.key}
                  className={`flex items-center justify-between px-5 py-3.5 ${
                    isNext ? "bg-emerald-950/40" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isNext && (
                      <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_2px_rgba(110,231,183,0.6)]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">{prayer.name}</p>
                      <p className="text-[11px] text-emerald-200/70">
                        {ARABIC_NAMES[prayer.key] || "—"}
                      </p>
                    </div>
                  </div>
                  <span className="text-base font-bold tabular-nums">{prayer.time}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <footer className="text-center text-[11px] text-emerald-200/60">
          Data tiruan untuk pengembangan — integrasi API &amp; lokasi menyusul.
        </footer>

        <section
          className="grid grid-cols-2 gap-3 sm:hidden"
          aria-label="Akses cepat"
        >
          <Link
            href="/doa/cepat"
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
              <svg
                className="h-4.5 w-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-white">Doa</span>
              <span className="block truncate text-[10px] text-emerald-100/60">
                Kategori doa harian
              </span>
            </span>
          </Link>
          <Link
            href="/zikir"
            className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-200">
              <svg
                className="h-4.5 w-4.5"
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
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-white">Zikir</span>
              <span className="block truncate text-[10px] text-emerald-100/60">
                Antrian &amp; target harian
              </span>
            </span>
          </Link>
        </section>

        <NextAdhanBadge />
      </main>

      <LocationPermissionDialog
        open={permissionOpen}
        onClose={() => dismissLocationPrompt()}
        onRequestManual={() => {
          dismissLocationPrompt();
          setLocationSearchOpen(true);
        }}
      />
      <LocationSearch
        open={locationSearchOpen}
        onClose={() => setLocationSearchOpen(false)}
        onSelect={(location) => {
          saveLocation(location);
          saveLocationSource("manual");
        }}
      />
    </div>
  );
}
