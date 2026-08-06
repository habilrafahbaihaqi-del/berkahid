import { NextRequest, NextResponse } from "next/server";
import { searchKodePos, toIndonesiaErrorResponse } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Kata kunci minimal 2 karakter." } },
      { status: 400 },
    );
  }
  try {
    const items = await searchKodePos(q);
    return NextResponse.json({
      results: items.map((item) => ({
        postalCode: item.postal_code,
        villageName: item.village_name,
        districtName: item.district_name ?? null,
        regencyName: item.regency_name ?? null,
        provinceName: item.province_name ?? null,
      })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
