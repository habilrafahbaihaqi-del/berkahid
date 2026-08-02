import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verifikasi Berhasil — BerkahID",
};

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white">
      <main className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 pb-16 pt-14 text-center">
        <Link href="/" className="flex items-center gap-3">
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
        </Link>

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-300/40">
          <svg className="h-10 w-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold">Email Terverifikasi!</h1>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
            Akun kamu sudah aktif. Sekarang kamu bisa masuk dan mulai
            menggunakan seluruh fitur BerkahID.
          </p>
        </div>

        <div className="w-full rounded-3xl bg-white/10 p-5 text-left ring-1 ring-white/15">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Yang bisa kamu lakukan sekarang
          </h2>
          <ul className="mt-3 flex flex-col gap-2.5 text-xs leading-relaxed text-emerald-100/70">
            <li className="flex gap-2.5">
              <svg className="h-4 w-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Melihat jadwal sholat sesuai lokasimu.
            </li>
            <li className="flex gap-2.5">
              <svg className="h-4 w-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Menyimpan progress bacaan Al-Qur&apos;an.
            </li>
            <li className="flex gap-2.5">
              <svg className="h-4 w-4 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              Menata target zikir harian dan doa favoritmu.
            </li>
          </ul>
        </div>

        <Link
          href="/masuk"
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
        >
          Lanjut ke Masuk
        </Link>
      </main>
    </div>
  );
}
