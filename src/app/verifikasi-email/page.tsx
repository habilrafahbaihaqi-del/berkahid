import type { Metadata } from "next";
import Link from "next/link";
import ResendVerificationButton from "@/components/auth/resend-verification-button";

export const metadata: Metadata = {
  title: "Cek Email — BerkahID",
};

interface VerifyEmailPageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { email } = await searchParams;
  const displayEmail = email ?? "email kamu";

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

        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/30">
          <svg className="h-10 w-10 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-xl font-bold">Periksa Email Kamu</h1>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
            Kami telah mengirim tautan verifikasi ke{" "}
            <span className="font-semibold text-emerald-200">{displayEmail}</span>
            . Klik tautan tersebut untuk mengaktifkan akunmu sebelum masuk.
          </p>
        </div>

        <div className="w-full rounded-3xl bg-white/10 p-5 text-left ring-1 ring-white/15">
          <h2 className="text-xs font-bold uppercase tracking-widest text-emerald-300">
            Langkah selanjutnya
          </h2>
          <ol className="mt-3 flex flex-col gap-2.5 text-xs leading-relaxed text-emerald-100/70">
            <li className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
                1
              </span>
              Buka kotak masuk {displayEmail}.
            </li>
            <li className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
                2
              </span>
              Cari email dari BerkahID dan klik tautan verifikasi.
            </li>
            <li className="flex gap-2.5">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/20 text-[10px] font-bold text-emerald-200">
                3
              </span>
              Kembali ke sini lalu masuk dengan akunmu.
            </li>
          </ol>
        </div>

        <ResendVerificationButton email={displayEmail} />

        <Link
          href="/masuk"
          className="text-xs font-semibold text-emerald-300 hover:text-emerald-200"
        >
          Sudah verifikasi? Masuk sekarang →
        </Link>
      </main>
    </div>
  );
}
