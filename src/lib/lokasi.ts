import type { Location } from "@/data/cities";

export type WilayahLevel = "provinsi" | "kabupaten" | "kecamatan" | "kelurahan";

export interface WilayahResult {
  id: string;
  name: string;
  officialName: string;
  level: WilayahLevel;
  provinceName: string | null;
  chain: string | null;
  postalCode: string | null;
  districtName: string | null;
  regencyName: string | null;
}

export interface WilayahDetail {
  name: string;
  lat: number | null;
  lng: number | null;
  provinceName: string | null;
  regencyName: string | null;
  districtName: string | null;
  postalCode: string | null;
}

export function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export async function searchLokasi(q: string): Promise<WilayahResult[]> {
  const response = await fetch(`/api/lokasi/search?q=${encodeURIComponent(q)}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Pencarian gagal.");
  const payload = (await response.json()) as { results?: WilayahResult[] };
  return payload.results ?? [];
}

async function fetchDetail(level: WilayahLevel, id: string): Promise<WilayahDetail> {
  const response = await fetch(`/api/lokasi/wilayah/${level}/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Gagal memuat detail lokasi.");
  const payload = (await response.json()) as { detail?: WilayahDetail };
  if (!payload.detail) throw new Error("Detail lokasi kosong.");
  return payload.detail;
}

export async function findVillageId(
  name: string,
  districtName?: string | null,
): Promise<string | null> {
  if (districtName) {
    const kecamatanResults = await searchLokasi(districtName);
    const kecamatan = kecamatanResults.find(
      (r) =>
        r.level === "kecamatan" &&
        normalize(r.name) === normalize(districtName),
    );
    if (kecamatan?.id) {
      const response = await fetch(
        `/api/lokasi/kelurahan?kecamatan_id=${kecamatan.id}`,
        { cache: "no-store" },
      );
      if (response.ok) {
        const payload = (await response.json()) as {
          results?: Array<{ id: string; name: string }>;
        };
        const match = (payload.results ?? []).find(
          (v) => normalize(v.name) === normalize(name),
        );
        if (match?.id) return match.id;
      }
    }
  }

  const results = await searchLokasi(name);
  const match = results.find(
    (r) => r.level === "kelurahan" && normalize(r.name) === normalize(name),
  );
  return match?.id ?? null;
}

export async function resolveLocationForJadwal(
  result: WilayahResult,
): Promise<Location> {
  let id = result.id;

  if (!id) {
    if (result.level !== "kelurahan") {
      throw new Error("Lokasi ini tidak dapat digunakan untuk jadwal sholat.");
    }
    const found = await findVillageId(result.name, result.districtName);
    if (!found) throw new Error("Lokasi ini tidak dapat digunakan untuk jadwal sholat.");
    id = found;
  }

  const detail = await fetchDetail(result.level, id);

  const city =
    detail.name ||
    (result.level === "kabupaten" ? result.officialName : result.name);
  const district =
    detail.districtName ??
    detail.regencyName ??
    (result.level === "kecamatan" ? result.name : "");
  const kabupaten =
    detail.regencyName ??
    (result.level === "kabupaten" ? detail.name : null) ??
    null;

  return {
    city,
    district: district ?? "",
    province: detail.provinceName ?? result.provinceName ?? "",
    kabupaten: kabupaten ?? undefined,
    latitude: detail.lat ?? undefined,
    longitude: detail.lng ?? undefined,
    postalCode: detail.postalCode ?? undefined,
  };
}
