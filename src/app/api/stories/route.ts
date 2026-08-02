import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
}

interface StoryRow {
  id: string;
  title: string;
  summary: string;
  category_id: string | null;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const rawLimit = Number(searchParams.get("limit") ?? 50);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), 100)
    : 50;

  const { data: categoryRows, error: categoryError } = await insforge.database
    .from("story_categories")
    .select("id, slug, name");

  if (categoryError) {
    return NextResponse.json(
      { error: "Gagal memuat kategori cerita." },
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
        { error: "Kategori cerita tidak ditemukan." },
        { status: 404 },
      );
    }
  }

  const { data, error } = await insforge.database
    .from("stories")
    .select("id, title, summary, category_id");

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat daftar cerita." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as unknown as StoryRow[])
    .filter(
      (row) => !selectedCategory || row.category_id === selectedCategory.id,
    )
    .filter(
      (row) =>
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q),
    )
    .slice(0, limit)
    .map((row) => {
      const categorySlug = row.category_id
        ? (slugById.get(row.category_id) ?? "")
        : "";
      return {
        id: row.id,
        title: row.title,
        summary: row.summary,
        category: row.category_id ? (nameById.get(row.category_id) ?? "") : "",
        categorySlug,
      };
    });

  return NextResponse.json({
    results,
    query: q,
    category: category || null,
    limit,
  });
}

function validateStoryFields(body: Record<string, unknown>) {
  const errors: string[] = [];
  if (
    typeof body.title !== "string" ||
    body.title.trim().length === 0 ||
    body.title.trim().length > 300
  ) {
    errors.push("\"title\" harus teks 1–300 karakter.");
  }
  if (
    typeof body.summary !== "string" ||
    body.summary.trim().length === 0
  ) {
    errors.push("\"summary\" wajib diisi.");
  }
  if (
    typeof body.content !== "string" ||
    body.content.trim().length === 0
  ) {
    errors.push("\"content\" wajib diisi.");
  }
  return errors;
}

export async function POST(request: NextRequest) {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const fields = body as Record<string, unknown>;
  const errors = validateStoryFields(fields);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }

  const categoryId =
    typeof fields.categoryId === "string" && fields.categoryId
      ? fields.categoryId
      : null;

  const { data: inserted, error: insertError } = await insforge.database
    .from("stories")
    .insert([
      {
        title: (fields.title as string).trim(),
        summary: (fields.summary as string).trim(),
        content: (fields.content as string).trim(),
        category_id: categoryId,
        created_by: data.user.id,
      },
    ])
    .select("id");

  if (insertError) {
    const status =
      insertError instanceof Error &&
      "statusCode" in insertError &&
      (insertError as { statusCode?: number }).statusCode === 403
        ? 403
        : 500;
    return NextResponse.json(
      {
        error:
          status === 403
            ? "Hanya admin yang dapat menambah cerita."
            : "Gagal menambah cerita.",
      },
      { status },
    );
  }

  return NextResponse.json(
    { id: (inserted ?? [])[0]?.id },
    { status: 201 },
  );
}
