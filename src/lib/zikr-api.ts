"use client";

import type { Zikr } from "@/data/zikrs";

let cachedZikrs: Zikr[] | null = null;

export async function fetchZikrs(force = false): Promise<Zikr[]> {
  if (cachedZikrs && !force) return cachedZikrs;
  const response = await fetch("/api/zikrs?limit=200", { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = (await response.json()) as { results?: Zikr[] };
  cachedZikrs = payload.results ?? [];
  return cachedZikrs;
}

export async function searchZikrs(
  query: string,
  category: string | null,
): Promise<Zikr[]> {
  const params = new URLSearchParams({ limit: "100" });
  if (query.trim()) params.set("q", query.trim());
  if (category) params.set("category", category);
  const response = await fetch(`/api/zikrs?${params.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = (await response.json()) as { results?: Zikr[] };
  return payload.results ?? [];
}
