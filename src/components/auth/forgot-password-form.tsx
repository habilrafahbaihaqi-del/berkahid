"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    setSubmitting(true);
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const payload = (await response.json().catch(() => ({}))) as {
      error?: string;
    };
    if (!response.ok) {
      setError(payload.error ?? "Gagal mengirim. Coba lagi.");
      setSubmitting(false);
      return;
    }
    setSent(true);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-300/30">
          <svg className="h-8 w-8 text-emerald-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-bold">Periksa Email Kamu</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-emerald-100/70">
            Jika email terdaftar, tautan reset kata sandi dikirim ke{" "}
            <span className="font-semibold text-emerald-200">{email.trim()}</span>.
          </p>
        </div>
        <Link
          href="/reset-password"
          className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-400"
        >
          Lanjut ke Reset
        </Link>
        <Link href="/masuk" className="text-xs font-semibold text-emerald-300 hover:text-emerald-200">
          Kembali ke Masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <p className="text-xs leading-relaxed text-emerald-100/70">
        Masukkan email akunmu. Kami akan mengirimkan tautan untuk mengatur
        ulang kata sandi.
      </p>
      <div>
        <label htmlFor="forgot-email" className="text-xs font-semibold text-emerald-100">
          Email
        </label>
        <input
          id="forgot-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@contoh.com"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>
      {error && (
        <p role="alert" className="rounded-2xl bg-amber-400/15 px-4 py-3 text-xs text-amber-200 ring-1 ring-amber-300/30">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400 disabled:opacity-60"
      >
        {submitting ? "Mengirim…" : "Kirim Tautan Reset"}
      </button>
      <Link href="/masuk" className="text-center text-xs font-semibold text-emerald-300 hover:text-emerald-200">
        Kembali ke Masuk
      </Link>
    </form>
  );
}
