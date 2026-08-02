import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
}

interface DoaRow {
  id: string;
  title: string;
  arabic_text: string;
  translation: string;
  category_id: string | null;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ doaId: string }> },
) {
  const { doaId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      doaId,
    )
  ) {
    return NextResponse.json({ error: "ID doa tidak valid." }, { status: 400 });
  }

  const { data: rows, error } = await insforge.database
    .from("doas")
    .select("id, title, arabic_text, translation, category_id")
    .eq("id", doaId);

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat detail doa." },
      { status: 500 },
    );
  }

  const row = ((rows ?? []) as unknown as DoaRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Doa tidak ditemukan." }, { status: 404 });
  }

  let slug = "";
  let categoryName = "";
  if (row.category_id) {
    const { data: categoryRows, error: categoryError } = await insforge.database
      .from("doa_categories")
      .select("id, slug, name")
      .eq("id", row.category_id);
    if (!categoryError) {
      const category = ((categoryRows ?? []) as unknown as CategoryRow[])[0];
      slug = category?.slug ?? "";
      categoryName = category?.name ?? "";
    }
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    arabicText: row.arabic_text,
    translation: row.translation,
    category: slug,
    categoryName,
  });
}
