import type { Metadata } from "next";
import DoaQuickCategories from "@/components/doa/doa-quick-categories";

export const metadata: Metadata = {
  title: "Doa Cepat",
};

export default function DoaQuickPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <DoaQuickCategories />
    </div>
  );
}
