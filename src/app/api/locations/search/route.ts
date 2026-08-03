import { NextRequest, NextResponse } from "next/server";
import { CITIES } from "@/data/cities";

export const dynamic = "force-dynamic";

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = normalize(searchParams.get("q") ?? "");
  const rawLimit = Number(searchParams.get("limit") ?? 8);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 20)
    : 8;

  const results = q
    ? CITIES.filter((c) =>
        normalize(`${c.city} ${c.district} ${c.province}`).includes(q),
      ).slice(0, limit)
    : CITIES.slice(0, limit);

  return NextResponse.json({
    results: results.map(({ city, district, province, latitude, longitude }) => ({
      city,
      district,
      province,
      latitude,
      longitude,
    })),
    query: q,
    limit,
  });
}
