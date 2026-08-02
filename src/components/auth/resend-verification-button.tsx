"use client";

export default function ResendVerificationButton({
  email,
}: {
  email: string;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        window.alert("Tautan verifikasi tiruan dikirim ulang ke " + email);
      }}
      className="w-full rounded-2xl border border-emerald-300/30 bg-emerald-400/15 px-4 py-3 text-sm font-semibold text-emerald-200 transition-colors hover:bg-emerald-400/25 focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:outline-none"
    >
      Kirim Ulang Email Verifikasi
    </button>
  );
}
