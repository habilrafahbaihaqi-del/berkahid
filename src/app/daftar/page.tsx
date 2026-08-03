import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AuthRedirect from "@/components/auth/auth-redirect";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Daftar — BerkahID",
};

export default function SignUpPage() {
  return (
    <div className="min-h-dvh flex bg-white font-sans text-gray-900">
      <AuthRedirect />
      
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
          <h2 className="text-3xl font-bold mb-1">Mulai Perjalanan</h2>
          <h3 className="text-2xl font-bold text-emerald-400 mb-4">Ibadahmu Bersama Kami</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
            Buat akun untuk mengatur jadwal sholat, pantau progres Al-Qur&apos;an, dan capai target zikir harianmu.
          </p>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center mb-3">
                 <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                 </svg>
              </div>
              <h4 className="text-[11px] font-bold mb-1">Aman & Terpercaya</h4>
              <p className="text-[10px] text-emerald-200/60 leading-tight">Data pribadimu terlindungi</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center mb-3">
                 <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                 </svg>
              </div>
              <h4 className="text-[11px] font-bold mb-1">Lengkap & Terintegrasi</h4>
              <p className="text-[10px] text-emerald-200/60 leading-tight">Semua kebutuhan ibadah</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-800 flex items-center justify-center mb-3">
                 <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                 </svg>
              </div>
              <h4 className="text-[11px] font-bold mb-1">Gratis & Bermanfaat</h4>
              <p className="text-[10px] text-emerald-200/60 leading-tight">Dibuat untuk kebaikan</p>
            </div>
          </div>
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

          <div className="mb-10 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Buat Akun</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Gratis dan mudah. Verifikasi email wajib sebelum <br className="hidden lg:block"/>masuk ke aplikasi.
            </p>
          </div>

          <SignUpForm />

          <div className="mt-12 bg-gray-50/50 rounded-2xl p-4 flex items-start gap-3 border border-gray-100">
            <div className="mt-0.5 rounded-full bg-emerald-100 p-1">
              <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Autentikasi terjamin untuk pengembangan — integrasi layanan asli menyusul.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
