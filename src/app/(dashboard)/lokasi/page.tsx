import type { Metadata } from "next";
import WilayahSearch from "@/components/lokasi/wilayah-search";

export const metadata: Metadata = {
  title: "Cari Lokasi Indonesia",
};

export default function LokasiPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <WilayahSearch />
    </div>
  );
}
