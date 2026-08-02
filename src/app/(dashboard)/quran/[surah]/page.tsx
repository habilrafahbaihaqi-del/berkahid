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
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-28 pt-6 sm:max-w-lg">
        <header className="flex items-center gap-3">
          <Link
            href="/quran"
            aria-label="Kembali ke daftar surah"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
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
            <h1 className="text-base font-bold">
              Surah {surahData.name}
            </h1>
            <p className="text-[11px] text-emerald-200/70">
              {surahData.meaning} · {surahData.ayahs} ayat · Juz {surahData.juz}
            </p>
          </div>
        </header>

        <section className="flex flex-col items-center gap-2 rounded-3xl bg-white/10 px-5 py-8 backdrop-blur-sm ring-1 ring-white/20">
          <span
            dir="rtl"
            className="font-quran text-4xl text-emerald-100"
          >
            {surahData.arabicName}
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-emerald-200/70">
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
