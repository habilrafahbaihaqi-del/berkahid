import type { Metadata } from "next";
import ZikrCatalog from "@/components/zikr/zikr-catalog";

export const metadata: Metadata = {
  title: "Katalog Zikir",
};

export default function ZikrCatalogPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <ZikrCatalog />
    </div>
  );
}
