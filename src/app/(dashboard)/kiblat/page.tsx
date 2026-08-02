import type { Metadata } from "next";
import QiblaCompass from "@/components/qibla/qibla-compass";

export const metadata: Metadata = {
  title: "Arah Kiblat",
};

export default function QiblaPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <QiblaCompass />
    </div>
  );
}
