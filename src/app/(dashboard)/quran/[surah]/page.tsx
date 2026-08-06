import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AyahList from "@/components/quran/ayah-list";
import { SURAHS } from "@/data/quran/surahs";

interface SurahPageProps {
  params: Promise<{ surah: string }>;
}

export async function generateMetadata({
  params,
}: SurahPageProps): Promise<Metadata> {
  const { surah } = await params;
  const surahData = SURAHS.find((s) => s.number === Number(surah));
  return {
    title: surahData ? `${surahData.name} — Al-Qur'an` : "Al-Qur'an",
  };
}

export default async function SurahPage({ params }: SurahPageProps) {
  const { surah } = await params;
  const surahData = SURAHS.find((s) => s.number === Number(surah));
  if (!surahData) notFound();

  const surahIndex = SURAHS.findIndex((s) => s.number === surahData.number);
  const prevSurah = surahIndex > 0 ? SURAHS[surahIndex - 1].number : null;
  const nextSurah =
    surahIndex < SURAHS.length - 1 ? SURAHS[surahIndex + 1].number : null;

  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-28 pt-6 sm:max-w-lg">
        <header className="flex items-center gap-3">
          <Link
            href="/quran"
            aria-label="Kembali ke daftar surah"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {surahData.name}
            </h1>
            <p className="text-[13px] text-gray-600">
              {surahData.meaning} · {surahData.ayahs} ayat · Juz {surahData.juz}
            </p>
          </div>
        </header>

        <section className="relative flex flex-col items-center gap-2 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 px-5 py-10 shadow-md">
          {/* Decorative Background Element */}
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          
          <span
            dir="rtl"
            className="relative font-quran text-5xl text-white drop-shadow-md"
          >
            {surahData.arabicName}
          </span>
          <span className="relative mt-2 text-sm font-semibold tracking-widest text-emerald-100">
            {surahData.name}
          </span>
        </section>

        <AyahList
          surahNumber={surahData.number}
          surahName={surahData.name}
          prevSurah={prevSurah}
          nextSurah={nextSurah}
        />
      </main>
    </div>
  );
}
