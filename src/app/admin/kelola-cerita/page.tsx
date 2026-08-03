import type { Metadata } from "next";
import KelolaCerita from "@/components/admin/kelola-cerita";

export const metadata: Metadata = {
  title: "Kelola Cerita Islami",
};

export default function KelolaCeritaPage() {
  return <KelolaCerita />;
}
