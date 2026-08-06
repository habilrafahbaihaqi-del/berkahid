import { NextRequest, NextResponse } from "next/server";
import { MuslimApiError, muslimGet } from "@/lib/muslim-api";

export const dynamic = "force-dynamic";

interface RawTafsir {
  kemenag?: { short?: string | null; long?: string | null };
  quraish?: string | null;
  jalalayn?: string | null;
}

interface RawMeta {
  juz?: number | null;
  page?: number | null;
  manzil?: number | null;
  ruku?: number | null;
  hizb_quarter?: number | null;
  sajda?: { recommended?: boolean; obligatory?: boolean };
}

interface RawAyah {
  id: number;
  surah_number: number;
  ayah_number: number;
  arab?: string;
  translation?: string;
  audio_url?: string | null;
  image_url?: string | null;
  tafsir?: RawTafsir;
  meta?: RawMeta;
}

interface RawSurahResponse {
  number?: number;
  name?: string;
  name_latin?: string;
  number_of_ayahs?: number;
  translation?: string;
  revelation?: string;
  description?: string;
  audio_url?: string | null;
  ayahs?: RawAyah[];
}

interface RawPagination {
  page?: number;
  limit?: number;
  total?: number;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ surah: string }> },
) {
  const { surah } = await context.params;
  const surahNumber = Number(surah);
  if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    return NextResponse.json({ error: "Nomor surah harus antara 1 dan 114." }, { status: 400 });
  }

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limitRaw = Number(searchParams.get("limit")) || 50;
  const limit = Math.min(100, Math.max(1, limitRaw));

  let payload: {
    data?: RawSurahResponse;
    pagination?: RawPagination;
  };
  try {
    payload = await muslimGet<{
      data?: RawSurahResponse;
      pagination?: RawPagination;
    }>(`/quran/${surahNumber}`, { page, limit }, { raw: true });
  } catch (error) {
    const status = error instanceof MuslimApiError ? error.status : 502;
    return NextResponse.json(
      { error: error instanceof MuslimApiError ? error.message : "Gagal memuat ayat." },
      { status },
    );
  }

  const raw = payload.data;
  if (!raw || !Array.isArray(raw.ayahs)) {
    return NextResponse.json({ error: "Data surah tidak tersedia." }, { status: 404 });
  }

  return NextResponse.json({
    surah: {
      number: raw.number ?? surahNumber,
      name: raw.name ?? null,
      nameLatin: raw.name_latin ?? null,
      ayahsCount: raw.number_of_ayahs ?? raw.ayahs.length,
      translation: raw.translation ?? null,
      revelation: raw.revelation ?? null,
      description: raw.description ?? null,
    },
    pagination: {
      page: payload.pagination?.page ?? page,
      limit: payload.pagination?.limit ?? limit,
      total: payload.pagination?.total ?? raw.ayahs.length,
    },
    ayahs: raw.ayahs.map((ayah) => ({
      number: ayah.ayah_number,
      surahNumber: ayah.surah_number,
      arab: ayah.arab ?? "",
      translation: ayah.translation ?? "",
      audioUrl: ayah.audio_url ?? null,
      imageUrl: ayah.image_url ?? null,
      tafsir: {
        kemenagShort: ayah.tafsir?.kemenag?.short ?? null,
        kemenagLong: ayah.tafsir?.kemenag?.long ?? null,
        quraish: ayah.tafsir?.quraish ?? null,
        jalalayn: ayah.tafsir?.jalalayn ?? null,
      },
      meta: {
        juz: ayah.meta?.juz ?? null,
        page: ayah.meta?.page ?? null,
        sajda: {
          recommended: ayah.meta?.sajda?.recommended ?? false,
          obligatory: ayah.meta?.sajda?.obligatory ?? false,
        },
      },
    })),
  });
}
