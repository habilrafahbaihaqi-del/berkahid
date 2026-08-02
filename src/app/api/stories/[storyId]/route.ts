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
  content: string;
  category_id: string | null;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      storyId,
    )
  ) {
    return NextResponse.json(
      { error: "ID cerita tidak valid." },
      { status: 400 },
    );
  }

  const { data: rows, error } = await insforge.database
    .from("stories")
    .select("id, title, summary, content, category_id")
    .eq("id", storyId);

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat detail cerita." },
      { status: 500 },
    );
  }

  const row = ((rows ?? []) as unknown as StoryRow[])[0];
  if (!row) {
    return NextResponse.json(
      { error: "Cerita tidak ditemukan." },
      { status: 404 },
    );
  }

  let categorySlug = "";
  let categoryName = "";
  if (row.category_id) {
    const { data: categoryRows, error: categoryError } = await insforge.database
      .from("story_categories")
      .select("id, slug, name")
      .eq("id", row.category_id);
    if (!categoryError) {
      const category = ((categoryRows ?? []) as unknown as CategoryRow[])[0];
      categorySlug = category?.slug ?? "";
      categoryName = category?.name ?? "";
    }
  }

  return NextResponse.json({
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    category: categorySlug,
    categoryName,
  });
}

function validateUpdate(body: Record<string, unknown>) {
  const updates: Record<string, unknown> = {};
  const errors: string[] = [];

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0 || body.title.trim().length > 300) {
      errors.push("\"title\" harus teks 1–300 karakter.");
    } else {
      updates.title = body.title.trim();
    }
  }
  if (body.summary !== undefined) {
    if (typeof body.summary !== "string" || body.summary.trim().length === 0) {
      errors.push("\"summary\" wajib diisi.");
    } else {
      updates.summary = body.summary.trim();
    }
  }
  if (body.content !== undefined) {
    if (typeof body.content !== "string" || body.content.trim().length === 0) {
      errors.push("\"content\" wajib diisi.");
    } else {
      updates.content = body.content.trim();
    }
  }
  if (body.categoryId !== undefined) {
    if (typeof body.categoryId !== "string" || body.categoryId.length === 0) {
      errors.push("\"categoryId\" harus teks.");
    } else {
      updates.category_id = body.categoryId;
    }
  }

  return { updates, errors };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      storyId,
    )
  ) {
    return NextResponse.json({ error: "ID cerita tidak valid." }, { status: 400 });
  }

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

  const { updates, errors } = validateUpdate(body as Record<string, unknown>);
  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada field yang dapat diperbarui." },
      { status: 400 },
    );
  }

  const { data: updated, error: updateError } = await insforge.database
    .from("stories")
    .update(updates)
    .eq("id", storyId)
    .select("id");

  if (updateError) {
    const status =
      updateError instanceof Error &&
      "statusCode" in updateError &&
      (updateError as { statusCode?: number }).statusCode === 403
        ? 403
        : 500;
    return NextResponse.json(
      {
        error:
          status === 403
            ? "Hanya admin yang dapat mengubah cerita."
            : "Gagal mengubah cerita.",
      },
      { status },
    );
  }

  if ((updated ?? []).length === 0) {
    return NextResponse.json(
      { error: "Cerita tidak ditemukan." },
      { status: 404 },
    );
  }

  return NextResponse.json({ id: (updated ?? [])[0]?.id });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ storyId: string }> },
) {
  const { storyId } = await params;
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      storyId,
    )
  ) {
    return NextResponse.json({ error: "ID cerita tidak valid." }, { status: 400 });
  }

  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { error: deleteError } = await insforge.database
    .from("stories")
    .delete()
    .eq("id", storyId);

  if (deleteError) {
    const status =
      deleteError instanceof Error &&
      "statusCode" in deleteError &&
      (deleteError as { statusCode?: number }).statusCode === 403
        ? 403
        : 500;
    return NextResponse.json(
      {
        error:
          status === 403
            ? "Hanya admin yang dapat menghapus cerita."
            : "Gagal menghapus cerita.",
      },
      { status },
    );
  }

  return new NextResponse(null, { status: 204 });
}
