"use client";

import { useEffect, useState } from "react";
import { applyAutoLocation } from "@/lib/geo";
import { dismissLocationPrompt } from "@/lib/location-store";

interface LocationPermissionDialogProps {
  open: boolean;
  onClose: () => void;
  onRequestManual: () => void;
}

export default function LocationPermissionDialog({
  open,
  onClose,
  onRequestManual,
}: LocationPermissionDialogProps) {
  const [state, setState] = useState<"idle" | "locating" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const detectLocation = async () => {
    setState("locating");
    setErrorMessage("");
    try {
      await applyAutoLocation();
      dismissLocationPrompt();
      onClose();
    } catch (error) {
      setState("error");
      if (
        error instanceof Error &&
        error.name === "NotAllowedError"
      ) {
        setErrorMessage(
          "Izin lokasi ditolak. Kamu bisa pilih lokasi secara manual.",
        );
      } else {
        setErrorMessage(
          "Gagal mendeteksi lokasi. Coba lagi atau pilih secara manual.",
        );
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Izin lokasi otomatis"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 pb-8 text-emerald-950 shadow-2xl sm:rounded-3xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-emerald-200 sm:hidden" />

        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
          <svg
            className="h-7 w-7 text-emerald-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-lg font-bold">Gunakan lokasi otomatis?</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-emerald-900/70">
          Izinkan browser mendeteksi posisimu agar jadwal sholat dan arah kiblat
          sesuai lokasi. Kamu bisa mengganti atau memperbarui lokasi kapan saja.
        </p>

        {state === "error" && (
          <p className="mt-3 rounded-xl bg-amber-50 px-3.5 py-2.5 text-xs text-amber-800">
            {errorMessage}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={detectLocation}
            disabled={state === "locating"}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-800 disabled:opacity-60"
          >
            {state === "locating" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z"
                  />
                </svg>
                Mendeteksi lokasi…
              </>
            ) : (
              "Deteksi lokasi otomatis"
            )}
          </button>
          <button
            type="button"
            onClick={onRequestManual}
            disabled={state === "locating"}
            className="w-full rounded-2xl border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 disabled:opacity-60"
          >
            Pilih lokasi manual
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs text-emerald-900/50 hover:text-emerald-900/80"
          >
            Nanti saja
          </button>
        </div>
      </div>
    </div>
  );
}
