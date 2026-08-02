import type { Metadata } from "next";
import Link from "next/link";
import AuthRedirect from "@/components/auth/auth-redirect";
import SignUpForm from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Daftar — BerkahID",
};

export default function SignUpPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-900 via-emerald-800 to-teal-900 text-white">
      <AuthRedirect />
      <main className="mx-auto flex max-w-md flex-col gap-6 px-6 pb-16 pt-12">
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

        <div>
          <h1 className="text-xl font-bold">Buat Akun</h1>
          <p className="mt-1 text-sm text-emerald-100/70">
            Gratis dan mudah. Verifikasi email wajib sebelum masuk.
          </p>
        </div>

        <div className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
          <SignUpForm />
        </div>

        <p className="text-center text-[11px] text-emerald-200/50">
          Autentikasi tiruan untuk pengembangan — integrasi layanan asli menyusul.
        </p>
      </main>
    </div>
  );
}
