import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";

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

async function resolveCategoryId(
  categoryName: string,
): Promise<{ id: string } | { error: NextResponse }> {
  const { data: rows, error } = await adminClient.database
    .from("zikr_categories")
    .select("id, name")
    .eq("name", categoryName);

  if (error) {
    return { error: NextResponse.json({ error: "Gagal memuat kategori." }, { status: 500 }) };
  }

  const category = ((rows ?? []) as unknown as CategoryRow[])[0];
  if (!category) {
    return {
      error: NextResponse.json(
        { error: `Kategori "${categoryName}" tidak ditemukan.` },
        { status: 400 },
      ),
    };
  }
  return { id: category.id };
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ zikrId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { zikrId } = await context.params;

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

  if (patch.name !== undefined) {
    if (typeof patch.name !== "string" || patch.name.trim().length === 0) {
      return NextResponse.json({ error: "Nama zikir wajib diisi." }, { status: 400 });
    }
    updates.name = patch.name.trim();
  }

  if (patch.arabicText !== undefined) {
    if (typeof patch.arabicText !== "string" || patch.arabicText.trim().length === 0) {
      return NextResponse.json({ error: "Teks Arab wajib diisi." }, { status: 400 });
    }
    updates.arabic_text = patch.arabicText.trim();
  }

  if (patch.meaning !== undefined) {
    if (typeof patch.meaning !== "string" || patch.meaning.trim().length === 0) {
      return NextResponse.json({ error: "Arti zikir wajib diisi." }, { status: 400 });
    }
    updates.meaning = patch.meaning.trim();
  }

  if (patch.explanation !== undefined) {
    if (typeof patch.explanation !== "string") {
      return NextResponse.json({ error: "Penjelasan harus berupa teks." }, { status: 400 });
    }
    updates.explanation = patch.explanation.trim();
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
    .from("zikrs")
    .update(updates)
    .eq("id", zikrId)
    .select("id, name, arabic_text, meaning, explanation, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal memperbarui zikir." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as ZikrRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Zikir tidak ditemukan." }, { status: 404 });
  }

  const { data: categoryRows } = await adminClient.database
    .from("zikr_categories")
    .select("id, name");

  const nameById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.name]),
  );

  return NextResponse.json({
    result: {
      id: row.id,
      name: row.name,
      arabicText: row.arabic_text,
      meaning: row.meaning,
      explanation: row.explanation,
      category: row.category_id ? (nameById.get(row.category_id) ?? "") : "",
    },
  });
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ zikrId: string }> }) {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const { zikrId } = await context.params;

  const { data: rows, error } = await adminClient.database
    .from("zikrs")
    .delete()
    .eq("id", zikrId)
    .select("id");

  if (error) {
    return NextResponse.json({ error: "Gagal menghapus zikir." }, { status: 500 });
  }

  if (((rows ?? []) as unknown as { id: string }[]).length === 0) {
    return NextResponse.json({ error: "Zikir tidak ditemukan." }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
