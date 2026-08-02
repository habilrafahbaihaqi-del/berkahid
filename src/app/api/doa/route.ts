import { NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const category = searchParams.get("category")?.trim() ?? "";

  const { data: categoryRows, error: categoryError } = await insforge.database
    .from("doa_categories")
    .select("id, slug, name");

  if (categoryError) {
    return NextResponse.json(
      { error: "Gagal memuat kategori doa." },
      { status: 500 },
    );
  }

  const categories = (categoryRows ?? []) as unknown as CategoryRow[];
  const slugById = new Map(categories.map((c) => [c.id, c.slug]));
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  let selectedCategory: CategoryRow | null = null;
  if (category) {
    selectedCategory = categories.find((c) => c.slug === category) ?? null;
    if (!selectedCategory) {
      return NextResponse.json(
        { error: "Kategori doa tidak ditemukan." },
        { status: 404 },
      );
    }
  }

  const { data, error } = await insforge.database
    .from("doas")
    .select("id, title, arabic_text, translation, category_id");

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat daftar doa." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as unknown as DoaRow[])
    .filter(
      (row) =>
        !selectedCategory || row.category_id === selectedCategory.id,
    )
    .map((row) => ({
      id: row.id,
      title: row.title,
      arabicText: row.arabic_text,
      translation: row.translation,
      category: row.category_id ? (slugById.get(row.category_id) ?? "") : "",
    }));

  return NextResponse.json({
    category: category || null,
    categoryName: selectedCategory ? nameById.get(selectedCategory.id) : null,
    results,
  });
}
