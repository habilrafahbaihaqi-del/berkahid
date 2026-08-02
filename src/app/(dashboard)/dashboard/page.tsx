import type { Metadata } from "next";
import PrayerSchedule from "@/components/prayer-schedule";

export const metadata: Metadata = {
  title: "Jadwal Sholat",
};

export default function DashboardPage() {
  return <PrayerSchedule />;
}
