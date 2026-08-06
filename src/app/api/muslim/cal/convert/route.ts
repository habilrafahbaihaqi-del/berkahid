import { NextRequest, NextResponse } from "next/server";
import { convertDate, MuslimApiError } from "@/lib/muslim-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const date = searchParams.get("date");
  const to = searchParams.get("to");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Parameter \"date\" wajib diisi berformat YYYY-MM-DD." },
      { status: 400 },
    );
  }
  if (to !== "hijr" && to !== "ce") {
    return NextResponse.json(
      { error: "Parameter \"to\" harus bernilai \"hijr\" (Masehi ke Hijriyah) atau \"ce\" (Hijriyah ke Masehi)." },
      { status: 400 },
    );
  }

  try {
    const calendar = await convertDate(date, to);
    return NextResponse.json({ source: "myquran", to, data: calendar });
  } catch (error) {
    const status = error instanceof MuslimApiError ? error.status : 502;
    return NextResponse.json(
      { error: error instanceof MuslimApiError ? error.message : "Gagal mengonversi tanggal." },
      { status },
    );
  }
}
