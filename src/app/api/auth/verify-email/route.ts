import { NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/email-verification";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const { token } = body as Record<string, unknown>;
  if (typeof token !== "string" || token.trim().length === 0) {
    return NextResponse.json(
      { error: "Field \"token\" wajib diisi." },
      { status: 400 },
    );
  }

  const result = await verifyVerificationToken(token);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    verified: true,
    alreadyVerified: result.alreadyVerified,
    userId: result.userId,
  });
}
