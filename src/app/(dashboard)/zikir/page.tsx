import type { Metadata } from "next";
import ZikrHome from "@/components/zikr/zikr-home";

export const metadata: Metadata = {
  title: "Zikir Harian",
};

export default function ZikrPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <ZikrHome />
    </div>
  );
}
