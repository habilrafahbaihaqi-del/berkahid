"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackInner() {
  const searchParams = useSearchParams();
  const status = searchParams.get("insforge_status");
  const type = searchParams.get("insforge_type");
  const verified = status === "success" || type === "email-verified";

  if (verified) {
    return (
      <>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20 ring-1 ring-emerald-300/40">
          <svg className="h-10 w-10 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold">Email Terverifikasi!</h1>
          <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
            Akun kamu sudah aktif. Sekarang kamu bisa masuk dan mulai
            menggunakan seluruh fitur BerkahID.
          </p>
        </div>
        <Link
          href="/masuk"
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400"
        >
          Lanjut ke Masuk
        </Link>
      </>
    );
  }

  return (
    <>
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/15 ring-1 ring-amber-300/30">
        <svg className="h-10 w-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.008v.008H12v-.008ZM12 3.75 2.25 21h19.5L12 3.75Z"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold">Verifikasi Gagal</h1>
        <p className="mt-2 text-sm leading-relaxed text-emerald-100/80">
          Tautan verifikasi tidak valid atau sudah kedaluwarsa. Silakan daftar
          ulang atau hubungi dukungan.
        </p>
      </div>
      <Link
        href="/daftar"
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400"
      >
        Daftar Ulang
      </Link>
    </>
  );
}

export default function VerificationCallbackContent() {
  return (
    <Suspense fallback={null}>
      <CallbackInner />
    </Suspense>
  );
}
