import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface AyahRow {
  ayah_number: number;
  juz: number;
  text_uthmani: string;
  translation: string;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surah: string }> },
) {
  const { surah } = await params;
  const surahNumber = Number(surah);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json(
      { error: "Nomor surah harus antara 1–114." },
      { status: 400 },
    );
  }

  const { data: surahRows, error: surahError } = await insforge.database
    .from("quran_surahs")
    .select("number")
    .eq("number", surahNumber);

  if (surahError) {
    return NextResponse.json(
      { error: "Gagal memuat data surah." },
      { status: 500 },
    );
  }
  if ((surahRows ?? []).length === 0) {
    return NextResponse.json({ error: "Surah tidak ditemukan." }, { status: 404 });
  }

  const { data, error } = await insforge.database
    .from("quran_ayahs")
    .select("ayah_number, juz, text_uthmani, translation")
    .eq("surah_number", surahNumber)
    .order("ayah_number", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Gagal memuat daftar ayat." },
      { status: 500 },
    );
  }

  const results = ((data ?? []) as AyahRow[]).map((row) => ({
    numberInSurah: row.ayah_number,
    juz: row.juz,
    text: row.text_uthmani,
    translation: row.translation,
  }));

  return NextResponse.json({ surah: surahNumber, results });
}
