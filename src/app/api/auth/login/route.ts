import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@insforge/sdk";
import { createAuthActions } from "@insforge/sdk/ssr";

export const dynamic = "force-dynamic";

interface ProfileRow {
  user_id: string;
  role: string;
}

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

async function ensureUserProfile(userId: string): Promise<string> {
  const { data: rows, error } = await admin.database
    .from("user_profiles")
    .select("user_id, role")
    .eq("user_id", userId);

  if (!error) {
    const existing = ((rows ?? []) as unknown as ProfileRow[])[0];
    if (existing) return existing.role;
  }

  const { data: inserted, error: insertError } = await admin.database
    .from("user_profiles")
    .insert([{ user_id: userId, role: "user" }])
    .select("role");

  if (!insertError) {
    const row = ((inserted ?? []) as unknown as ProfileRow[])[0];
    if (row) return row.role;
  }

  return "user";
}

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
  if (typeof email !== "string" || email.trim().length === 0) {
    return NextResponse.json(
      { error: "Email wajib diisi." },
      { status: 400 },
    );
  }
  if (typeof password !== "string" || password.length === 0) {
    return NextResponse.json(
      { error: "Kata sandi wajib diisi." },
      { status: 400 },
    );
  }

  const response = NextResponse.json({});
  const auth = createAuthActions({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const { data, error } = await auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error || !data?.user) {
    const statusCode = error?.statusCode ?? 401;
    return NextResponse.json(
      {
        error:
          statusCode === 403
            ? "Email belum diverifikasi. Periksa kotak masukmu untuk tautan verifikasi."
            : "Email atau kata sandi salah.",
      },
      { status: statusCode === 403 ? 403 : 401 },
    );
  }

  const role = await ensureUserProfile(data.user.id);

  return NextResponse.json(
    {
      user: {
        id: data.user.id,
        email: data.user.email,
        role,
      },
    },
    { headers: response.headers },
  );
}
