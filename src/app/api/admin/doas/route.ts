import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";
import { createInsForgeServerClient } from "@/lib/insforge/server";

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

function toApi(row: DoaRow, slugById: Map<string, string>) {
  return {
    id: row.id,
    title: row.title,
    arabicText: row.arabic_text,
    translation: row.translation,
    category: row.category_id ? (slugById.get(row.category_id) ?? "") : "",
  };
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

  const { title, arabicText, translation, category } = body as Record<string, unknown>;
  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json({ error: "Judul doa wajib diisi." }, { status: 400 });
  }
  if (typeof arabicText !== "string" || arabicText.trim().length === 0) {
    return NextResponse.json({ error: "Teks Arab wajib diisi." }, { status: 400 });
  }
  if (typeof translation !== "string" || translation.trim().length === 0) {
    return NextResponse.json({ error: "Arti doa wajib diisi." }, { status: 400 });
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    return NextResponse.json({ error: "Kategori wajib diisi." }, { status: 400 });
  }

  const resolved = await resolveCategoryId(category.trim());
  if ("error" in resolved) return resolved.error;

  const { data: rows, error } = await adminClient.database
    .from("doas")
    .insert([
      {
        title: title.trim(),
        arabic_text: arabicText.trim(),
        translation: translation.trim(),
        category_id: resolved.id,
        created_by: session.userId,
      },
    ])
    .select("id, title, arabic_text, translation, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal menambah doa." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as DoaRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Gagal menambah doa." }, { status: 500 });
  }

  const slugById = new Map<string, string>([[resolved.id, category.trim()]]);
  return NextResponse.json({ result: toApi(row, slugById) }, { status: 201 });
}

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const insforge = await createInsForgeServerClient();
  const { data: categoryRows } = await insforge.database
    .from("doa_categories")
    .select("id, slug");

  const slugById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.slug]),
  );

  const { data: rows, error } = await insforge.database
    .from("doas")
    .select("id, title, arabic_text, translation, category_id")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Gagal memuat daftar doa." }, { status: 500 });
  }

  return NextResponse.json({
    results: ((rows ?? []) as unknown as DoaRow[]).map((row) =>
      toApi(row, slugById),
    ),
  });
}
