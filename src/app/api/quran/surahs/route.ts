import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface SurahRow {
  number: number;
  name: string;
  arabic_name: string;
  meaning: string;
  ayah_count: number;
  start_juz: number;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const juz = searchParams.get("juz");
  const q = searchParams.get("q")?.toLowerCase().trim();

  let query = insforge.database.from("quran_surahs").select();

  if (juz) {
    const juzNumber = Number(juz);
    if (!Number.isInteger(juzNumber) || juzNumber < 1 || juzNumber > 30) {
      return NextResponse.json(
        { error: "Parameter \"juz\" harus angka 1–30." },
        { status: 400 },
      );
    }
    query = query.eq("start_juz", juzNumber);
  }

  const { data, error } = await query.order("number", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat daftar surah." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as SurahRow[])
    .filter((row) => !q || row.name.toLowerCase().includes(q) || row.meaning.toLowerCase().includes(q))
    .map((row) => ({
      number: row.number,
      name: row.name,
      arabicName: row.arabic_name,
      meaning: row.meaning,
      ayahs: row.ayah_count,
      juz: row.start_juz,
    }));

  return NextResponse.json({ results });
}
