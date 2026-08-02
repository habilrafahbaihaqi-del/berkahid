import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface ZikrRow {
  id: string;
  name: string;
  arabic_text: string;
  meaning: string;
  explanation: string;
  category_id: string | null;
}

interface CategoryRow {
  id: string;
  name: string;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ zikrId: string }> },
) {
  const { zikrId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      zikrId,
    )
  ) {
    return NextResponse.json(
      { error: "ID zikir tidak valid." },
      { status: 400 },
    );
  }

  const { data: rows, error } = await insforge.database
    .from("zikrs")
    .select("id, name, arabic_text, meaning, explanation, category_id")
    .eq("id", zikrId);

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat detail zikir." },
      { status: 500 },
    );
  }

  const row = ((rows ?? []) as unknown as ZikrRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Zikir tidak ditemukan." }, { status: 404 });
  }

  let category = "Lainnya";
  if (row.category_id) {
    const { data: categoryRows, error: categoryError } = await insforge.database
      .from("zikr_categories")
      .select("id, name")
      .eq("id", row.category_id);
    if (!categoryError) {
      category = ((categoryRows ?? []) as unknown as CategoryRow[])[0]?.name ?? "Lainnya";
    }
  }

  return NextResponse.json({
    id: row.id,
    name: row.name,
    arabicText: row.arabic_text,
    meaning: row.meaning,
    explanation: row.explanation,
    category,
  });
}
