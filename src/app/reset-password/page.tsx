import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Kata Sandi — BerkahID",
};

export default function ResetPasswordPage() {
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
          <h2 className="text-3xl font-bold mb-1">Mulai Kembali</h2>
          <h3 className="text-2xl font-bold text-emerald-400 mb-4">Buat Kata Sandi Baru</h3>
          <p className="text-emerald-100/80 text-sm leading-relaxed mb-8">
            Buat kata sandi yang lebih kuat dan mudah diingat. Jaga kerahasiaan kata sandimu untuk keamanan data pribadi.
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

          <div className="mb-10 text-center lg:text-left">
            <div className="mx-auto lg:mx-0 w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3">Reset Kata Sandi</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Buat kata sandi baru untuk akunmu.
            </p>
          </div>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
