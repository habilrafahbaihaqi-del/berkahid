import { NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/email-verification";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(
      new URL("/verifikasi-email?error=missing_token", request.url),
    );
  }

  const result = await verifyVerificationToken(token);

  if (!result.ok) {
    return NextResponse.redirect(
      new URL(
        `/verifikasi-email?error=${encodeURIComponent(result.error)}`,
        request.url,
      ),
    );
  }

  return NextResponse.redirect(new URL("/verifikasi-berhasil", request.url));
}
