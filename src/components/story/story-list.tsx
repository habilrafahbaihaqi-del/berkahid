"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { MOCK_STORIES, STORY_CATEGORIES } from "@/data/stories";

export default function StoryList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const normalizedQuery = deferredQuery.toLowerCase().trim();

  const filtered = MOCK_STORIES.filter((story) => {
    if (selectedCategory && story.category !== selectedCategory) return false;
    if (!normalizedQuery) return true;
    return (
      story.title.toLowerCase().includes(normalizedQuery) ||
      story.summary.toLowerCase().includes(normalizedQuery)
    );
  });

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
          <h1 className="text-base font-bold">Cerita Islami</h1>
          <p className="text-[11px] text-emerald-200/70">
            Kisah Nabi, sahabat, dan inspirasi
          </p>
        </div>
      </header>

      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-100/50"
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
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari cerita…"
          className="w-full rounded-2xl border border-white/15 bg-white/10 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>

      <div className="-mx-4 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Pilih kategori">
        <div className="flex gap-1.5">
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === null}
            onClick={() => setSelectedCategory(null)}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === null
                ? "bg-emerald-400 text-emerald-950"
                : "bg-white/10 text-emerald-100 hover:bg-white/20"
            }`}
          >
            Semua
          </button>
          {STORY_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === category
                  ? "bg-emerald-400 text-emerald-950"
                  : "bg-white/10 text-emerald-100 hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-emerald-100/60">
          Tidak ada cerita yang cocok.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          <li className="px-1 text-[11px] text-emerald-200/50">
            Menampilkan {filtered.length} cerita
            {selectedCategory && ` di kategori ${selectedCategory}`}
            {normalizedQuery && ` untuk “${deferredQuery.trim()}”`}
          </li>
          {filtered.map((story) => (
            <li key={story.id}>
              <Link
                href={`/cerita/${story.id}`}
                className="block rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 transition-colors hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
              >
                <span className="inline-flex w-fit rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-300/30">
                  {story.category}
                </span>
                <h2 className="mt-2.5 text-sm font-bold text-white">
                  {story.title}
                </h2>
                <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/70">
                  {story.summary}
                </p>
                <span className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                  Baca cerita
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8.25 4.5 7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
