import { NextResponse } from "next/server";
import { createAdminClient } from "@insforge/sdk";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

interface ProfileRow {
  user_id: string;
  role: string;
}

const admin = createAdminClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  apiKey: process.env.INSFORGE_API_KEY ?? "",
});

export async function GET() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();

  if (error || !data?.user) {
    return NextResponse.json({ user: null });
  }

  let role = "user";
  const { data: rows } = await admin.database
    .from("user_profiles")
    .select("user_id, role")
    .eq("user_id", data.user.id);

  const profile = ((rows ?? []) as unknown as ProfileRow[])[0];
  if (profile) role = profile.role;

  return NextResponse.json({
    user: {
      id: data.user.id,
      email: data.user.email,
      role,
    },
  });
}
