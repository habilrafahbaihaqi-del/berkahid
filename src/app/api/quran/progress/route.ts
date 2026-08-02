import { NextRequest, NextResponse } from "next/server";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

interface ReadingProgressRow {
  surah_number: number;
  ayah_number: number;
  last_read_at: string;
}

function validateLocation(surah: unknown, ayah: unknown) {
  const surahNumber = Number(surah);
  const ayahNumber = Number(ayah);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return { error: "Field \"surah\" harus angka 1–114." };
  }
  if (!Number.isInteger(ayahNumber) || ayahNumber < 1) {
    return { error: "Field \"ayah\" harus bilangan bulat positif." };
  }
  return { surahNumber, ayahNumber };
}

export async function GET() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { data: rows, error: queryError } = await insforge.database
    .from("reading_progress")
    .select("surah_number, ayah_number, last_read_at")
    .eq("user_id", data.user.id);

  if (queryError) {
    return NextResponse.json(
      { error: "Gagal memuat progress bacaan." },
      { status: 500 },
    );
  }

  const row = ((rows ?? []) as ReadingProgressRow[])[0];
  return NextResponse.json({
    progress: row
      ? {
          surah: row.surah_number,
          ayah: row.ayah_number,
          lastReadAt: row.last_read_at,
        }
      : null,
  });
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

  const { surah, ayah } = body as Record<string, unknown>;
  const validated = validateLocation(surah, ayah);
  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const { data: existing, error: selectError } = await insforge.database
    .from("reading_progress")
    .select("id")
    .eq("user_id", data.user.id);

  if (selectError) {
    return NextResponse.json(
      { error: "Gagal memuat progress bacaan." },
      { status: 500 },
    );
  }

  let result: {
    data: ReadingProgressRow[] | null;
    error: unknown;
  };

  if ((existing ?? []).length > 0) {
    result = await insforge.database
      .from("reading_progress")
      .update({
        surah_number: validated.surahNumber,
        ayah_number: validated.ayahNumber,
        last_read_at: new Date().toISOString(),
      })
      .eq("user_id", data.user.id)
      .select("surah_number, ayah_number, last_read_at");
  } else {
    result = await insforge.database
      .from("reading_progress")
      .insert([
        {
          user_id: data.user.id,
          surah_number: validated.surahNumber,
          ayah_number: validated.ayahNumber,
        },
      ])
      .select("surah_number, ayah_number, last_read_at");
  }

  if (result.error) {
    return NextResponse.json(
      { error: "Gagal menyimpan progress bacaan." },
      { status: 500 },
    );
  }

  const row = (result.data ?? [])[0] as ReadingProgressRow | undefined;
  return NextResponse.json({
    progress: row
      ? {
          surah: row.surah_number,
          ayah: row.ayah_number,
          lastReadAt: row.last_read_at,
        }
      : null,
  });
}
