"use client";

export interface DoaCategoryApi {
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface DoaApi {
  id: string;
  title: string;
  arabicText: string;
  translation: string;
  category: string;
}

export interface DoaDetailApi extends DoaApi {
  categoryName: string;
}

let cachedCategories: DoaCategoryApi[] | null = null;
const cachedDoasByCategory = new Map<string, DoaApi[]>();

export async function fetchDoaCategories(force = false): Promise<DoaCategoryApi[]> {
  if (cachedCategories && !force) return cachedCategories;
  const response = await fetch("/api/doa/categories", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = (await response.json()) as { results?: DoaCategoryApi[] };
  cachedCategories = payload.results ?? [];
  return cachedCategories;
}

export async function fetchDoasByCategory(
  slug: string,
  force = false,
): Promise<DoaApi[]> {
  if (cachedDoasByCategory.has(slug) && !force) {
    return cachedDoasByCategory.get(slug)!;
  }
  const params = new URLSearchParams();
  if (slug) params.set("category", slug);
  const response = await fetch(`/api/doa?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = (await response.json()) as { results?: DoaApi[] };
  const results = payload.results ?? [];
  cachedDoasByCategory.set(slug, results);
  return results;
}

export async function fetchDoaById(doaId: string): Promise<DoaDetailApi> {
  const response = await fetch(`/api/doa/${encodeURIComponent(doaId)}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(payload?.error ?? `HTTP ${response.status}`);
  }
  return (await response.json()) as DoaDetailApi;
}
