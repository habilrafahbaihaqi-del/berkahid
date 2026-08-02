import type { Metadata } from "next";
import DoaCategories from "@/components/doa/doa-categories";

export const metadata: Metadata = {
  title: "Doa Harian",
};

export default function DoaPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <DoaCategories />
    </div>
  );
}
