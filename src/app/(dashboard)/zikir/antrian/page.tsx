import type { Metadata } from "next";
import ZikrQueuePage from "@/components/zikr/zikr-queue";

export const metadata: Metadata = {
  title: "Antrian Zikir Hari Ini",
};

export default function ZikrQueueRoute() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <ZikrQueuePage />
    </div>
  );
}
