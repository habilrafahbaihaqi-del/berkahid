const MUSLIM_API = "https://api.myquran.com/v3";

export class MuslimApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "MuslimApiError";
  }
}

export async function muslimGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  options?: { raw?: boolean },
): Promise<T> {
  const url = new URL(`${MUSLIM_API}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new MuslimApiError("Gagal menghubungi layanan data Muslim.", 502);
  }

  if (!response.ok) {
    throw new MuslimApiError(
      `Layanan data Muslim mengembalikan error (${response.status}).`,
      502,
    );
  }

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: T;
    pagination?: unknown;
    error?: string;
  };

  if (payload.status === false) {
    throw new MuslimApiError(payload.error ?? payload.message ?? "Data tidak tersedia.", 404);
  }

  if (options?.raw) {
    return payload as unknown as T;
  }

  return (payload.data ?? payload) as T;
}

export interface KabkotaEntry {
  id: string;
  lokasi: string;
}

const KABKOTA_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

let kabkotaCache: { savedAt: number; list: KabkotaEntry[] } | null = null;

export async function getKabkotaList(): Promise<KabkotaEntry[]> {
  if (kabkotaCache && Date.now() - kabkotaCache.savedAt < KABKOTA_CACHE_TTL_MS) {
    return kabkotaCache.list;
  }
  const list = await muslimGet<KabkotaEntry[]>("/sholat/kabkota/semua");
  kabkotaCache = { savedAt: Date.now(), list };
  return list;
}

function normalizeName(raw: string) {
  return raw
    .toLowerCase()
    .replace(
      /^(kabupaten|kab\.|kab\/kota|kota|kotamadya|kodya)\s*/,
      "",
    )
    .replace(/[.,'']/g, "")
    .replace(/é/g, "e")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

import { findNearestLocation } from "@/data/cities";

export async function findKabkotaId(
  latitude: number,
  longitude: number,
  locationName?: string,
) {
  const list = await getKabkotaList();
  const normalized = list.map((entry) => ({
    entry,
    normalized: normalizeName(entry.lokasi),
  }));

  if (locationName) {
    const targetName = normalizeName(locationName);
    if (targetName) {
      const exact = normalized.find(({ normalized: n }) => n === targetName);
      if (exact) return exact.entry;
      const partial = normalized.find(
        ({ normalized: n }) => n.includes(targetName) || targetName.includes(n),
      );
      if (partial) return partial.entry;
    }
  }

  const nearest = findNearestLocation(latitude, longitude);
  const target = normalizeName(nearest.city);
  if (!target) return null;

  const exact = normalized.find(({ normalized: n }) => n === target);
  if (exact) return exact.entry;

  const partial = normalized.find(
    ({ normalized: n }) => n.includes(target) || target.includes(n),
  );
  if (partial) return partial.entry;

  const closest = normalized
    .map(({ entry, normalized: n }) => ({
      entry,
      score: longestCommonPrefix(n, target).length,
    }))
    .sort((a, b) => b.score - a.score)[0];
  return closest && closest.score >= 4 ? closest.entry : null;
}

function longestCommonPrefix(a: string, b: string) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i += 1;
  return a.slice(0, i);
}

export interface JadwalEntry {
  tanggal: string;
  imsak: string;
  subuh: string;
  terbit: string;
  dhuha: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
}

export interface JadwalData {
  id: string;
  kabko: string;
  prov: string;
  jadwal: Record<string, JadwalEntry>;
}

export async function getJadwalToday(
  id: string,
  tz?: string,
): Promise<{ data: JadwalData; date: string; entry: JadwalEntry }> {
  const data = await muslimGet<JadwalData>(
    `/sholat/jadwal/${id}/today`,
    tz ? { tz } : undefined,
  );
  const dates = Object.keys(data.jadwal ?? {}).sort();
  const date = dates[0] ?? "";
  const entry = data.jadwal?.[date];
  if (!entry) {
    throw new MuslimApiError("Jadwal sholat untuk hari ini tidak tersedia.", 404);
  }
  return { data, date, entry };
}

export interface CalendarDateInfo {
  today: string;
  day: number;
  dayName: string;
  month: number;
  monthName: string;
  year: number;
}

export interface CalendarData {
  method: string;
  adjustment: number;
  ce: CalendarDateInfo;
  hijr: CalendarDateInfo;
}

export function getCalendarToday() {
  return muslimGet<CalendarData>("/cal/today");
}

export function convertDate(date: string, to: "hijr" | "ce") {
  const endpoint = to === "hijr" ? "/cal/hijr" : "/cal/ce";
  return muslimGet<CalendarData>(`${endpoint}/${date}`);
}

export interface QiblaData {
  latitude: number;
  longitude: number;
  direction: number;
}

export function getQiblaDirection(latitude: number, longitude: number) {
  return muslimGet<QiblaData>(
    `/qibla/${latitude.toFixed(6)},${longitude.toFixed(6)}`,
  );
}
