import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createAdminClient } from "@insforge/sdk";
import { MOCK_STORIES, STORY_CATEGORIES } from "../src/data/stories.ts";

const config = JSON.parse(
  await readFile(join(process.cwd(), ".insforge", "project.json"), "utf8"),
);

if (!config.oss_host || !config.api_key) {
  console.error("project.json tidak lengkap (oss_host / api_key)");
  process.exit(1);
}

const admin = createAdminClient({
  baseUrl: config.oss_host,
  apiKey: config.api_key,
});

const { data: existingCategories, error: catError } = await admin.database
  .from("story_categories")
  .select("id, slug");

if (catError) throw new Error(`gagal ambil kategori: ${JSON.stringify(catError)}`);

const existingMap = new Map(
  (existingCategories ?? []).map((c) => [c.slug, c.id]),
);

const categorySlug = (name) =>
  name
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const missing = STORY_CATEGORIES.filter(
  (c) => !existingMap.has(categorySlug(c)),
);
if (missing.length > 0) {
  const { data: inserted, error: insertError } = await admin.database
    .from("story_categories")
    .insert(missing.map((c) => ({ name: c, slug: categorySlug(c) })))
    .select("id, slug");
  if (insertError) throw new Error(`gagal insert kategori: ${JSON.stringify(insertError)}`);
  for (const row of inserted ?? []) existingMap.set(row.slug, row.id);
}

const storyTitles = MOCK_STORIES.map((s) => s.title);
const { error: deleteError } = await admin.database
  .from("stories")
  .delete()
  .in("title", storyTitles);
if (deleteError) throw new Error(`gagal bersihkan stories: ${JSON.stringify(deleteError)}`);

const rows = MOCK_STORIES.map((s) => ({
  title: s.title,
  summary: s.summary,
  content: s.content,
  category_id: existingMap.get(categorySlug(s.category)) ?? null,
}));

const { data: insertedStories, error: storyError } = await admin.database
  .from("stories")
  .insert(rows)
  .select("id, title");

if (storyError) throw new Error(`gagal insert stories: ${JSON.stringify(storyError)}`);

console.log(`Kategori: ${STORY_CATEGORIES.length}, Cerita ter-seed: ${(insertedStories ?? []).length}`);
