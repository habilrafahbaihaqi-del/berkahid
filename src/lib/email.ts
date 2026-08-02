"use server";

import { createAdminClient } from "@insforge/sdk";

export interface SendVerificationEmailInput {
  to: string;
  verificationUrl: string;
}

export interface SendVerificationEmailResult {
  sent: boolean;
  simulated: boolean;
}

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

function buildVerificationHtml(verificationUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f3faf7; border-radius: 16px; color: #064e3b;">
      <h2 style="margin: 0 0 12px; color: #065f46;">BerkahID — Verifikasi Email</h2>
      <p style="line-height: 1.6; color: #065f46;">Assalamu'alaikum,</p>
      <p style="line-height: 1.6; color: #065f46;">
        Terima kasih telah mendaftar di BerkahID. Untuk mengaktifkan akunmu,
        klik tombol di bawah ini:
      </p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${verificationUrl}" style="display: inline-block; background: #10b981; color: #ffffff; padding: 12px 28px; border-radius: 12px; text-decoration: none; font-weight: bold;">
          Verifikasi Email
        </a>
      </p>
      <p style="line-height: 1.6; color: #065f46;">
        Atau salin tautan berikut ke browser:
      </p>
      <p style="line-height: 1.6; word-break: break-all; color: #047857; font-size: 12px;">
        ${verificationUrl}
      </p>
      <p style="line-height: 1.6; color: #065f46;">
        Tautan berlaku selama 24 jam. Jika kamu tidak mendaftar, abaikan email ini.
      </p>
    </div>
  `;
}

export async function sendVerificationEmail({
  to,
  verificationUrl,
}: SendVerificationEmailInput): Promise<SendVerificationEmailResult> {
  try {
    const { error } = await admin.emails.send({
      to,
      subject: "Verifikasi email akun BerkahID",
      html: buildVerificationHtml(verificationUrl),
    });

    if (error) {
      console.warn(
        "[email] Gagal mengirim verifikasi, fallback simulasi:",
        JSON.stringify(error),
      );
      return { sent: true, simulated: true };
    }
    return { sent: true, simulated: false };
  } catch (error) {
    console.warn("[email] Exception pengiriman, fallback simulasi:", error);
    return { sent: true, simulated: true };
  }
}
