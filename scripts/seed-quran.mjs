import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SURAHS } from "../src/data/quran/surahs.ts";
import { MOCK_TAFSIR } from "../src/data/quran/mock-tafsir.ts";

const config = JSON.parse(
  await readFile(join(process.cwd(), ".insforge", "project.json"), "utf8"),
);

const OSS_HOST = config.oss_host;
const API_KEY = config.api_key;

if (!OSS_HOST || !API_KEY) {
  console.error("project.json tidak lengkap (oss_host / api_key)");
  process.exit(1);
}

const QURAN_API = "https://api.alquran.cloud/v1/surah";
const BULK_URL = `${OSS_HOST}/api/database/advance/bulk-upsert`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function bulkUpsert(table, rows, upsertKey) {
  const form = new FormData();
  form.append("table", table);
  if (upsertKey) form.append("upsertKey", upsertKey);
  const jsonFile = new Blob([JSON.stringify(rows)], {
    type: "application/json",
  });
  form.append("file", jsonFile, `${table}.json`);

  const response = await fetch(BULK_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${API_KEY}` },
    body: form,
  });
  const text = await response.text();
  console.log(
    `bulk-upsert ${table}: HTTP ${response.status} — ${text.slice(0, 300)}`,
  );
  if (!response.ok) throw new Error(`bulk-upsert ${table} gagal`);
}

async function main() {
  const step = process.argv[2] ?? "all";

  if (step === "all" || step === "surah") {
    console.log("1/3 Seed surah…");
    const surahRows = SURAHS.map((s) => ({
      number: s.number,
      name: s.name,
      arabic_name: s.arabicName,
      meaning: s.meaning,
      ayah_count: s.ayahs,
      start_juz: s.juz,
    }));
    await bulkUpsert("quran_surahs", surahRows, "number");
  }

  if (step === "all" || step === "ayah") {
    console.log("2/3 Seed ayat (fetch Alquran Cloud)…");
    const ayahRows = [];
    for (let surah = 1; surah <= 114; surah++) {
      const res = await fetch(
        `${QURAN_API}/${surah}/editions/quran-uthmani,id.indonesian`,
      );
      if (!res.ok) throw new Error(`surah ${surah}: HTTP ${res.status}`);
      const payload = await res.json();
      const [arabic, indonesian] = payload.data ?? [];
      if (!arabic || !indonesian) throw new Error(`surah ${surah}: editions kurang`);
      for (const ayah of arabic.ayahs) {
        const translation =
          indonesian.ayahs.find((t) => t.numberInSurah === ayah.numberInSurah)
            ?.text ?? "";
        ayahRows.push({
          surah_number: surah,
          ayah_number: ayah.numberInSurah,
          juz: ayah.juz,
          text_uthmani: ayah.text,
          translation,
        });
      }
      if (surah % 20 === 0) console.log(`  ${surah}/114 surah…`);
      await sleep(150);
    }
    console.log(`  total ayat: ${ayahRows.length}`);
    await bulkUpsert("quran_ayahs", ayahRows, null);
  }

  if (step === "all" || step === "tafsir") {
    console.log("3/3 Seed tafsir (ringkas tiruan)…");
    const tafsirRows = Object.entries(MOCK_TAFSIR).map(([key, text]) => {
      const [surah, ayah] = key.split(":").map(Number);
      return { surah_number: surah, ayah_number: ayah, source: "mock", text };
    });
    await bulkUpsert("quran_tafsirs", tafsirRows, null);
  }

  console.log("SELESAI");
}

main().catch((error) => {
  console.error("GAGAL:", error);
  process.exit(1);
});
