import type { Metadata } from "next";
import DoaDetail from "@/components/doa/doa-detail";

export const metadata: Metadata = {
  title: "Baca Doa",
};

export default function DoaDetailPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <DoaDetail />
    </div>
  );
}
