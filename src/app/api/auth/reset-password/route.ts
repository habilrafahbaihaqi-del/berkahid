import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

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

  const { email, code, newPassword } = body as Record<string, unknown>;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Masukkan alamat email yang valid." },
      { status: 400 },
    );
  }
  if (typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json(
      { error: "Kode verifikasi wajib diisi." },
      { status: 400 },
    );
  }
  if (typeof newPassword !== "string" || !PASSWORD_RULE.test(newPassword)) {
    return NextResponse.json(
      {
        error:
          "Kata sandi minimal 8 karakter dan harus kombinasi huruf dan angka.",
      },
      { status: 400 },
    );
  }

  const emailNormalized = email.trim().toLowerCase();

  const { data: exchange, error: exchangeError } =
    await anon.auth.exchangeResetPasswordToken({
      email: emailNormalized,
      code: code.trim(),
    });

  if (exchangeError || !exchange) {
    return NextResponse.json(
      { error: "Kode verifikasi tidak valid atau sudah kedaluwarsa." },
      { status: 400 },
    );
  }

  const { error: resetError } = await anon.auth.resetPassword({
    newPassword,
    otp: exchange.token,
  });

  if (resetError) {
    return NextResponse.json(
      { error: "Gagal mengatur ulang kata sandi. Coba lagi." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
