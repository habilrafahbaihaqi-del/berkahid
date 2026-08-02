import type { Metadata } from "next";
import NotificationSettings from "@/components/notification-settings";

export const metadata: Metadata = {
  title: "Pengaturan Notifikasi",
};

export default function SettingsPage() {
  return <NotificationSettings />;
}
