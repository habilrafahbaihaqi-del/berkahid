"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "#beranda", label: "Beranda" },
  { href: "#fitur", label: "Fitur" },
  { href: "#tentang", label: "Tentang" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-emerald-800/50 bg-emerald-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-wider text-emerald-50">
              BERKAHID
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-emerald-100/80 md:flex" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.href === "#beranda" ? "text-emerald-300 transition-colors" : "transition-colors hover:text-emerald-300"}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/masuk"
              className="hidden text-sm font-semibold text-emerald-100 transition-colors hover:text-white sm:block"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-colors hover:bg-emerald-400"
            >
              Daftar
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Buka menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20 md:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          role="presentation"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu utama"
            className="flex h-dvh w-72 max-w-[85vw] flex-col bg-emerald-950 px-6 py-6 ring-1 ring-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
                    <circle cx="12" cy="11" r="2.2" />
                  </svg>
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                  BerkahID
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition-colors hover:bg-white/20"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Navigasi utama">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl px-3 py-2.5 text-sm font-semibold text-emerald-100/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 pt-8">
              <Link
                href="/masuk"
                onClick={() => setMobileOpen(false)}
                className="rounded-full border border-emerald-700 px-5 py-2.5 text-center text-sm font-semibold text-emerald-100 transition-colors hover:bg-emerald-800/50"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                onClick={() => setMobileOpen(false)}
                className="rounded-full bg-emerald-500 px-5 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-emerald-400"
              >
                Daftar
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
