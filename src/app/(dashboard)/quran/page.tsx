import type { Metadata } from "next";
import SurahList from "@/components/quran/surah-list";
import { SURAHS } from "@/data/quran/surahs";

export const metadata: Metadata = {
  title: "Al-Qur'an",
};

export default function QuranPage() {
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <SurahList surahs={SURAHS} />
    </div>
  );
}
