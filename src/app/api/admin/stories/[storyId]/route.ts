import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";

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

export async function PATCH(request: NextRequest, context: { params: Promise<{ storyId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { storyId } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const patch = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  if (patch.title !== undefined) {
    if (typeof patch.title !== "string" || patch.title.trim().length === 0) {
      return NextResponse.json({ error: "Judul cerita wajib diisi." }, { status: 400 });
    }
    updates.title = patch.title.trim();
  }

  if (patch.summary !== undefined) {
    if (typeof patch.summary !== "string") {
      return NextResponse.json({ error: "Ringkasan harus berupa teks." }, { status: 400 });
    }
    updates.summary = patch.summary.trim();
  }

  if (patch.content !== undefined) {
    if (typeof patch.content !== "string" || patch.content.trim().length === 0) {
      return NextResponse.json({ error: "Isi cerita wajib diisi." }, { status: 400 });
    }
    updates.content = patch.content.trim();
  }

  if (patch.category !== undefined) {
    if (typeof patch.category !== "string" || patch.category.trim().length === 0) {
      return NextResponse.json({ error: "Kategori wajib diisi." }, { status: 400 });
    }
    const resolved = await resolveCategoryId(patch.category.trim());
    if ("error" in resolved) return resolved.error;
    updates.category_id = resolved.id;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada field yang dapat diperbarui." },
      { status: 400 },
    );
  }

  const { data: rows, error } = await adminClient.database
    .from("stories")
    .update(updates)
    .eq("id", storyId)
    .select("id, title, summary, content, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal memperbarui cerita." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as StoryRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  }

  const { data: categoryRows } = await adminClient.database
    .from("story_categories")
    .select("id, slug, name");

  const slugById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.slug]),
  );
  const nameById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.name]),
  );

  return NextResponse.json({
    result: {
      id: row.id,
      title: row.title,
      summary: row.summary,
      content: row.content,
      category: row.category_id ? (slugById.get(row.category_id) ?? "") : "",
      categoryName: row.category_id ? (nameById.get(row.category_id) ?? "") : "",
    },
  });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ storyId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { storyId } = await context.params;

  const { data: rows, error } = await adminClient.database
    .from("stories")
    .delete()
    .eq("id", storyId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus cerita." }, { status: 500 });
  }

  if (((rows ?? []) as unknown as { id: string }[]).length === 0) {
    return NextResponse.json({ error: "Cerita tidak ditemukan." }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
