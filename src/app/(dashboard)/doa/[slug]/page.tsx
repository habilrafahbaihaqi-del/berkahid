import type { Metadata } from "next";
import DoaListByCategory from "@/components/doa/doa-list-by-category";
import { DOA_CATEGORIES } from "@/data/doas";

interface DoaCategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DoaCategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = DOA_CATEGORIES.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} — Doa Harian` : "Doa Harian",
  };
}

export default function DoaCategoryPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <DoaListByCategory />
    </div>
  );
}
