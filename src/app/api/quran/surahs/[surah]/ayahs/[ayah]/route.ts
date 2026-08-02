import { NextResponse } from "next/server";
import { createClient } from "@insforge/sdk";

export const dynamic = "force-dynamic";

interface AyahRow {
  ayah_number: number;
  juz: number;
  text_uthmani: string;
  translation: string;
}

interface TafsirRow {
  source: string;
  text: string;
}

const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surah: string; ayah: string }> },
) {
  const { surah, ayah } = await params;
  const surahNumber = Number(surah);
  const ayahNumber = Number(ayah);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json(
      { error: "Nomor surah harus antara 1–114." },
      { status: 400 },
    );
  }
  if (!Number.isInteger(ayahNumber) || ayahNumber < 1) {
    return NextResponse.json(
      { error: "Nomor ayat harus bilangan bulat positif." },
      { status: 400 },
    );
  }

  const { data: ayahRows, error: ayahError } = await insforge.database
    .from("quran_ayahs")
    .select("ayah_number, juz, text_uthmani, translation")
    .eq("surah_number", surahNumber)
    .eq("ayah_number", ayahNumber);

  if (ayahError) {
    return NextResponse.json(
      { error: "Gagal memuat data ayat." },
      { status: 500 },
    );
  }
  const ayahRow = ((ayahRows ?? []) as AyahRow[])[0];
  if (!ayahRow) {
    return NextResponse.json(
      { error: "Ayat tidak ditemukan." },
      { status: 404 },
    );
  }

  const { data: tafsirRows, error: tafsirError } = await insforge.database
    .from("quran_tafsirs")
    .select("source, text")
    .eq("surah_number", surahNumber)
    .eq("ayah_number", ayahNumber);

  if (tafsirError) {
    return NextResponse.json(
      { error: "Gagal memuat data tafsir." },
      { status: 500 },
    );
  }
  const tafsirRow = ((tafsirRows ?? []) as TafsirRow[])[0];

  return NextResponse.json({
    surah: surahNumber,
    ayah: ayahRow.ayah_number,
    juz: ayahRow.juz,
    text: ayahRow.text_uthmani,
    translation: ayahRow.translation,
    tafsir: tafsirRow
      ? { source: tafsirRow.source, text: tafsirRow.text }
      : null,
  });
}
