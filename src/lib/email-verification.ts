"use server";

import { createAdminClient } from "@insforge/sdk";

interface VerificationRow {
  id: string;
  user_id: string;
  email_verified: boolean;
  verification_token: string | null;
  token_expires_at: string | null;
}

export type VerifyResult =
  | { ok: true; alreadyVerified: boolean; userId: string }
  | { ok: false; error: string };

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

export async function verifyVerificationToken(
  token: string,
): Promise<VerifyResult> {
  const { data: rows, error: selectError } = await admin.database
    .from("user_verifications")
    .select(
      "id, user_id, email_verified, verification_token, token_expires_at",
    )
    .eq("verification_token", token.trim());

  if (selectError) {
    return { ok: false, error: "Gagal memverifikasi token." };
  }

  const row = ((rows ?? []) as unknown as VerificationRow[])[0];
  if (!row) {
    return { ok: false, error: "Token verifikasi tidak valid." };
  }

  if (row.email_verified) {
    return { ok: true, alreadyVerified: true, userId: row.user_id };
  }

  if (
    row.token_expires_at &&
    new Date(row.token_expires_at).getTime() < Date.now()
  ) {
    return {
      ok: false,
      error:
        "Token verifikasi sudah kedaluwarsa. Kirim ulang email verifikasi.",
    };
  }

  const { error: updateError } = await admin.database
    .from("user_verifications")
    .update({
      email_verified: true,
      verification_token: null,
      token_expires_at: null,
      verified_at: new Date().toISOString(),
    })
    .eq("id", row.id);

  if (updateError) {
    return { ok: false, error: "Gagal memperbarui status verifikasi." };
  }

  return { ok: true, alreadyVerified: false, userId: row.user_id };
}
