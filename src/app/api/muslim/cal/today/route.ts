import { NextResponse } from "next/server";
import { getCalendarToday, MuslimApiError } from "@/lib/muslim-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const calendar = await getCalendarToday();
    return NextResponse.json({ source: "myquran", data: calendar });
  } catch (error) {
    const status = error instanceof MuslimApiError ? error.status : 502;
    return NextResponse.json(
      { error: error instanceof MuslimApiError ? error.message : "Gagal memuat kalender." },
      { status },
    );
  }
}
