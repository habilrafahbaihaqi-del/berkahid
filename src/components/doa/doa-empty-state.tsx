"use client";

import Link from "next/link";

export default function DoaEmptyState({
  message,
  actionHref,
  actionLabel,
}: {
  message: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/10 px-6 py-12 text-center ring-1 ring-white/15">
      <svg
        className="h-10 w-10 text-emerald-200/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-8.25-3 1.5 1.5 3-3.75"
        />
      </svg>
      <div>
        <h2 className="text-sm font-bold text-white">Kategori kosong</h2>
        <p className="mt-1 text-xs text-emerald-100/70">{message}</p>
      </div>
      <Link
        href={actionHref}
        className="rounded-full bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-400"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
