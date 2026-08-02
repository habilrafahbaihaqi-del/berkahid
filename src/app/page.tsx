import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthRedirect from "@/components/auth/auth-redirect";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const metadata: Metadata = {
  title: "BerkahID — Portal Islami Terpadu",
};

const FEATURES = [
  {
    title: "Jadwal Sholat",
    description: "Jadwal akurat sesuai lokasi dengan notifikasi adzan.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
      />
    ),
  },
  {
    title: "Al-Qur'an",
    description: "Baca ayat, terjemahan, dan tafsir dengan progress tersimpan.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
      />
    ),
  },
  {
    title: "Zikir Harian",
    description: "Atur target zikir dan pantau amalan harianmu.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  {
    title: "Doa Harian",
    description: "Kumpulan doa lengkap dengan arti, dikelompokkan per tema.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    ),
  },
  {
    title: "Cerita Islami",
    description: "Kisah Nabi, sahabat, dan inspirasi untuk menambah keimanan.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25m-3.75.75h.008v.008h-.008v-.008Z"
      />
    ),
  },
  {
    title: "Arah Kiblat",
    description: "Kompas digital untuk menemukan arah kiblat dari lokasimu.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
      />
    ),
  },
];

export default async function LandingPage() {
  try {
    const insforge = await createInsForgeServerClient();
    const { data } = await insforge.auth.getCurrentUser();
    if (data?.user) {
      redirect("/dashboard");
    }
  } catch {
    // Sesi tidak dapat diverifikasi — tampilkan landing page
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white">
      <AuthRedirect />
      <main className="mx-auto flex max-w-3xl flex-col items-center gap-10 px-6 pb-16 pt-12">
        <header className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z"
                />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-200">
              BerkahID
            </span>
          </div>
          <nav className="flex items-center gap-2" aria-label="Autentikasi">
            <Link
              href="/masuk"
              className="rounded-full px-4 py-2 text-xs font-semibold text-emerald-100 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
            >
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
            >
              Daftar
            </Link>
          </nav>
        </header>

        <section className="flex flex-col items-center gap-5 text-center">
          <span className="rounded-full bg-emerald-400/15 px-3.5 py-1.5 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-300/30">
            Portal Islami Terpadu
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Ibadah Harian,
            <br />
            <span className="text-emerald-300">Lebih Teratur &amp; Bermakna</span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-emerald-100/80 sm:text-base">
            Jadwal sholat akurat, bacaan Al-Qur&apos;an dengan progress, target
            zikir harian, doa, cerita Islami, dan arah kiblat — semua dalam satu
            aplikasi yang menemanimu setiap hari.
          </p>
          <div className="mt-2 flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/daftar"
              className="rounded-2xl bg-emerald-500 px-8 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
            >
              Daftar Sekarang
            </Link>
            <Link
              href="/masuk"
              className="rounded-2xl border border-white/25 px-8 py-3.5 text-center text-sm font-semibold text-emerald-100 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
            >
              Masuk
            </Link>
          </div>
        </section>

        <section className="w-full">
          <h2 className="text-center text-lg font-bold text-emerald-100">
            Fitur Lengkap untuk Ibadahmu
          </h2>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 ring-1 ring-emerald-300/30">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    aria-hidden
                  >
                    {feature.icon}
                  </svg>
                </span>
                <h3 className="mt-3 text-sm font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-emerald-100/70">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="w-full rounded-3xl bg-emerald-400/15 p-6 text-center ring-1 ring-emerald-300/30">
          <h2 className="text-base font-bold text-white">
            Siap Membangun Kebiasaan Ibadah yang Konsisten?
          </h2>
          <p className="mt-1.5 text-xs text-emerald-100/80">
            Buat akun gratis — hanya butuh email dan kata sandi.
          </p>
          <Link
            href="/daftar"
            className="mt-4 inline-block rounded-2xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
          >
            Buat Akun
          </Link>
        </section>

        <footer className="text-center text-[11px] text-emerald-200/50">
          BerkahID — Portal Islami Terpadu. Data tiruan untuk pengembangan.
        </footer>
      </main>
    </div>
  );
}
