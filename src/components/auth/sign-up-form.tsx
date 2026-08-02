"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function SignUpForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Masukkan alamat email yang valid.");
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      setError(
        "Kata sandi minimal 8 karakter dan harus kombinasi huruf dan angka.",
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak sama.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email.trim(), password);
    if (!result.ok) {
      setError(result.error ?? "Gagal membuat akun.");
      setSubmitting(false);
      return;
    }
    router.replace(
      `/verifikasi-email?email=${encodeURIComponent(email.trim())}`,
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="signup-email" className="text-xs font-semibold text-emerald-100">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@contoh.com"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="text-xs font-semibold text-emerald-100">
          Kata Sandi
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minimal 8 karakter, huruf & angka"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
        <p className="mt-1 text-[11px] text-emerald-100/50">
          Minimal 8 karakter dengan kombinasi huruf dan angka.
        </p>
      </div>
      <div>
        <label htmlFor="signup-confirm" className="text-xs font-semibold text-emerald-100">
          Konfirmasi Kata Sandi
        </label>
        <input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Ulangi kata sandi"
          className="mt-1.5 w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40 focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/30"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl bg-amber-400/15 px-4 py-3 text-xs leading-relaxed text-amber-200 ring-1 ring-amber-300/30"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-2xl bg-emerald-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-colors hover:bg-emerald-400 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
      >
        {submitting ? "Membuat akun…" : "Daftar"}
      </button>

      <p className="text-center text-xs text-emerald-100/70">
        Sudah punya akun?{" "}
        <Link href="/masuk" className="font-bold text-emerald-300 hover:text-emerald-200">
          Masuk sekarang
        </Link>
      </p>
    </form>
  );
}
