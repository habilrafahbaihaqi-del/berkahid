import { NextRequest, NextResponse } from "next/server";
import {
  getCalendarToday,
  getJadwalToday,
  findKabkotaId,
  MuslimApiError,
} from "@/lib/muslim-api";

export const dynamic = "force-dynamic";

const ALADHAN_API = "https://api.aladhan.com/v1/timings";
const PRAYER_METHOD = 20; // KEMENAG Indonesia

interface AladhanTimings {
  Imsak?: string;
  Fajr?: string;
  Syuruk?: string;
  Dhuhr?: string;
  Asr?: string;
  Maghrib?: string;
  Isha?: string;
}

function parseCoordinate(raw: string | null, name: string, min: number, max: number) {
  if (!raw) {
    return { error: `Parameter "${name}" wajib diisi.` };
  }
  const value = Number(raw);
  if (!Number.isFinite(value) || value < min || value > max) {
    return { error: `Parameter "${name}" harus angka antara ${min} dan ${max}.` };
  }
  return { value };
}

function parseDate(raw: string | null) {
  if (!raw) return { value: undefined };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { error: "Parameter \"date\" harus berformat YYYY-MM-DD." };
  }
  return { value: raw };
}

async function fetchFromMyQuran(
  latitude: number,
  longitude: number,
  tz?: string,
  lokasi?: string,
) {
  const kabkota = await findKabkotaId(latitude, longitude, lokasi);
  if (!kabkota) return null;

  const { data, date, entry } = await getJadwalToday(kabkota.id, tz);

  let hijri: string | null = null;
  try {
    const calendar = await getCalendarToday();
    hijri = calendar.hijr.today;
  } catch {
    hijri = null;
  }

  return {
    source: "myquran" as const,
    location: {
      id: data.id,
      kabko: data.kabko,
      prov: data.prov,
      latitude,
      longitude,
    },
    date: date || null,
    hijri,
    timings: {
      imsak: entry.imsak,
      subuh: entry.subuh,
      terbit: entry.terbit,
      dhuha: entry.dhuha,
      dzuhur: entry.dzuhur,
      ashar: entry.ashar,
      maghrib: entry.maghrib,
      isya: entry.isya,
    },
  };
}

async function fetchFromAladhan(
  latitude: number,
  longitude: number,
  date: string | undefined,
) {
  const url = new URL(ALADHAN_API);
  if (date) {
    url.pathname = `${url.pathname}/${date}`;
  }
  url.searchParams.set("latitude", latitude.toFixed(6));
  url.searchParams.set("longitude", longitude.toFixed(6));
  url.searchParams.set("method", String(PRAYER_METHOD));

  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new MuslimApiError(
      `Layanan jadwal sholat mengembalikan error (${response.status}).`,
      502,
    );
  }

  const payload = (await response.json()) as {
    data?: {
      timings?: AladhanTimings;
      date?: {
        hijri?: { day?: string; month?: { en?: string }; year?: string };
      };
    };
  };
  const timings = payload.data?.timings;
  if (!timings) {
    throw new MuslimApiError("Respons layanan jadwal sholat tidak valid.", 502);
  }

  const normalize = (value: string | undefined, fallback: string) =>
    value?.slice(0, 5) ?? fallback;

  const hijri = payload.data?.date?.hijri;
  const hijriLabel =
    hijri?.day && hijri?.month?.en && hijri?.year
      ? `${hijri.day} ${hijri.month.en} ${hijri.year} H`
      : null;

  return {
    source: "aladhan" as const,
    location: { latitude, longitude },
    date: date ?? null,
    hijri: hijriLabel,
    timings: {
      imsak: normalize(timings.Imsak, "04:20"),
      subuh: normalize(timings.Fajr, "04:30"),
      terbit: normalize(timings.Syuruk, "05:45"),
      dhuha: "--:--",
      dzuhur: normalize(timings.Dhuhr, "11:45"),
      ashar: normalize(timings.Asr, "15:05"),
      maghrib: normalize(timings.Maghrib, "17:50"),
      isya: normalize(timings.Isha, "19:00"),
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latitude = parseCoordinate(searchParams.get("lat"), "lat", -90, 90);
  if ("error" in latitude) {
    return NextResponse.json({ error: latitude.error }, { status: 400 });
  }
  const longitude = parseCoordinate(searchParams.get("lon"), "lon", -180, 180);
  if ("error" in longitude) {
    return NextResponse.json({ error: longitude.error }, { status: 400 });
  }
  const date = parseDate(searchParams.get("date"));
  if ("error" in date) {
    return NextResponse.json({ error: date.error }, { status: 400 });
  }
  const tz = searchParams.get("tz") ?? undefined;
  const lokasi = searchParams.get("lokasi")?.trim() || undefined;

  if (!date.value) {
    try {
      const result = await fetchFromMyQuran(
        latitude.value,
        longitude.value,
        tz,
        lokasi,
      );
      if (result) {
        return NextResponse.json(result);
      }
    } catch {
      // Gagal lewat myquran — coba sumber cadangan
    }
  }

  try {
    const result = await fetchFromAladhan(latitude.value, longitude.value, date.value);
    return NextResponse.json(result);
  } catch (error) {
    const status = error instanceof MuslimApiError ? error.status : 502;
    const message =
      error instanceof MuslimApiError
        ? error.message
        : "Gagal menghubungi layanan jadwal sholat. Coba lagi nanti.";
    return NextResponse.json({ error: message }, { status });
  }
}
