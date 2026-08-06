import { NextRequest, NextResponse } from "next/server";
import { listHolidays, toIndonesiaErrorResponse, upcomingHolidays } from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const rawYear = request.nextUrl.searchParams.get("tahun");
  const year = rawYear ? Number(rawYear) : null;
  if (rawYear && (!Number.isInteger(year) || (year as number) < 1900 || (year as number) > 2100)) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Parameter \"tahun\" tidak valid." } },
      { status: 400 },
    );
  }

  try {
    const holidays = year ? await listHolidays(year) : await upcomingHolidays();
    return NextResponse.json({
      source: "api-indonesia",
      results: holidays.map((h) => ({
        date: h.date,
        name: h.name,
        type: h.type ?? null,
        isJointLeave: h.is_joint_leave === 1,
      })),
    });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
