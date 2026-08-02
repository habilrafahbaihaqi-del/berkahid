import { NextRequest, NextResponse } from "next/server";
import { FARDHU_KEYS, type FardhuKey } from "@/data/mock-prayer-times";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

const PER_PRAYER_DB_COLUMNS: Record<FardhuKey, string> = {
  subuh: "subuh_enabled",
  dzuhur: "dzuhur_enabled",
  ashar: "ashar_enabled",
  maghrib: "maghrib_enabled",
  isya: "isya_enabled",
};

interface NotificationPreferencesRow {
  id: string;
  sound: string;
  reminder_minutes: number;
  subuh_enabled: boolean;
  dzuhur_enabled: boolean;
  ashar_enabled: boolean;
  maghrib_enabled: boolean;
  isya_enabled: boolean;
}

function toApi(row: NotificationPreferencesRow) {
  return {
    sound: row.sound,
    reminderMinutes: row.reminder_minutes,
    perPrayer: {
      subuh: row.subuh_enabled,
      dzuhur: row.dzuhur_enabled,
      ashar: row.ashar_enabled,
      maghrib: row.maghrib_enabled,
      isya: row.isya_enabled,
    },
  };
}

function validateSound(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 100;
}

function validateReminderMinutes(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0 &&
    value <= 120
  );
}

function validatePerPrayer(value: unknown): value is Record<FardhuKey, boolean> {
  if (typeof value !== "object" || value === null) return false;
  return FARDHU_KEYS.every(
    (key) => typeof (value as Record<string, unknown>)[key] === "boolean",
  );
}

export async function GET() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { data: rows, error: queryError } = await insforge.database
    .from("notification_preferences")
    .select()
    .eq("user_id", data.user.id);

  if (queryError) {
    return NextResponse.json(
      { error: "Gagal memuat pengaturan notifikasi." },
      { status: 500 },
    );
  }

  const row = (rows ?? [])[0] as NotificationPreferencesRow | undefined;
  return NextResponse.json({ preferences: row ? toApi(row) : null });
}

export async function PUT(request: NextRequest) {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const patch = body as Record<string, unknown>;
  const updates: Record<string, unknown> = {};

  if (patch.sound !== undefined) {
    if (!validateSound(patch.sound)) {
      return NextResponse.json(
        { error: "Field \"sound\" harus berupa teks 1–100 karakter." },
        { status: 400 },
      );
    }
    updates.sound = patch.sound.trim();
  }

  if (patch.reminderMinutes !== undefined) {
    if (!validateReminderMinutes(patch.reminderMinutes)) {
      return NextResponse.json(
        { error: "Field \"reminderMinutes\" harus bilangan bulat 0–120." },
        { status: 400 },
      );
    }
    updates.reminder_minutes = patch.reminderMinutes;
  }

  if (patch.perPrayer !== undefined) {
    if (!validatePerPrayer(patch.perPrayer)) {
      return NextResponse.json(
        { error: "Field \"perPrayer\" harus berisi boolean untuk setiap waktu sholat." },
        { status: 400 },
      );
    }
    for (const key of FARDHU_KEYS) {
      updates[PER_PRAYER_DB_COLUMNS[key]] = patch.perPrayer[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Tidak ada field yang dapat diperbarui." },
      { status: 400 },
    );
  }

  const { data: existing, error: selectError } = await insforge.database
    .from("notification_preferences")
    .select("id")
    .eq("user_id", data.user.id);

  if (selectError) {
    return NextResponse.json(
      { error: "Gagal memuat pengaturan notifikasi." },
      { status: 500 },
    );
  }

  let result: { data: NotificationPreferencesRow[] | null; error: unknown };

  if ((existing ?? []).length > 0) {
    result = await insforge.database
      .from("notification_preferences")
      .update(updates)
      .eq("user_id", data.user.id)
      .select();
  } else {
    result = await insforge.database
      .from("notification_preferences")
      .insert([{ user_id: data.user.id, ...updates }])
      .select();
  }

  if (result.error) {
    return NextResponse.json(
      { error: "Gagal menyimpan pengaturan notifikasi." },
      { status: 500 },
    );
  }

  const row = (result.data ?? [])[0] as NotificationPreferencesRow | undefined;
  return NextResponse.json({ preferences: row ? toApi(row) : null });
}

export async function DELETE() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { error: deleteError } = await insforge.database
    .from("notification_preferences")
    .delete()
    .eq("user_id", data.user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: "Gagal menghapus pengaturan notifikasi." },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
