import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";

export const dynamic = "force-dynamic";

interface CategoryRow {
  id: string;
  slug: string;
}

interface DoaRow {
  id: string;
  title: string;
  arabic_text: string;
  translation: string;
  category_id: string | null;
}

async function resolveCategoryId(
  categorySlug: string,
): Promise<{ id: string } | { error: NextResponse }> {
  const { data: rows, error } = await adminClient.database
    .from("doa_categories")
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ doaId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { doaId } = await context.params;

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
      return NextResponse.json({ error: "Judul doa wajib diisi." }, { status: 400 });
    }
    updates.title = patch.title.trim();
  }

  if (patch.arabicText !== undefined) {
    if (typeof patch.arabicText !== "string" || patch.arabicText.trim().length === 0) {
      return NextResponse.json({ error: "Teks Arab wajib diisi." }, { status: 400 });
    }
    updates.arabic_text = patch.arabicText.trim();
  }

  if (patch.translation !== undefined) {
    if (typeof patch.translation !== "string" || patch.translation.trim().length === 0) {
      return NextResponse.json({ error: "Arti doa wajib diisi." }, { status: 400 });
    }
    updates.translation = patch.translation.trim();
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
    .from("doas")
    .update(updates)
    .eq("id", doaId)
    .select("id, title, arabic_text, translation, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal memperbarui doa." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as DoaRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Doa tidak ditemukan." }, { status: 404 });
  }

  const { data: categoryRows } = await adminClient.database
    .from("doa_categories")
    .select("id, slug");

  const slugById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.slug]),
  );

  return NextResponse.json({
    result: {
      id: row.id,
      title: row.title,
      arabicText: row.arabic_text,
      translation: row.translation,
      category: row.category_id ? (slugById.get(row.category_id) ?? "") : "",
    },
  });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ doaId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { doaId } = await context.params;

  const { data: rows, error } = await adminClient.database
    .from("doas")
    .delete()
    .eq("id", doaId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus doa." }, { status: 500 });
  }

  if (((rows ?? []) as unknown as { id: string }[]).length === 0) {
    return NextResponse.json({ error: "Doa tidak ditemukan." }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
