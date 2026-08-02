import type { Metadata } from "next";
import StoryList from "@/components/story/story-list";

export const metadata: Metadata = {
  title: "Cerita Islami",
};

export default function StoriesPage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-emerald-800 via-emerald-700 to-teal-900 text-white">
      <StoryList />
    </div>
  );
}
