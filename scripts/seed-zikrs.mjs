import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { createAdminClient } from "@insforge/sdk";
import { MOCK_ZIKRS, ZIKR_CATEGORIES } from "../src/data/zikrs.ts";

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
  .from("zikr_categories")
  .select("id, name");

if (catError) throw new Error(`gagal ambil kategori: ${JSON.stringify(catError)}`);

const existingMap = new Map(
  (existingCategories ?? []).map((c) => [c.name, c.id]),
);

const missing = ZIKR_CATEGORIES.filter((c) => !existingMap.has(c));
if (missing.length > 0) {
  const { data: inserted, error: insertError } = await admin.database
    .from("zikr_categories")
    .insert(missing.map((name) => ({ name })))
    .select("id, name");
  if (insertError) throw new Error(`gagal insert kategori: ${JSON.stringify(insertError)}`);
  for (const row of inserted ?? []) existingMap.set(row.name, row.id);
}

const zikrNames = MOCK_ZIKRS.map((z) => z.name);
const { error: deleteError } = await admin.database
  .from("zikrs")
  .delete()
  .in("name", zikrNames);
if (deleteError) throw new Error(`gagal bersihkan zikrs: ${JSON.stringify(deleteError)}`);

const rows = MOCK_ZIKRS.map((z) => ({
  name: z.name,
  arabic_text: z.arabicText,
  meaning: z.meaning,
  explanation: z.explanation,
  category_id: existingMap.get(z.category) ?? null,
}));

const { data: insertedZikrs, error: zikrError } = await admin.database
  .from("zikrs")
  .insert(rows)
  .select("id, name");

if (zikrError) throw new Error(`gagal insert zikrs: ${JSON.stringify(zikrError)}`);

console.log(`Kategori: ${ZIKR_CATEGORIES.length}, Zikir ter-seed: ${(insertedZikrs ?? []).length}`);
