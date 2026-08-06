import { NextRequest, NextResponse } from "next/server";
import { listKecamatan, toIndonesiaErrorResponse } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const kabupatenId = request.nextUrl.searchParams.get("kabupaten_id") ?? "";
  if (!kabupatenId) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Parameter \"kabupaten_id\" wajib diisi." } },
      { status: 400 },
    );
  }
  try {
    const districts = await listKecamatan(kabupatenId);
    return NextResponse.json({
      results: districts.map((d) => ({
        id: d.id,
        name: d.name ?? d.alt_name,
        latitude: d.lat ?? null,
        longitude: d.lng ?? null,
      })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
