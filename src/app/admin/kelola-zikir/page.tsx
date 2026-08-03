import type { Metadata } from "next";
import KelolaZikir from "@/components/admin/kelola-zikir";

export const metadata: Metadata = {
  title: "Kelola Zikir",
};

export default function KelolaZikirPage() {
  return <KelolaZikir />;
}
