import { NextRequest, NextResponse } from "next/server";
import { getQiblaDirection, MuslimApiError } from "@/lib/muslim-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latitude = Number(searchParams.get("lat"));
  const longitude = Number(searchParams.get("lon"));

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return NextResponse.json(
      { error: "Parameter \"lat\" harus angka antara -90 dan 90." },
      { status: 400 },
    );
  }
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: "Parameter \"lon\" harus angka antara -180 dan 180." },
      { status: 400 },
    );
  }

  try {
    const qibla = await getQiblaDirection(latitude, longitude);
    return NextResponse.json({ source: "myquran", data: qibla });
  } catch (error) {
    const status = error instanceof MuslimApiError ? error.status : 502;
    return NextResponse.json(
      { error: error instanceof MuslimApiError ? error.message : "Gagal menghitung arah kiblat." },
      { status },
    );
  }
}
