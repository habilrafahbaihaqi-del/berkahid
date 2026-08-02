import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MOCK_STORIES } from "@/data/stories";

interface StoryDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: StoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = MOCK_STORIES.find((s) => s.id === id);
  return {
    title: story ? `${story.title} — Cerita Islami` : "Cerita Islami",
  };
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { id } = await params;
  const story = MOCK_STORIES.find((s) => s.id === id);
  if (!story) notFound();

  const storyIndex = MOCK_STORIES.findIndex((s) => s.id === story.id);
  const prevStory = storyIndex > 0 ? MOCK_STORIES[storyIndex - 1] : null;
  const nextStory =
    storyIndex < MOCK_STORIES.length - 1 ? MOCK_STORIES[storyIndex + 1] : null;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <main className="mx-auto flex max-w-md flex-col gap-4 px-4 pb-10 pt-6 sm:max-w-lg">
        <header className="flex items-center gap-3">
          <Link
            href="/cerita"
            aria-label="Kembali ke daftar cerita"
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
          <div>
            <h1 className="text-base font-bold">Cerita Islami</h1>
            <p className="text-[11px] text-emerald-200/70">
              {story.category} · {storyIndex + 1} dari {MOCK_STORIES.length}
            </p>
          </div>
        </header>

        <section className="rounded-3xl bg-white/10 px-6 py-8 ring-1 ring-white/20">
          <span className="inline-flex w-fit rounded-full bg-emerald-400/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-200 ring-1 ring-emerald-300/30">
            {story.category}
          </span>
          <h2 className="mt-3 text-lg font-bold leading-snug text-white">
            {story.title}
          </h2>
          <p className="mt-2 text-xs italic leading-relaxed text-emerald-200/70">
            {story.summary}
          </p>
        </section>

        <article className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
          {story.content.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm leading-[1.9] text-emerald-50 [text-align:justify] [text-indent:1.5em]"
            >
              {paragraph.trim()}
            </p>
          ))}
        </article>

        <nav
          className="mt-1 flex items-center justify-between gap-3"
          aria-label="Navigasi cerita"
        >
          {prevStory ? (
            <Link
              href={`/cerita/${prevStory.id}`}
              className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              <svg
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <span className="truncate">{prevStory.title}</span>
            </Link>
          ) : (
            <span className="px-4 py-2.5 text-xs text-emerald-100/40">
              Cerita pertama
            </span>
          )}
          {nextStory ? (
            <Link
              href={`/cerita/${nextStory.id}`}
              className="flex min-w-0 items-center gap-1.5 rounded-full bg-white/10 px-4 py-2.5 text-xs font-semibold text-emerald-100 ring-1 ring-white/15 transition-colors hover:bg-white/20"
            >
              <span className="truncate">{nextStory.title}</span>
              <svg
                className="h-3.5 w-3.5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          ) : (
            <span className="px-4 py-2.5 text-xs text-emerald-100/40">
              Cerita terakhir
            </span>
          )}
        </nav>
      </main>
    </div>
  );
}
