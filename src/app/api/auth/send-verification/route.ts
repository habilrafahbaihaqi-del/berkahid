import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminClient } from "@insforge/sdk";
import { sendVerificationEmail } from "@/lib/email";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

interface VerificationRow {
  id: string;
  user_id: string;
  email_verified: boolean;
}

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

export async function POST() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const userId = data.user.id;
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  const { data: existing, error: existingError } = await admin.database
    .from("user_verifications")
    .select("id, user_id, email_verified")
    .eq("user_id", userId);

  if (existingError) {
    return NextResponse.json(
      { error: "Gagal memuat status verifikasi." },
      { status: 500 },
    );
  }

  const existingRow = ((existing ?? []) as unknown as VerificationRow[])[0];

  if (existingRow?.email_verified) {
    return NextResponse.json({
      sent: true,
      alreadyVerified: true,
    });
  }

  let resultError: unknown = null;
  if (existingRow) {
    const { error } = await admin.database
      .from("user_verifications")
      .update({ verification_token: token, token_expires_at: expiresAt })
      .eq("user_id", userId);
    resultError = error;
  } else {
    const { error } = await admin.database
      .from("user_verifications")
      .insert([
        {
          user_id: userId,
          verification_token: token,
          token_expires_at: expiresAt,
        },
      ]);
    resultError = error;
  }

  if (resultError) {
    return NextResponse.json(
      { error: "Gagal membuat token verifikasi." },
      { status: 500 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const verificationUrl = `${appUrl}/api/auth/verify-email-link?token=${token}`;

  const { simulated } = await sendVerificationEmail({
    to: data.user.email ?? "",
    verificationUrl,
  });

  return NextResponse.json({
    sent: true,
    simulated,
    ...(simulated && process.env.NODE_ENV !== "production"
      ? { devVerificationUrl: verificationUrl }
      : {}),
  });
}
