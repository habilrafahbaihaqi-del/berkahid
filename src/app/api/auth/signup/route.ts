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

  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { error: "Masukkan alamat email yang valid." },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || !PASSWORD_RULE.test(password)) {
    return NextResponse.json(
      {
        error:
          "Kata sandi minimal 8 karakter dan harus kombinasi huruf dan angka.",
      },
      { status: 400 },
    );
  }

  const { data, error } = await anon.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    // Setelah verifikasi melalui tautan di email, user diarahkan ke halaman
    // callback aplikasi (allowlisted di auth.allowed_redirect_urls).
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/verifikasi-email/callback`,
  });

  if (error) {
    const status =
      "statusCode" in error &&
      (error as { statusCode?: number }).statusCode === 409
        ? 409
        : 400;
    return NextResponse.json(
      {
        error:
          status === 409
            ? "Email sudah terdaftar. Silakan masuk."
            : (error.message ?? "Gagal membuat akun."),
      },
      { status },
    );
  }

  // InsForge mengirim email verifikasi (kode/link) pada pendaftaran saat SMTP
  // dikonfigurasi. Login otomatis diblokir hingga email diverifikasi (sesuai PRD).
  return NextResponse.json(
    {
      user: { email: email.trim().toLowerCase() },
      requireEmailVerification: data?.requireEmailVerification ?? false,
    },
    { status: 201 },
  );
}
