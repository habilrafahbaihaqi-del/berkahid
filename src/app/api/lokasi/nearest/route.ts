import { NextRequest, NextResponse } from "next/server";
import {
  findNearestKabupaten,
  listProvinsi,
} from "@/lib/api-indonesia";
import { findNearestLocation } from "@/data/cities";

export const dynamic = "force-dynamic";

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

  try {
    const regency = await findNearestKabupaten(latitude.value, longitude.value);
    if (!regency) throw new Error("Tidak ada kabupaten terdekat.");

    const provinces = await listProvinsi();
    const province = regency.province_id
      ? provinces.find((p) => p.id === regency.province_id)
      : undefined;

    return NextResponse.json({
      source: "api-indonesia",
      location: {
        id: regency.id,
        city: regency.name ?? regency.alt_name ?? regency.id,
        district: "",
        province: province?.name ?? province?.alt_name ?? "",
        latitude: latitude.value,
        longitude: longitude.value,
      },
    });
  } catch {
    // Cadangan: daftar kota statis lokal
    const location = findNearestLocation(latitude.value, longitude.value);
    return NextResponse.json({
      source: "nearest-city",
      location: {
        city: location.city,
        district: location.district,
        province: location.province,
        latitude: latitude.value,
        longitude: longitude.value,
      },
    });
  }
}
