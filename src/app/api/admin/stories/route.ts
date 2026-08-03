import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";
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
  content: string;
  category_id: string | null;
}

function toApi(row: StoryRow, slugById: Map<string, string>, nameById: Map<string, string>) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: row.category_id ? (slugById.get(row.category_id) ?? "") : "",
    categoryName: row.category_id ? (nameById.get(row.category_id) ?? "") : "",
  };
}

async function resolveCategoryId(
  categorySlug: string,
): Promise<{ id: string } | { error: NextResponse }> {
  const { data: rows, error } = await adminClient.database
    .from("story_categories")
    .select("id, slug")
    .eq("slug", categorySlug);

  if (error) {
    return { error: NextResponse.json({ error: "Gagal memuat kategori." }, { status: 500 }) };
  }

  const category = ((rows ?? []) as unknown as CategoryRow[])[0];
  if (!category) {
    return {
      error: NextResponse.json(
        { error: `Kategori "${categorySlug}" tidak ditemukan.` },
        { status: 400 },
      ),
    };
  }
  return { id: category.id };
}

export async function POST(request: NextRequest) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const { title, summary, content, category } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Judul cerita wajib diisi." }, { status: 400 });
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json({ error: "Isi cerita wajib diisi." }, { status: 400 });
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    return NextResponse.json({ error: "Kategori wajib diisi." }, { status: 400 });
  }

  const resolved = await resolveCategoryId(category.trim());
  if ("error" in resolved) return resolved.error;

  const { data: rows, error } = await adminClient.database
    .from("stories")
    .insert([
      {
        title: title.trim(),
        summary: typeof summary === "string" ? summary.trim() : "",
        content: content.trim(),
        category_id: resolved.id,
        created_by: session.userId,
      },
    ])
    .select("id, title, summary, content, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal menambah cerita." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as StoryRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Gagal menambah cerita." }, { status: 500 });
  }

  const slugById = new Map<string, string>([[resolved.id, category.trim()]]);
  const nameById = new Map<string, string>();
  return NextResponse.json({ result: toApi(row, slugById, nameById) }, { status: 201 });
}

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const insforge = await createInsForgeServerClient();
  const { data: categoryRows } = await insforge.database
    .from("story_categories")
    .select("id, slug, name");

  const slugById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.slug]),
  );
  const nameById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.name]),
  );

  const { data: rows, error } = await insforge.database
    .from("stories")
    .select("id, title, summary, content, category_id")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Gagal memuat daftar cerita." }, { status: 500 });
  }

  return NextResponse.json({
    results: ((rows ?? []) as unknown as StoryRow[]).map((row) =>
      toApi(row, slugById, nameById),
    ),
  });
}
