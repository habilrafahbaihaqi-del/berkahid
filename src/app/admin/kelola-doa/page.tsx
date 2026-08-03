import type { Metadata } from "next";
import KelolaDoa from "@/components/admin/kelola-doa";

export const metadata: Metadata = {
  title: "Kelola Doa",
};

export default function KelolaDoaPage() {
  return <KelolaDoa />;
}
