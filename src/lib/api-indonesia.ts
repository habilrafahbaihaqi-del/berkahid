import { NextResponse } from "next/server";

const API_INDONESIA = "https://use.apiindonesia.id/api/v1";

export class IndonesiaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "IndonesiaApiError";
  }
}

export function toIndonesiaErrorResponse(error: unknown) {
  if (error instanceof IndonesiaApiError) {
    return NextResponse.json(
      { error: { code: error.code ?? "API_ERROR", message: error.message } },
      { status: error.status },
    );
  }
  return NextResponse.json(
    { error: { code: "INTERNAL_ERROR", message: "Terjadi kesalahan tak terduga." } },
    { status: 500 },
  );
}

interface Envelope<T> {
  data?: T;
  meta?: { total?: number; page?: number; per_page?: number; total_pages?: number };
  error?: { code?: string; message?: string };
}

export async function indonesiaGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
  options?: { raw?: boolean },
): Promise<T> {
  const apiKey = process.env.API_INDONESIA_KEY;
  if (!apiKey) {
    throw new IndonesiaApiError("API key API Indonesia belum dikonfigurasi.", 500);
  }

  const url = new URL(`${API_INDONESIA}${path}`);
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
      headers: {
        Accept: "application/json",
        "x-api-key": apiKey,
      },
    });
  } catch {
    throw new IndonesiaApiError("Gagal menghubungi layanan API Indonesia.", 502);
  }

  const payload = (await response.json().catch(() => null)) as Envelope<T> | null;

  if (!response.ok || payload?.error) {
    const error = payload?.error;
    throw new IndonesiaApiError(
      error?.message ?? `API Indonesia mengembalikan error (${response.status}).`,
      response.status,
      error?.code,
    );
  }

  if (options?.raw) {
    return payload as unknown as T;
  }

  if (payload?.data === undefined) {
    throw new IndonesiaApiError("Respons API Indonesia tidak valid.", 502);
  }

  return payload.data;
}

export interface Province {
  id: string;
  code: string;
  name: string;
  alt_name?: string;
  lat?: number | null;
  lng?: number | null;
  is_active?: number;
}

export interface Regency {
  id: string;
  province_id?: string;
  code?: string;
  name: string;
  alt_name?: string;
  is_city?: number;
  lat?: number | null;
  lng?: number | null;
  is_active?: number;
}

export interface District {
  id: string;
  regency_id?: string;
  code?: string;
  name: string;
  alt_name?: string;
  lat?: number | null;
  lng?: number | null;
  is_active?: number;
}

export interface Village {
  id: string;
  district_id?: string;
  code?: string;
  name: string;
  alt_name?: string;
  postal_code?: string;
  lat?: number | null;
  lng?: number | null;
  is_active?: number;
}

export type WilayahLevel = "provinsi" | "kabupaten" | "kecamatan" | "kelurahan";

export interface WilayahSearchItem {
  id: string;
  name: string;
  alt_name?: string;
  level: WilayahLevel;
}

export interface PostalCodeItem {
  postal_code: string;
  village_name: string;
  district_name?: string;
  regency_name?: string;
  province_name?: string;
}

export interface Holiday {
  id: string;
  date: string;
  name: string;
  type?: string;
  is_joint_leave?: number;
  source?: string;
  year?: number;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  savedAt: number;
  value: T;
}

function makeCache<T>() {
  let entry: CacheEntry<T> | null = null;
  return {
    get(): T | null {
      if (entry && Date.now() - entry.savedAt < CACHE_TTL_MS) {
        return entry.value;
      }
      return null;
    },
    set(value: T) {
      entry = { savedAt: Date.now(), value };
    },
  };
}

const provinceCache = makeCache<Province[]>();
const kabupatenCache = makeCache<Regency[]>();
const provinceNameCache = makeCache<Map<string, string>>();

async function fetchAllPages<T>(
  path: string,
  perPage = 100,
): Promise<T[]> {
  const first = await indonesiaGet<{ data: T[]; meta: { total_pages?: number } }>(
    path,
    { page: 1, per_page: perPage },
    { raw: true },
  );
  const items = [...(first.data ?? [])];
  const totalPages = first.meta?.total_pages ?? 1;
  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        indonesiaGet<{ data: T[] }>(
          path,
          { page: i + 2, per_page: perPage },
          { raw: true },
        ),
      ),
    );
    for (const page of rest) {
      items.push(...(page.data ?? []));
    }
  }
  return items;
}

export async function listProvinsi(): Promise<Province[]> {
  const cached = provinceCache.get();
  if (cached) return cached;
  const provinces = await fetchAllPages<Province>("/wilayah/provinsi");
  provinceCache.set(provinces);
  provinceNameCache.set(
    new Map(provinces.map((p) => [p.id, p.name ?? p.alt_name ?? p.id])),
  );
  return provinces;
}

export async function getKabupatenList(): Promise<Regency[]> {
  const cached = kabupatenCache.get();
  if (cached) return cached;
  const regencies = await fetchAllPages<Regency>("/wilayah/kabupaten");
  kabupatenCache.set(regencies);
  return regencies;
}

export function provinceNameById(id: string): string | null {
  return provinceNameCache.get()?.get(id) ?? null;
}

export async function listKabupaten(provinsiId?: string): Promise<Regency[]> {
  const all = await getKabupatenList();
  return provinsiId ? all.filter((k) => k.province_id === provinsiId) : all;
}

export async function listKecamatan(kabupatenId: string): Promise<District[]> {
  return indonesiaGet<District[]>("/wilayah/kecamatan", { kabupaten_id: kabupatenId });
}

export async function listKelurahan(kecamatanId: string): Promise<Village[]> {
  return indonesiaGet<Village[]>("/wilayah/kelurahan", { kecamatan_id: kecamatanId });
}

export async function searchWilayah(
  q: string,
  perPage = 20,
): Promise<WilayahSearchItem[]> {
  return indonesiaGet<WilayahSearchItem[]>("/wilayah/search", { q, per_page: perPage });
}

export async function searchKodePos(q: string): Promise<PostalCodeItem[]> {
  return indonesiaGet<PostalCodeItem[]>("/kodepos/search", { q, per_page: 20 });
}

export async function upcomingHolidays(): Promise<Holiday[]> {
  return indonesiaGet<Holiday[]>("/libur/upcoming");
}

export async function listHolidays(year?: number): Promise<Holiday[]> {
  return indonesiaGet<Holiday[]>("/libur", year ? { tahun: year } : undefined);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function findNearestKabupaten(latitude: number, longitude: number): Promise<Regency | null> {
  const regencies = await getKabupatenList();
  let nearest: Regency | null = null;
  let nearestDistance = Infinity;
  for (const regency of regencies) {
    if (regency.lat == null || regency.lng == null) continue;
    const distance = haversineKm(latitude, longitude, regency.lat, regency.lng);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearest = regency;
    }
  }
  return nearest;
}

export async function resolveWilayahDetail(level: WilayahLevel, id: string) {
  let name = id;
  let lat: number | null = null;
  let lng: number | null = null;
  let provinceName: string | null = null;
  let regencyName: string | null = null;
  let districtName: string | null = null;
  let postalCode: string | null = null;

  const provinsi = await listProvinsi();

  if (level === "provinsi") {
    const item = provinsi.find((p) => p.id === id);
    if (item) {
      name = item.name ?? item.alt_name ?? id;
      lat = item.lat ?? null;
      lng = item.lng ?? null;
    }
  } else if (level === "kabupaten") {
    const item = await indonesiaGet<Regency>(`/wilayah/kabupaten/${id}`);
    name = item.name ?? item.alt_name ?? id;
    lat = item.lat ?? null;
    lng = item.lng ?? null;
    provinceName = item.province_id
      ? (provinsi.find((p) => p.id === item.province_id)?.name ?? null)
      : null;
  } else if (level === "kecamatan") {
    const item = await indonesiaGet<District>(`/wilayah/kecamatan/${id}`);
    name = item.name ?? item.alt_name ?? id;
    lat = item.lat ?? null;
    lng = item.lng ?? null;
    if (item.regency_id) {
      try {
        const regency = await indonesiaGet<Regency>(`/wilayah/kabupaten/${item.regency_id}`);
        regencyName = regency.name ?? regency.alt_name ?? null;
        provinceName = regency.province_id
          ? (provinsi.find((p) => p.id === regency.province_id)?.name ?? null)
          : null;
      } catch {
        // nama induk opsional
      }
    }
  } else if (level === "kelurahan") {
    const item = await indonesiaGet<Village>(`/wilayah/kelurahan/${id}`);
    name = item.name ?? item.alt_name ?? id;
    lat = item.lat ?? null;
    lng = item.lng ?? null;
    postalCode = item.postal_code ?? null;
    if (item.district_id) {
      try {
        const district = await indonesiaGet<District>(`/wilayah/kecamatan/${item.district_id}`);
        districtName = district.name ?? district.alt_name ?? null;
        if (district.regency_id) {
          const regency = await indonesiaGet<Regency>(`/wilayah/kabupaten/${district.regency_id}`);
          regencyName = regency.name ?? regency.alt_name ?? null;
          provinceName = regency.province_id
            ? (provinsi.find((p) => p.id === regency.province_id)?.name ?? null)
            : null;
        }
      } catch {
        // nama induk opsional
      }
    }
  }

  return { name, lat, lng, provinceName, regencyName, districtName, postalCode };
}
