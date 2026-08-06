import { NextRequest, NextResponse } from "next/server";
import { listKabupaten, toIndonesiaErrorResponse } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const provinsiId = request.nextUrl.searchParams.get("provinsi_id") ?? undefined;
  try {
    const regencies = await listKabupaten(provinsiId);
    return NextResponse.json({
      results: regencies.map((k) => ({
        id: k.id,
        name: k.name ?? k.alt_name,
        isCity: k.is_city === 1,
        latitude: k.lat ?? null,
        longitude: k.lng ?? null,
      })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
