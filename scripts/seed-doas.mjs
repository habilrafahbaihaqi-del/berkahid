import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createAdminClient } from "@insforge/sdk";
import { DOA_CATEGORIES, MOCK_DOAS } from "../src/data/doas.ts";

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
  .from("doa_categories")
  .select("id, slug");

if (catError) throw new Error(`gagal ambil kategori: ${JSON.stringify(catError)}`);

const existingMap = new Map(
  (existingCategories ?? []).map((c) => [c.slug, c.id]),
);

const missing = DOA_CATEGORIES.filter((c) => !existingMap.has(c.slug));
if (missing.length > 0) {
  const { data: inserted, error: insertError } = await admin.database
    .from("doa_categories")
    .insert(
      missing.map((c) => ({
        name: c.name,
        description: c.description,
        slug: c.slug,
      })),
    )
    .select("id, slug");
  if (insertError) throw new Error(`gagal insert kategori: ${JSON.stringify(insertError)}`);
  for (const row of inserted ?? []) existingMap.set(row.slug, row.id);
}

const doaTitles = MOCK_DOAS.map((d) => d.title);
const { error: deleteError } = await admin.database
  .from("doas")
  .delete()
  .in("title", doaTitles);
if (deleteError) throw new Error(`gagal bersihkan doas: ${JSON.stringify(deleteError)}`);

const rows = MOCK_DOAS.map((d) => ({
  title: d.title,
  arabic_text: d.arabicText,
  translation: d.translation,
  category_id: existingMap.get(d.category) ?? null,
}));

const { data: insertedDoas, error: doaError } = await admin.database
  .from("doas")
  .insert(rows)
  .select("id, title");

if (doaError) throw new Error(`gagal insert doas: ${JSON.stringify(doaError)}`);

console.log(`Kategori: ${DOA_CATEGORIES.length}, Doa ter-seed: ${(insertedDoas ?? []).length}`);
