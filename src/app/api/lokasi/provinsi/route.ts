import { NextResponse } from "next/server";
import { listProvinsi, toIndonesiaErrorResponse } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const provinces = await listProvinsi();
    return NextResponse.json({
      results: provinces.map((p) => ({ id: p.id, name: p.name ?? p.alt_name })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
