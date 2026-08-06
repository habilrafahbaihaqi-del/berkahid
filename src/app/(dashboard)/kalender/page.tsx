import type { Metadata } from "next";
import CalendarView from "@/components/calendar/calendar-view";

export const metadata: Metadata = {
  title: "Kalender Islam",
};

export default function KalenderPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <CalendarView />
    </div>
  );
}
