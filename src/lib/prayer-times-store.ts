"use client";

import {
  DEFAULT_PRAYER_TIMES,
  type PrayerTime,
} from "@/data/prayer-times";
import { createStoredValue, readStoredValue, useStoredValue } from "@/lib/storage";

export interface PrayerTimesSnapshot {
  times: PrayerTime[];
  date: string;
  hijri: string | null;
  source: "myquran" | "aladhan" | "fallback";
  location?: {
    id?: string;
    kabko?: string;
    prov?: string;
  };
  fetchedAt: number;
}

const PRAYER_TIMES_KEY = "berkahid:prayer-times";

const prayerTimesStore = createStoredValue<PrayerTimesSnapshot>(PRAYER_TIMES_KEY);

export function usePrayerTimesSnapshot() {
  return useStoredValue(prayerTimesStore);
}

export function getPrayerTimesSnapshot(): PrayerTimesSnapshot | null {
  return readStoredValue(prayerTimesStore);
}

export function setPrayerTimesSnapshot(snapshot: PrayerTimesSnapshot | null) {
  prayerTimesStore.set(snapshot);
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  locationName?: string,
): Promise<PrayerTimesSnapshot> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const params = new URLSearchParams({
    lat: latitude.toFixed(6),
    lon: longitude.toFixed(6),
  });
  if (timezone) params.set("tz", timezone);
  if (locationName) params.set("lokasi", locationName);

  const response = await fetch(`/api/prayer-times?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Gagal memuat jadwal sholat.");
  }

  const payload = (await response.json()) as {
    timings?: Record<string, string>;
    date?: string;
    hijri?: string | null;
    source?: "myquran" | "aladhan";
    location?: PrayerTimesSnapshot["location"];
  };

  if (!payload.timings) {
    throw new Error("Jadwal sholat tidak tersedia.");
  }

  const keys: Array<PrayerTime["key"]> = [
    "imsak",
    "subuh",
    "terbit",
    "dhuha",
    "dzuhur",
    "ashar",
    "maghrib",
    "isya",
  ];

  const fallbackFor = (key: PrayerTime["key"]) =>
    DEFAULT_PRAYER_TIMES.find((p) => p.key === key)?.time ?? "--:--";

  const times: PrayerTime[] = keys.map((key) => {
    const raw = payload.timings?.[key] ?? "";
    const time = /^\d{2}:\d{2}$/.test(raw) ? raw.slice(0, 5) : fallbackFor(key);
    return { key, name: DEFAULT_PRAYER_TIMES.find((p) => p.key === key)!.name, time };
  });

  return {
    times,
    date: payload.date ?? "",
    hijri: payload.hijri ?? null,
    source: payload.source ?? "fallback",
    location: payload.location,
    fetchedAt: Date.now(),
  };
}
