"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeMatch: (pathname: string) => boolean;
}

const ITEMS: SidebarItem[] = [
  {
    href: "/dashboard",
    label: "Jadwal",
    activeMatch: (pathname) => pathname === "/dashboard",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    href: "/quran",
    label: "Al-Qur'an",
    activeMatch: (pathname) => pathname.startsWith("/quran"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
        />
      </svg>
    ),
  },
  {
    href: "/zikir",
    label: "Zikir",
    activeMatch: (pathname) => pathname.startsWith("/zikir"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    href: "/doa",
    label: "Doa",
    activeMatch: (pathname) => pathname.startsWith("/doa"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
        />
      </svg>
    ),
  },
  {
    href: "/cerita",
    label: "Cerita Islami",
    activeMatch: (pathname) => pathname.startsWith("/cerita"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25m-3.75.75h.008v.008h-.008v-.008Z"
        />
      </svg>
    ),
  },
  {
    href: "/kalender",
    label: "Kalender",
    activeMatch: (pathname) => pathname.startsWith("/kalender"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
        />
      </svg>
    ),
  },
  {
    href: "/lokasi",
    label: "Cari Lokasi",
    activeMatch: (pathname) => pathname.startsWith("/lokasi"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
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
    ),
  },
  {
    href: "/kiblat",
    label: "Kiblat",
    activeMatch: (pathname) => pathname.startsWith("/kiblat"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
        />
      </svg>
    ),
  },
  {
    href: "/pengaturan",
    label: "Pengaturan",
    activeMatch: (pathname) => pathname.startsWith("/pengaturan"),
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/masuk");
    router.refresh();
  };

  const adminLink = user?.role === "admin" && (
    <Link
      href="/admin"
      onClick={() => setMobileOpen(false)}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
        pathname.startsWith("/admin")
          ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/30"
          : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className="shrink-0">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
          />
        </svg>
      </span>
      Panel Admin
    </Link>
  );

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-[#063E32] px-4 py-3 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
                />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white">
              BerkahID
            </p>
          </div>
        </div>
        {user?.role === "admin" && (
          <Link
            href="/admin"
            className="rounded-xl bg-white/10 px-3 py-1.5 text-[11px] font-bold text-emerald-100 ring-1 ring-white/15"
          >
            Panel Admin
          </Link>
        )}
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          role="presentation"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu utama"
            className="flex h-dvh w-72 max-w-[85vw] flex-col bg-[#063E32] px-3 py-6 ring-1 ring-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between pr-2">
              <div className="flex items-center gap-3 px-3 pb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
                    />
                    <circle cx="12" cy="11" r="2.2" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
                    BerkahID
                  </p>
                  <p className="text-[10px] text-emerald-200/60">Portal Islami</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Tutup menu"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-emerald-100 transition-colors hover:bg-white/20"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Navigasi utama">
              {ITEMS.map((item) => {
                const active = item.activeMatch(pathname);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/30"
                        : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
              {adminLink}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <div
                className="relative overflow-hidden rounded-2xl bg-cover bg-center p-4 ring-1 ring-white/20"
                style={{ backgroundImage: "url('/quote-card-bg.jpg')" }}
              >
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <p className="text-sm font-semibold leading-relaxed text-emerald-50">
                    “Dirikanlah shalat, sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar.”
                  </p>
                  <p className="mt-2 text-[10px] text-emerald-200/80">QS. Al-Ankabut: 45</p>
                </div>
              </div>

              <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2.5 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/20 transition-colors hover:bg-emerald-400/20"
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
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                    />
                  </svg>
                  Keluar dari Akun
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <aside className="sticky top-0 hidden h-dvh w-[260px] shrink-0 flex-col bg-[#063E32] px-4 py-6 text-white shadow-xl lg:flex">
        <div className="flex items-center gap-3 px-2 pb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
              />
              <circle cx="12" cy="11" r="2.2" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold tracking-wider text-white">
              BERKAHID
            </p>
          </div>
        </div>

        <nav className="flex flex-col gap-1" aria-label="Navigasi utama">
          {ITEMS.map((item) => {
            const active = item.activeMatch(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-300/30"
                    : "text-emerald-100/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
          {adminLink}
        </nav>

        <div className="mt-auto flex flex-col gap-4 px-1">
          <div
            className="relative overflow-hidden rounded-2xl bg-cover bg-center p-5 ring-1 ring-white/10"
            style={{ backgroundImage: "url('/quote-card-bg.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 flex flex-col gap-2">
              <p className="text-[13px] font-medium leading-relaxed text-emerald-50">
                “Dirikanlah shalat, sesungguhnya shalat itu mencegah dari (perbuatan) keji dan mungkar.”
              </p>
              <p className="text-[11px] text-emerald-200/80">QS. Al-Ankabut: 45</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white/5 p-2 ring-1 ring-white/10">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400/10 px-3 py-2.5 text-xs font-bold text-emerald-100 ring-1 ring-emerald-300/20 transition-colors hover:bg-emerald-400/20"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                />
              </svg>
              Keluar dari Akun
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
