"use client";

import { useDeferredValue, useEffect, useRef, useState } from "react";
import { MOCK_CITIES, type Location } from "@/data/mock-cities";

interface LocationSearchProps {
  open: boolean;
  onClose: () => void;
  onSelect: (location: Location) => void;
}

function normalize(text: string) {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

export default function LocationSearch({
  open,
  onClose,
  onSelect,
}: LocationSearchProps) {
  if (!open) return null;
  return <LocationSearchContent onClose={onClose} onSelect={onSelect} />;
}

function LocationSearchContent({
  onClose,
  onSelect,
}: Omit<LocationSearchProps, "open">) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const deferredQuery = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const suggestions = (() => {
    const q = normalize(deferredQuery);
    if (!q) return MOCK_CITIES.slice(0, 8);
    return MOCK_CITIES.filter((c) =>
      normalize(`${c.city} ${c.district} ${c.province}`).includes(q),
    ).slice(0, 8);
  })();

  const clampedIndex =
    suggestions.length === 0 ? -1 : Math.min(activeIndex, suggestions.length - 1);

  useEffect(() => {
    if (clampedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[clampedIndex] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [clampedIndex]);

  const pick = (location: Location) => {
    onSelect(location);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target =
        clampedIndex >= 0 ? suggestions[clampedIndex] : suggestions[0];
      if (target) pick(target);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Pilih lokasi manual"
    >
      <button
        type="button"
        aria-label="Tutup"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-5 pb-8 text-emerald-950 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-emerald-200 sm:hidden" />

        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold">Ganti Lokasi</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            aria-label="Tutup"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mt-1 text-xs text-emerald-900/60">
          Ketik nama kota atau kecamatan untuk jadwal sholat.
        </p>

        <div className="relative mt-4">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/40"
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
            ref={inputRef}
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cari kota / kecamatan…"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls="location-suggestions"
            aria-activedescendant={
              clampedIndex >= 0 ? `location-option-${clampedIndex}` : undefined
            }
            className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/50 py-3 pl-10 pr-4 text-sm outline-none placeholder:text-emerald-900/40 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
          />
        </div>

        <ul
          id="location-suggestions"
          ref={listRef}
          role="listbox"
          className="mt-3 max-h-72 space-y-1 overflow-y-auto"
        >
          {suggestions.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-emerald-900/50">
              Tidak ada lokasi yang cocok dengan “{deferredQuery}”.
            </li>
          )}
          {suggestions.map((candidate, i) => {
            const active = i === clampedIndex;
            return (
              <li key={`${candidate.city}-${candidate.district}`}>
                <button
                  id={`location-option-${i}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => pick(candidate)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    active ? "bg-emerald-100" : "hover:bg-emerald-50"
                  }`}
                >
                  <svg
                    className="h-4 w-4 shrink-0 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
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
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-emerald-950">
                      {candidate.city} — {candidate.district}
                    </span>
                    <span className="block truncate text-xs text-emerald-900/60">
                      {candidate.province}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-center text-[11px] text-emerald-900/40">
          Saran lokasi bersifat tiruan untuk pengembangan.
        </p>
      </div>
    </div>
  );
}
