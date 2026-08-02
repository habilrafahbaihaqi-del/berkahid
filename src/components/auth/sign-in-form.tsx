"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    if (!password) {
      setError("Kata sandi wajib diisi.");
      return;
    }
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="login-email" className="text-xs font-semibold text-emerald-100">
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@contoh.com"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-xs font-semibold text-emerald-100">
            Kata Sandi
          </label>
          <Link
            href="/lupa-password"
            className="text-[11px] font-semibold text-emerald-300 hover:text-emerald-200"
          >
            Lupa kata sandi?
          </Link>
        </div>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-amber-400/15 px-4 py-3 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-300/30"
        >
          {error}
          {error.includes("belum diverifikasi") && (
            <Link
              href={`/verifikasi-email?email=${encodeURIComponent(email.trim())}`}
              className="mt-1 block font-bold text-amber-100 underline underline-offset-2 hover:text-white"
            >
              Kirim ulang tautan verifikasi
            </Link>
          )}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
      >
        {submitting ? "Memproses…" : "Masuk"}
      </button>

      <p className="text-center text-xs text-emerald-100/70">
        Belum punya akun?{" "}
        <Link href="/daftar" className="font-bold text-emerald-300 hover:text-emerald-200">
          Daftar sekarang
        </Link>
      </p>
    </form>
  );
}
