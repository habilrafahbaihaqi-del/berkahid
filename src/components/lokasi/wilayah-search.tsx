"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useState } from "react";
import { saveLocation, saveLocationSource } from "@/lib/location-store";
import {
  findVillageId,
  normalize,
  resolveLocationForJadwal,
  searchLokasi,
  type WilayahDetail,
  type WilayahResult,
} from "@/lib/lokasi";

const LEVEL_LABELS: Record<WilayahResult["level"], string> = {
  provinsi: "Provinsi",
  kabupaten: "Kabupaten/Kota",
  kecamatan: "Kecamatan",
  kelurahan: "Kelurahan/Desa",
};

function badgeFor(result: WilayahResult) {
  if (result.level !== "kabupaten") return LEVEL_LABELS[result.level];
  const official = result.officialName ?? result.name;
  if (/^KOTA\b/i.test(official)) return "Kota";
  if (/^KABUPATEN\b/i.test(official)) return "Kabupaten";
  return "Kabupaten/Kota";
}

function subtitleFor(result: WilayahResult) {
  if (result.chain) return result.chain;
  if (result.level === "kabupaten" && result.provinceName) {
    return `Prov. ${result.provinceName}`;
  }
  return LEVEL_LABELS[result.level];
}

export default function WilayahSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WilayahResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WilayahResult | null>(null);
  const [detail, setDetail] = useState<WilayahDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [using, setUsing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const deferredQuery = useDeferredValue(query);
  const q = normalize(deferredQuery);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      if (q.length < 2) {
        setResults(null);
        setSearching(false);
        setError(null);
        return;
      }
      setSearching(true);
      setError(null);
      searchLokasi(q)
        .then((items) => {
          setResults(items);
          setSearching(false);
        })
        .catch(() => {
          setError("Pencarian gagal. Periksa koneksi lalu coba lagi.");
          setSearching(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  useEffect(() => {
    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!selected) {
        setDetail(null);
        setLoadingDetail(false);
        return;
      }
      setLoadingDetail(true);
      setDetail(null);
      (async () => {
        try {
          let id = selected.id;
          if (!id) {
            const found = await findVillageId(selected.name, selected.districtName);
            id = found ?? "";
          }
          if (!id) throw new Error("no id");
          const response = await fetch(`/api/lokasi/wilayah/${selected.level}/${id}`, {
            cache: "no-store",
          });
          if (!response.ok) throw new Error("failed");
          const payload = (await response.json()) as { detail?: WilayahDetail };
          if (cancelled) return;
          setDetail(payload.detail ?? null);
          setLoadingDetail(false);
        } catch {
          if (cancelled) return;
          setDetail(null);
          setLoadingDetail(false);
          setError("Gagal memuat detail wilayah.");
        }
      })();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      cancelled = true;
    };
  }, [selected]);

  const handleUse = async () => {
    if (!selected) return;
    setUsing(true);
    setNotice(null);
    try {
      const location = await resolveLocationForJadwal(selected);
      saveLocation(location);
      saveLocationSource("manual");
      setNotice("Lokasi tersimpan — membuka jadwal sholat…");
      window.setTimeout(() => router.push("/dashboard"), 600);
    } catch {
      setNotice("Lokasi ini belum didukung jadwal sholat. Coba pilih kabupaten/kota lain.");
      setUsing(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
      <header className="flex items-center gap-3">
        <Link
          href="/dashboard"
          aria-label="Kembali ke beranda"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
        <div>
          <h1 className="text-base font-bold">Cari Lokasi Indonesia</h1>
          <p className="text-[11px] text-emerald-200/70">
            Provinsi → Kabupaten → Kecamatan → Kelurahan + kode pos
          </p>
        </div>
      </header>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-100/50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
          placeholder="Ketik nama lokasi… mis. Gempol Sari"
          className="w-full rounded-3xl border border-white/20 bg-white/10 py-4 pl-12 pr-12 text-sm font-medium text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
        {searching && (
          <svg
            className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-emerald-200"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
            />
          </svg>
        )}
      </div>

      <p className="text-center text-[11px] text-emerald-200/60">
        Data wilayah resmi Kemendagri & kode pos · API Indonesia
      </p>

      {error && (
        <div className="rounded-2xl bg-rose-400/10 px-4 py-3 text-center text-xs font-medium text-rose-200 ring-1 ring-rose-300/30">
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-2xl bg-emerald-400/15 px-4 py-3 text-center text-xs font-semibold text-emerald-100 ring-1 ring-emerald-300/30">
          {notice}
        </div>
      )}

      {!selected && (
        <ul className="flex flex-col gap-2">
          {results === null && q.length < 2 && (
            <li className="rounded-3xl bg-white/5 px-5 py-8 text-center text-sm text-emerald-100/60 ring-1 ring-white/10">
              Ketik minimal 2 huruf — seluruh wilayah Indonesia akan dicari, dari
              provinsi hingga kelurahan/desa.
            </li>
          )}
          {results !== null && results.length === 0 && !searching && (
            <li className="rounded-3xl bg-white/5 px-5 py-8 text-center text-sm text-emerald-100/60 ring-1 ring-white/10">
              Tidak ada lokasi yang cocok dengan “{deferredQuery}”.
            </li>
          )}
          {(results ?? []).slice(0, 25).map((result) => (
            <li key={`${result.id || "k"}-${result.name}`}>
              <button
                type="button"
                onClick={() => setSelected(result)}
                className="flex w-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/15 transition-colors hover:bg-white/15"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-emerald-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.14-7.5 11.25-7.5 11.25S4.5 17.64 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-white">
                      {result.name}
                    </span>
                    <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-200 ring-1 ring-white/15">
                      {badgeFor(result)}
                    </span>
                    {result.postalCode && (
                      <span className="shrink-0 rounded-full bg-sky-400/15 px-2 py-0.5 text-[9px] font-bold tracking-wide text-sky-200 ring-1 ring-sky-300/30">
                        {result.postalCode}
                      </span>
                    )}
                  </span>
                  <span className="block truncate text-xs text-emerald-100/60">
                    {subtitleFor(result)}
                  </span>
                </span>
                <svg
                  className="h-4 w-4 shrink-0 text-emerald-200/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9 5.25 6.75 6.75L9 18.75"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <section className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-emerald-100">Detail Wilayah</h2>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-100 ring-1 ring-white/15 hover:bg-white/20"
            >
              ← Kembali
            </button>
          </div>

          {loadingDetail && (
            <p className="mt-4 text-sm text-emerald-100/70">Memuat detail…</p>
          )}

          {detail && !loadingDetail && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-200 ring-1 ring-emerald-300/30">
                  {LEVEL_LABELS[selected.level]}
                </span>
                {detail.postalCode && (
                  <span className="rounded-full bg-sky-400/15 px-2.5 py-1 text-[10px] font-bold tracking-wide text-sky-200 ring-1 ring-sky-300/30">
                    Kode Pos {detail.postalCode}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <p className="text-lg font-bold text-white">{detail.name}</p>
                <p className="text-xs text-emerald-100/70">
                  {[detail.provinceName, detail.regencyName, detail.districtName]
                    .filter(Boolean)
                    .join(" > ")}
                </p>
                {detail.lat != null && detail.lng != null && (
                  <p className="mt-1 text-[11px] tabular-nums text-emerald-100/50">
                    {detail.lat.toFixed(6)}, {detail.lng.toFixed(6)}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleUse}
                  disabled={using}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-emerald-400 disabled:opacity-60"
                >
                  {using && (
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                      />
                    </svg>
                  )}
                  Gunakan untuk Jadwal Sholat
                </button>
                {selected.level !== "provinsi" && (
                  <p className="text-center text-[10px] text-emerald-100/50">
                    Jadwal sholat dihitung untuk kabupaten/kota terdekat dari lokasi ini.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      )}

      <p className="text-center text-[11px] text-emerald-200/40">
        Sumber: data wilayah Permendagri & kode pos via API Indonesia
      </p>
    </main>
  );
}
