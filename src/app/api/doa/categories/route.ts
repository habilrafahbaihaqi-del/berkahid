import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface CategoryRow {
  slug: string;
  name: string;
  description: string | null;
  doas: { count: number } | { count: number }[];
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET() {
  const { data, error } = await insforge.database
    .from("doa_categories")
    .select("slug, name, description, doas(count)")
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat kategori doa." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as unknown as CategoryRow[]).map((row) => {
    const count = Array.isArray(row.doas) ? row.doas[0] : row.doas;
    return {
      slug: row.slug,
      name: row.name,
      description: row.description ?? "",
      count: count?.count ?? 0,
    };
  });

  return NextResponse.json({ results });
}
