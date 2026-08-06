import { NextResponse } from "next/server";
import {
  resolveWilayahDetail,
  toIndonesiaErrorResponse,
  type WilayahLevel,
} from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

const LEVELS: WilayahLevel[] = ["provinsi", "kabupaten", "kecamatan", "kelurahan"];

export async function GET(
  _request: Request,
  context: { params: Promise<{ level: string; id: string }> },
) {
  const { level, id } = await context.params;
  if (!LEVELS.includes(level as WilayahLevel)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Tingkat wilayah tidak valid." } },
      { status: 400 },
    );
  }
  if (!/^\d{2,13}$/.test(id)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Kode wilayah tidak valid." } },
      { status: 400 },
    );
  }

  try {
    const detail = await resolveWilayahDetail(level as WilayahLevel, id);
    return NextResponse.json({ detail });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
