import type { Metadata } from "next";
import SurahList from "@/components/quran/surah-list";
import { SURAHS } from "@/data/quran/surahs";

export const metadata: Metadata = {
  title: "Al-Qur'an",
};

export default function QuranPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <SurahList surahs={SURAHS} />
    </div>
  );
}
