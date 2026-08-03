import { createAdminClient } from "@insforge/sdk";
import { NextResponse } from "next/server";
import { createInsForgeServerClient } from "@/lib/insforge/server";

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

interface ProfileRow {
  role: string;
}

export type AdminSession = { userId: string } | NextResponse;

export async function requireAdmin(): Promise<AdminSession> {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json(
      { error: "Tidak terautentikasi." },
      { status: 401 },
    );
  }

  const { data: rows } = await admin.database
    .from("user_profiles")
    .select("role")
    .eq("user_id", data.user.id);

  const profile = ((rows ?? []) as unknown as ProfileRow[])[0];
  if (profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Akses ditolak. Peran admin diperlukan." },
      { status: 403 },
    );
  }

  return { userId: data.user.id };
}

export { admin as adminClient };
