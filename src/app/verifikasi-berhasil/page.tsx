import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Verifikasi Berhasil — BerkahID",
};

export default function VerificationSuccessPage() {
  return (
    <div className="min-h-dvh flex bg-white font-sans text-gray-900">
      
      {/* Left Side - Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex w-[45%] bg-emerald-950 p-10 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-800/40 via-emerald-950 to-emerald-950 -z-10"></div>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative z-10 w-max">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
              <circle cx="12" cy="11" r="2.2" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-wider text-emerald-50">
            BERKAHID
          </span>
        </Link>

        {/* Illustration */}
        <div className="relative flex-1 w-full flex items-center justify-center my-10 z-10">
           <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-emerald-800/50">
             <Image src="/auth-illustration.jpg" alt="Ilustrasi Islami" fill className="object-cover" priority />
           </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10 text-emerald-50 w-full max-w-sm mx-auto">
          <h2 className="text-3xl font-bold mb-1">Alhamdulillah</h2>
          <h3 className="text-2xl font-bold text-emerald-400 mb-4">Siap Memulai Kebaikan</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
            Akunmu telah diverifikasi sepenuhnya. Mari mulai perjalanan ibadahmu dengan memanfaatkan seluruh fitur BerkahID secara gratis.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-16 md:px-24 py-12 overflow-y-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-10 flex justify-center">
             <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.1-6-10a6 6 0 1 1 12 0c0 4.9-6 10-6 10Z" />
                  <circle cx="12" cy="11" r="2.2" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-wider text-emerald-950">
                BERKAHID
              </span>
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start">
            <div className="mx-auto lg:mx-0 w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50">
              <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Email Terverifikasi!</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Akun kamu sudah aktif. Sekarang kamu bisa masuk dan mulai
              menggunakan seluruh fitur BerkahID.
            </p>
          </div>

          <div className="w-full rounded-3xl bg-gray-50 p-6 border border-gray-100 mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Yang bisa kamu lakukan sekarang
            </h2>
            <ul className="flex flex-col gap-4 text-sm leading-relaxed text-gray-700">
              <li className="flex gap-4 items-start">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span>Melihat jadwal sholat sesuai lokasimu.</span>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span>Menyimpan progress bacaan Al-Qur&apos;an.</span>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <span>Menata target zikir harian dan doa favoritmu.</span>
              </li>
            </ul>
          </div>

          <Link
            href="/masuk"
            className="w-full flex justify-center rounded-2xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-700 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
          >
            Lanjut ke Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
