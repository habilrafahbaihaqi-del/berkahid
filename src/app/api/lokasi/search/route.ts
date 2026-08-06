import { NextRequest, NextResponse } from "next/server";
import {
  listProvinsi,
  provinceNameById,
  searchKodePos,
  searchWilayah,
  toIndonesiaErrorResponse,
  type WilayahLevel,
} from "@/lib/api-indonesia";

export const dynamic = "force-dynamic";

interface SearchResult {
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

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function chainFor(district?: string, regency?: string, province?: string) {
  const parts = [
    district ? `Kec. ${district}` : null,
    regency ? `Kab. ${regency}` : null,
    province ? `Prov. ${province}` : null,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(" · ") : null;
}

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Kata kunci minimal 2 karakter." } },
      { status: 400 },
    );
  }

  try {
    await listProvinsi();
    const [wilayahItems, kodeposItems] = await Promise.all([
      searchWilayah(q, 20),
      searchKodePos(q),
    ]);

    const results: SearchResult[] = [];
    const seen = new Map<string, SearchResult>();

    const add = (item: SearchResult) => {
      const key = `${item.level}:${normalize(item.name)}`;
      const existing = seen.get(key);
      if (existing) {
        if (item.chain && !existing.chain) existing.chain = item.chain;
        if (item.postalCode && !existing.postalCode) {
          existing.postalCode = item.postalCode;
        }
        if (item.districtName && !existing.districtName) {
          existing.districtName = item.districtName;
        }
        if (item.regencyName && !existing.regencyName) {
          existing.regencyName = item.regencyName;
        }
        if (!existing.id && item.id) {
          existing.id = item.id;
          existing.officialName = item.officialName;
        }
        return;
      }
      seen.set(key, item);
      results.push(item);
    };

    for (const item of wilayahItems) {
      const provinceName =
        item.level === "kabupaten"
          ? provinceNameById(item.id.slice(0, 2)) ?? null
          : null;
      add({
        id: item.id,
        name: item.alt_name ?? item.name,
        officialName: item.name ?? item.alt_name,
        level: item.level,
        provinceName,
        chain: null,
        postalCode: null,
        districtName: null,
        regencyName: null,
      });
    }

    const kelurahanNameCounts = new Map<string, number>();
    for (const item of wilayahItems) {
      if (item.level !== "kelurahan") continue;
      const key = normalize(item.alt_name ?? item.name);
      kelurahanNameCounts.set(key, (kelurahanNameCounts.get(key) ?? 0) + 1);
    }

    for (const item of kodeposItems) {
      const name = item.village_name ?? item.postal_code;
      const baseKey = `kelurahan:${normalize(name)}`;
      const existing = seen.get(baseKey);
      const uniqueName = kelurahanNameCounts.get(normalize(name)) === 1;
      const chain = chainFor(item.district_name, item.regency_name, item.province_name);

      if (existing && uniqueName) {
        if (!existing.chain) existing.chain = chain;
        if (!existing.postalCode) existing.postalCode = item.postal_code ?? null;
        if (!existing.districtName) existing.districtName = item.district_name ?? null;
        if (!existing.regencyName) existing.regencyName = item.regency_name ?? null;
        continue;
      }

      const key = `${baseKey}:${normalize(item.district_name ?? "")}:${normalize(item.regency_name ?? "")}`;
      if (seen.has(key)) continue;
      const entry: SearchResult = {
        id: "",
        name,
        officialName: name,
        level: "kelurahan",
        provinceName: item.province_name ?? null,
        chain,
        postalCode: item.postal_code ?? null,
        districtName: item.district_name ?? null,
        regencyName: item.regency_name ?? null,
      };
      seen.set(key, entry);
      results.push(entry);
    }

    return NextResponse.json({ results });
  } catch (error) {
    return toIndonesiaErrorResponse(error);
  }
}
