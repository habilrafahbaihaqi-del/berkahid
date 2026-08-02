import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface CategoryRow {
  id: string;
  name: string;
}

interface ZikrRow {
  id: string;
  name: string;
  arabic_text: string;
  meaning: string;
  explanation: string;
  category_id: string | null;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const rawLimit = Number(searchParams.get("limit") ?? 50);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 200)
    : 50;

  const { data: categoryRows, error: categoryError } = await insforge.database
    .from("zikr_categories")
    .select("id, name");

  if (categoryError) {
    return NextResponse.json(
      { error: "Gagal memuat kategori zikir." },
      { status: 500 },
    );
  }

  const categoryNameById = new Map(
    ((categoryRows ?? []) as CategoryRow[]).map((row) => [row.id, row.name]),
  );

  let query = insforge.database
    .from("zikrs")
    .select("id, name, arabic_text, meaning, explanation, category_id");

  if (q) {
    query = query.or(
      `name.ilike.%${q}%,meaning.ilike.%${q}%,explanation.ilike.%${q}%`,
    );
  }

  const { data, error } = await query
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat daftar zikir." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as unknown as ZikrRow[])
    .map((row) => {
      const categoryName = row.category_id
        ? (categoryNameById.get(row.category_id) ?? "Lainnya")
        : "Lainnya";
      return {
        id: row.id,
        name: row.name,
        arabicText: row.arabic_text,
        meaning: row.meaning,
        explanation: row.explanation,
        category: categoryName,
      };
    })
    .filter((zikr) => !category || zikr.category === category);

  return NextResponse.json({
    results,
    query: q,
    category: category || null,
    limit,
  });
}
