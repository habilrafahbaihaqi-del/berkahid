"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import LocationPermissionDialog from "@/components/location-permission-dialog";
import LocationSearch from "@/components/location-search";
import NextAdhanBadge from "@/components/next-adhan-badge";
import { useAuth } from "@/lib/auth-context";
import {
  DEFAULT_PRAYER_TIMES,
  FALLBACK_LOCATION,
  type FardhuKey,
  type PrayerTime,
} from "@/data/prayer-times";
import type { Location } from "@/data/cities";
import { applyAutoLocation } from "@/lib/geo";
import {
  dismissLocationPrompt,
  saveLocation,
  saveLocationSource,
  useAutoCoords,
  useLocationPromptDismissed,
  useStoredLocation,
} from "@/lib/location-store";
import {
  togglePrayerNotification,
  updateNotificationSettings,
  useNotificationSettings,
} from "@/lib/notification-store";
import {
  fetchPrayerTimes,
  setPrayerTimesSnapshot,
  usePrayerTimesSnapshot,
} from "@/lib/prayer-times-store";
import { playAdhanSound } from "@/lib/adhan-scheduler";
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

const DEFAULT_COORDS = {
  latitude: FALLBACK_LOCATION.latitude,
  longitude: FALLBACK_LOCATION.longitude,
};

function formatTwo(n: number) {
  return n.toString().padStart(2, "0");
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getNextPrayer(
  times: PrayerTime[],
  now: Date,
): { prayer: PrayerTime; isToday: boolean } {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const prayer of times) {
    if (toMinutes(prayer.time) > nowMinutes) {
      return { prayer, isToday: true };
    }
  }
  return { prayer: times[0], isToday: false };
}

function timezoneLabel(now: Date) {
  const offsetHours = -now.getTimezoneOffset() / 60;
  if (offsetHours >= 8.5) return "WIT";
  if (offsetHours >= 7.5) return "WITA";
  return "WIB";
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
        { value: formatTwo(hours), label: "JAM" },
        { value: formatTwo(minutes), label: "MENIT" },
        { value: formatTwo(seconds), label: "DETIK" },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-2">
          {i > 0 && <span className="text-xl font-semibold text-emerald-950/40">:</span>}
          <div className="flex min-w-14 flex-col items-center">
            <span className="text-3xl font-bold tabular-nums tracking-wider text-white">
              {unit.value}
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-emerald-200/70">
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function BellButton({
  active,
  onClick,
  label,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-colors ${className}`}
    >
      <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
      </svg>
      {active && (
        <span className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
      )}
    </button>
  );
}

export default function PrayerSchedule() {
  const router = useRouter();
  const { user } = useAuth();
  const userName = user?.email?.split("@")[0] || "Ahmad";
  const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const now = useNow();
  const storedLocation = useStoredLocation();
  const promptDismissed = useLocationPromptDismissed();
  const autoCoords = useAutoCoords();
  const snapshot = usePrayerTimesSnapshot();
  const settings = useNotificationSettings();

  const [locationSearchOpen, setLocationSearchOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const activeLocation: Location | null = storedLocation ?? null;
  const permissionOpen =
    storedLocation === null && promptDismissed !== true && !locationSearchOpen;

  const times = snapshot?.times ?? DEFAULT_PRAYER_TIMES;
  const next = now ? getNextPrayer(times, now) : null;

  const coords =
    autoCoords ??
    (storedLocation?.latitude != null && storedLocation.longitude != null
      ? { latitude: storedLocation.latitude, longitude: storedLocation.longitude }
      : DEFAULT_COORDS);

  const loadPrayerTimesAt = (latitude: number, longitude: number) =>
    fetchPrayerTimes(latitude, longitude);

  useEffect(() => {
    let cancelled = false;
    loadPrayerTimesAt(coords.latitude, coords.longitude)
      .then((fetched) => {
        if (cancelled) return;
        setPrayerTimesSnapshot(fetched);
        setRefreshError(false);
      })
      .catch(() => {
        if (!cancelled) setRefreshError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [coords.latitude, coords.longitude]);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  const dateLabel = now
    ? new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now)
    : "";

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

  const ensureNotifications = useCallback(async (): Promise<boolean> => {
    setNotice(null);
    if (settings.enabled) return true;
    if (!("Notification" in window)) {
      setNotice("Browser ini tidak mendukung notifikasi. Gunakan browser modern.");
      return false;
    }
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setNotice("Izin notifikasi belum diberikan. Aktifkan melalui pengaturan browser.");
      return false;
    }
    updateNotificationSettings({ enabled: true });
    playAdhanSound(settings.sound);
    return true;
  }, [settings.enabled, settings.sound]);

  const handleBellClick = async () => {
    if (settings.enabled) {
      router.push("/pengaturan");
      return;
    }
    await ensureNotifications();
  };

  const handlePrayerBellClick = async (key: FardhuKey) => {
    const ok = await ensureNotifications();
    if (!ok) return;
    togglePrayerNotification(key, !settings.perPrayer[key]);
  };

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-[#F8FAFC] pb-20 text-slate-800 lg:pb-10">
      {/* Background Illustration */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-0 aspect-square w-64 bg-cover bg-no-repeat bg-right-top opacity-90 sm:w-80 lg:w-[22rem]"
        style={{
          backgroundImage: "url('/mosque-header.jpg')",
          maskImage: "radial-gradient(ellipse 75% 75% at 72% 25%, black 35%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 72% 25%, black 35%, transparent 72%)",
        }}
      />

      <main className="relative z-10 mx-auto flex max-w-md flex-col gap-6 px-5 pt-8 sm:max-w-lg lg:max-w-3xl lg:px-8 lg:pt-10">

        {/* Greeting Section */}
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Assalamu&apos;alaikum,
            <br />
            <span className="text-emerald-700">{capitalizedName}</span>
          </h1>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-slate-600">
            Semoga hari ini penuh berkah dan ibadah kita diterima oleh Allah SWT.
          </p>
        </header>

        {notice && (
          <div className="flex items-start justify-between gap-3 rounded-2xl bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200">
            <p>{notice}</p>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Tutup pemberitahuan"
              className="shrink-0 rounded-full p-0.5 text-amber-600 transition-colors hover:bg-amber-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {refreshError && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-rose-50 px-4 py-3 text-xs leading-relaxed text-rose-700 ring-1 ring-rose-200">
            <p>Jadwal belum terbarui. Periksa koneksi lalu coba lagi.</p>
            <button
              type="button"
              onClick={() => {
                setRefreshError(false);
                loadPrayerTimesAt(coords.latitude, coords.longitude)
                  .then((fetched) => setPrayerTimesSnapshot(fetched))
                  .catch(() => setRefreshError(true));
              }}
              className="shrink-0 rounded-full bg-rose-100 px-3 py-1.5 font-bold text-rose-700 transition-colors hover:bg-rose-200"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* Location & Date Cards */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {activeLocation
                    ? `${activeLocation.city}, ${activeLocation.district}`
                    : `${FALLBACK_LOCATION.city}, ${FALLBACK_LOCATION.district}`}
                </p>
                <button
                  onClick={() => setLocationSearchOpen(true)}
                  className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Ganti lokasi
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={refreshLocation}
              disabled={refreshing}
              aria-label="Perbarui lokasi otomatis"
              title="Deteksi lokasi otomatis"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600 disabled:opacity-60"
            >
              <svg
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {dateLabel || "Memuat tanggal..."}
              </p>
              <p className="truncate text-[11px] font-medium text-slate-500">
                {snapshot?.hijri ?? (now ? "Memuat tanggal Hijriah…" : "")}
              </p>
            </div>
            <BellButton
              active={settings.enabled}
              onClick={handleBellClick}
              label={
                settings.enabled
                  ? "Notifikasi aktif — buka pengaturan"
                  : "Aktifkan notifikasi adzan"
              }
              className={
                settings.enabled
                  ? "shrink-0 bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 hover:bg-emerald-100"
                  : "shrink-0 bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-emerald-600"
              }
            />
          </div>
        </div>

        {/* Shalat Selanjutnya Card */}
        <section className="relative overflow-hidden rounded-[2rem] bg-[#085340] p-6 text-white shadow-xl shadow-emerald-900/10 sm:p-8">
          <div className="absolute -bottom-10 -right-10 opacity-5 mix-blend-overlay" aria-hidden>
            <svg className="h-72 w-72" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col gap-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-200/80">
              Shalat Selanjutnya
            </p>

            {next && now ? (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-[2.5rem] font-bold leading-none">{next.prayer.name}</span>
                    <span className="text-[2rem] font-light text-emerald-200">{ARABIC_NAMES[next.prayer.key]}</span>
                  </div>
                  <p className="mt-2 text-sm text-emerald-100/90">Menuju waktu</p>
                </div>

                <div className="flex flex-col items-start gap-3 sm:items-end">
                  <Countdown target={next.prayer} isToday={next.isToday} now={now} />
                </div>
              </div>
            ) : (
              <div className="py-2 text-sm text-emerald-100/70">Memuat jadwal…</div>
            )}

            <div className="mt-2 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[2.5rem] font-bold tabular-nums tracking-wide">
                {next?.prayer.time || "--:--"}
              </p>
              {settings.enabled ? (
                <button
                  type="button"
                  onClick={() => router.push("/pengaturan")}
                  className="flex w-fit items-center gap-2.5 rounded-full bg-emerald-500/20 px-5 py-2.5 text-xs font-bold text-emerald-100 backdrop-blur-sm transition-colors hover:bg-emerald-500/30"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Pengingat aktif
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleBellClick}
                  className="flex w-fit items-center gap-2.5 rounded-full bg-white/10 px-5 py-2.5 text-xs font-bold text-emerald-100 backdrop-blur-sm ring-1 ring-white/15 transition-colors hover:bg-white/20"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Aktifkan pengingat
                </button>
              )}
            </div>

            {settings.enabled && <NextAdhanBadge />}
          </div>
        </section>

        {/* Jadwal Hari Ini */}
        <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-5">
            <h2 className="text-[15px] font-bold text-slate-800">Jadwal Hari Ini</h2>
            <span className="text-[11px] font-medium text-slate-400">
              {now ? timezoneLabel(now) : ""} · Kemenag RI
            </span>
          </div>
          <div className="flex flex-col px-3 pb-3">
            {times.map((prayer) => {
              const isNext = next?.prayer.key === prayer.key && next.isToday;
              const isTerbit = prayer.key === "terbit";
              const bellActive = settings.enabled && settings.perPrayer[prayer.key as FardhuKey];

              let Icon = null;
              if (prayer.key === "imsak" || prayer.key === "isya") {
                Icon = <svg className="h-[22px] w-[22px] text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
              } else if (prayer.key === "subuh" || prayer.key === "terbit") {
                Icon = <svg className="h-[22px] w-[22px] text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
              } else if (prayer.key === "dzuhur") {
                Icon = <svg className="h-[22px] w-[22px] text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>;
              } else if (prayer.key === "ashar") {
                Icon = <svg className="h-[22px] w-[22px] text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" /><circle cx="12" cy="11" r="2.2" /></svg>;
              } else if (prayer.key === "maghrib") {
                Icon = <svg className="h-[22px] w-[22px] text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>;
              }

              return (
                <div
                  key={prayer.key}
                  className={`flex items-center justify-between gap-2 rounded-2xl px-4 py-3.5 transition-colors ${
                    isNext ? "bg-emerald-50 ring-1 ring-emerald-100" : "hover:bg-slate-50"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-5">
                    <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl ${isNext ? "bg-white shadow-sm" : "bg-slate-50 text-slate-400"}`}>
                      {Icon}
                    </div>
                    <div className="flex min-w-0 items-center gap-3">
                      <p className={`truncate text-sm font-bold ${isNext ? "text-emerald-800" : "text-slate-800"}`}>
                        {isTerbit ? "Terbit" : prayer.name}
                      </p>
                      <p className="hidden text-sm font-medium text-slate-400 sm:block">
                        {ARABIC_NAMES[prayer.key] || "الشروق"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                    <span className={`text-[17px] font-bold tabular-nums ${isNext ? "text-emerald-800" : "text-slate-800"}`}>
                      {prayer.time}
                    </span>
                    {isTerbit ? (
                      <span className="flex h-8 w-8 items-center justify-center text-xl font-light text-slate-300" aria-hidden>
                        —
                      </span>
                    ) : (
                      <BellButton
                        active={bellActive}
                        onClick={() => handlePrayerBellClick(prayer.key as FardhuKey)}
                        label={
                          bellActive
                            ? `Matikan pengingat ${prayer.name}`
                            : `Aktifkan pengingat ${prayer.name}`
                        }
                        className={
                          bellActive
                            ? "text-emerald-600 hover:bg-emerald-100"
                            : "text-emerald-600 hover:bg-emerald-50"
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Menu Ibadah Harian */}
        <section className="flex flex-col gap-4">
          <h2 className="text-[15px] font-bold text-slate-800">Menu Ibadah Harian</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Doa */}
            <div className="flex flex-col justify-between rounded-3xl bg-emerald-50/70 p-5 ring-1 ring-emerald-100/70 transition-colors hover:bg-emerald-50">
              <div className="flex flex-col gap-4">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Doa</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Kumpulan doa harian untuk berbagai keperluan.</p>
                </div>
              </div>
              <Link href="/doa" className="mt-6 flex w-fit items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50">
                Lihat Doa
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Zikir */}
            <div className="flex flex-col justify-between rounded-3xl bg-teal-50/70 p-5 ring-1 ring-teal-100/70 transition-colors hover:bg-teal-50">
              <div className="flex flex-col gap-4">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Zikir</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Kumpulan zikir pilihan untuk menenangkan hati dan pikiran.</p>
                </div>
              </div>
              <Link href="/zikir" className="mt-6 flex w-fit items-center gap-1.5 rounded-full border border-teal-200 bg-white px-4 py-2 text-xs font-bold text-teal-700 shadow-sm transition-colors hover:bg-teal-50">
                Lihat Zikir
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Al-Qur'an */}
            <div className="flex flex-col justify-between rounded-3xl bg-[#EEF2FF] p-5 ring-1 ring-indigo-100/70 transition-colors hover:bg-indigo-50/80 sm:col-span-2 lg:col-span-1">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600">Progress</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Al-Qur&apos;an</h3>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Lanjutkan membaca Al-Qur&apos;an dan tingkatkan konsistensimu.</p>
                </div>

                <div className="mt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="text-indigo-600">2 Halaman</span>
                    <span className="text-slate-500">33%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
                    <div className="h-full w-1/3 rounded-full bg-indigo-500" />
                  </div>
                </div>
              </div>
              <Link href="/quran" className="mt-4 flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-sm transition-colors hover:bg-indigo-50">
                Lanjutkan
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

          </div>
        </section>

        <div className="mt-4 flex flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-center text-[10px] font-medium text-slate-400">
          <span className="flex items-center gap-2">
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Jadwal sholat aktual metode Kementerian Agama RI.
          </span>
          <span>Diperbarui otomatis sesuai lokasi perangkatmu.</span>
        </div>

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
