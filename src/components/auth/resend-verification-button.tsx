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
      className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-600 transition-colors hover:bg-emerald-100 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
    >
      Kirim Ulang Email Verifikasi
    </button>
  );
}
