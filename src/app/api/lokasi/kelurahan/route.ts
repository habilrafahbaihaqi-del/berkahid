import { NextRequest, NextResponse } from "next/server";
import { listKelurahan, toIndonesiaErrorResponse } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const kecamatanId = request.nextUrl.searchParams.get("kecamatan_id") ?? "";
  if (!kecamatanId) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Parameter \"kecamatan_id\" wajib diisi." } },
      { status: 400 },
    );
  }
  try {
    const villages = await listKelurahan(kecamatanId);
    return NextResponse.json({
      results: villages.map((v) => ({
        id: v.id,
        name: v.name ?? v.alt_name,
        postalCode: v.postal_code ?? null,
      })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
