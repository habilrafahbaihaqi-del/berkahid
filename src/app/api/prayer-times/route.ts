import { NextRequest, NextResponse } from "next/server";

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

  const url = new URL(ALADHAN_API);
  if (date.value) {
    url.pathname = `${url.pathname}/${date.value}`;
  }
  url.searchParams.set("latitude", latitude.value.toFixed(6));
  url.searchParams.set("longitude", longitude.value.toFixed(6));
  url.searchParams.set("method", String(PRAYER_METHOD));

  let response: Response;
  try {
    response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json" },
    });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghubungi layanan jadwal sholat. Coba lagi nanti." },
      { status: 502 },
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      { error: `Layanan jadwal sholat mengembalikan error (${response.status}).` },
      { status: 502 },
    );
  }

  const payload = (await response.json()) as {
    data?: { timings?: AladhanTimings; date?: { hijri?: { day?: string; month?: { en?: string }; year?: string } } };
  };
  const timings = payload.data?.timings;
  if (!timings) {
    return NextResponse.json(
      { error: "Respons layanan jadwal sholat tidak valid." },
      { status: 502 },
    );
  }

  const normalize = (value: string | undefined, fallback: string) =>
    value?.slice(0, 5) ?? fallback;

  const hijri = payload.data?.date?.hijri;
  const hijriLabel =
    hijri?.day && hijri?.month?.en && hijri?.year
      ? `${hijri.day} ${hijri.month.en} ${hijri.year} H`
      : null;

  return NextResponse.json({
    source: "aladhan",
    location: {
      latitude: latitude.value,
      longitude: longitude.value,
    },
    date: date.value ?? null,
    hijri: hijriLabel,
    timings: {
      imsak: normalize(timings.Imsak, "04:20"),
      subuh: normalize(timings.Fajr, "04:30"),
      terbit: normalize(timings.Syuruk, "05:45"),
      dzuhur: normalize(timings.Dhuhr, "11:45"),
      ashar: normalize(timings.Asr, "15:05"),
      maghrib: normalize(timings.Maghrib, "17:50"),
      isya: normalize(timings.Isha, "19:00"),
    },
  });
}
