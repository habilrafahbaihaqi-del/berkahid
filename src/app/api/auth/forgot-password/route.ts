import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

const anon = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

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

  const { email } = body as Record<string, unknown>;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Masukkan alamat email yang valid." },
      { status: 400 },
    );
  }

  // Selalu mengembalikan sukses untuk mencegah enumerasi akun.
  const { error } = await anon.auth.sendResetPasswordEmail({
    email: email.trim().toLowerCase(),
  });

  if (error) {
    console.warn("[auth] sendResetPasswordEmail:", JSON.stringify(error));
  }

  return NextResponse.json({ sent: true });
}
