import { NextRequest, NextResponse } from "next/server";
import { adminClient, requireAdmin } from "@/lib/insforge/admin-auth";
import { createInsForgeServerClient } from "@/lib/insforge/server";

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

function toApi(row: ZikrRow, nameById: Map<string, string>) {
  return {
    id: row.id,
    name: row.name,
    arabicText: row.arabic_text,
    meaning: row.meaning,
    explanation: row.explanation,
    category: row.category_id ? (nameById.get(row.category_id) ?? "") : "",
  };
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

  const { name, arabicText, meaning, explanation, category } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim().length === 0) {
    return NextResponse.json({ error: "Nama zikir wajib diisi." }, { status: 400 });
  }
  if (typeof arabicText !== "string" || arabicText.trim().length === 0) {
    return NextResponse.json({ error: "Teks Arab wajib diisi." }, { status: 400 });
  }
  if (typeof meaning !== "string" || meaning.trim().length === 0) {
    return NextResponse.json({ error: "Arti zikir wajib diisi." }, { status: 400 });
  }
  if (typeof category !== "string" || category.trim().length === 0) {
    return NextResponse.json({ error: "Kategori wajib diisi." }, { status: 400 });
  }

  const resolved = await resolveCategoryId(category.trim());
  if ("error" in resolved) return resolved.error;

  const { data: rows, error } = await adminClient.database
    .from("zikrs")
    .insert([
      {
        name: name.trim(),
        arabic_text: arabicText.trim(),
        meaning: meaning.trim(),
        explanation:
          typeof explanation === "string" ? explanation.trim() : "",
        category_id: resolved.id,
        created_by: session.userId,
      },
    ])
    .select("id, name, arabic_text, meaning, explanation, category_id");

  if (error) {
    return NextResponse.json({ error: "Gagal menambah zikir." }, { status: 500 });
  }

  const row = ((rows ?? []) as unknown as ZikrRow[])[0];
  if (!row) {
    return NextResponse.json({ error: "Gagal menambah zikir." }, { status: 500 });
  }

  const nameById = new Map<string, string>([[resolved.id, category.trim()]]);
  return NextResponse.json({ result: toApi(row, nameById) }, { status: 201 });
}

export async function GET() {
  const session = await requireAdmin();
  if (session instanceof NextResponse) return session;

  const insforge = await createInsForgeServerClient();
  const { data: categoryRows } = await insforge.database
    .from("zikr_categories")
    .select("id, name");

  const nameById = new Map(
    ((categoryRows ?? []) as unknown as CategoryRow[]).map((c) => [c.id, c.name]),
  );

  const { data: rows, error } = await insforge.database
    .from("zikrs")
    .select("id, name, arabic_text, meaning, explanation, category_id")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Gagal memuat daftar zikir." }, { status: 500 });
  }

  return NextResponse.json({
    results: ((rows ?? []) as unknown as ZikrRow[]).map((row) => toApi(row, nameById)),
  });
}
