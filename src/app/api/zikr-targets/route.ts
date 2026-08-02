import { NextRequest, NextResponse } from "next/server";
import { createInsForgeServerClient } from "@/lib/insforge/server";

export const dynamic = "force-dynamic";

interface TargetRow {
  id: string;
  zikr_id: string;
  target_count: number;
  current_count: number;
  target_date: string;
}

interface ZikrRow {
  id: string;
  name: string;
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isValidUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

export async function GET() {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { data: zikrRows, error: zikrError } = await insforge.database
    .from("zikrs")
    .select("id, name");

  if (zikrError) {
    return NextResponse.json(
      { error: "Gagal memuat katalog zikir." },
      { status: 500 },
    );
  }

  const zikrNameById = new Map(
    ((zikrRows ?? []) as ZikrRow[]).map((row) => [row.id, row.name]),
  );

  const { data: rows, error: queryError } = await insforge.database
    .from("zikr_targets")
    .select("id, zikr_id, target_count, current_count, target_date")
    .eq("user_id", data.user.id)
    .eq("target_date", localDateString());

  if (queryError) {
    return NextResponse.json(
      { error: "Gagal memuat target zikir." },
      { status: 500 },
    );
  }

  const results = ((rows ?? []) as TargetRow[]).map((row) => ({
    zikrId: row.zikr_id,
    zikrName: zikrNameById.get(row.zikr_id) ?? "Zikir",
    targetCount: row.target_count,
    currentCount: row.current_count,
    targetDate: row.target_date,
  }));

  return NextResponse.json({ results });
}

export async function POST(request: NextRequest) {
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

  const { zikrId, targetCount } = body as Record<string, unknown>;
  if (!isValidUuid(zikrId)) {
    return NextResponse.json(
      { error: "Field \"zikrId\" harus UUID yang valid." },
      { status: 400 },
    );
  }
  const safeTarget = Number(targetCount);
  if (!Number.isInteger(safeTarget) || safeTarget < 1 || safeTarget > 100000) {
    return NextResponse.json(
      { error: "Field \"targetCount\" harus bilangan bulat 1–100000." },
      { status: 400 },
    );
  }

  const today = localDateString();

  const { data: existing, error: selectError } = await insforge.database
    .from("zikr_targets")
    .select("id")
    .eq("user_id", data.user.id)
    .eq("zikr_id", zikrId)
    .eq("target_date", today);

  if (selectError) {
    return NextResponse.json(
      { error: "Gagal memuat target zikir." },
      { status: 500 },
    );
  }

  let result: { data: TargetRow[] | null; error: unknown };

  if ((existing ?? []).length > 0) {
    result = await insforge.database
      .from("zikr_targets")
      .update({ target_count: safeTarget })
      .eq("user_id", data.user.id)
      .eq("zikr_id", zikrId)
      .eq("target_date", today)
      .select("id, zikr_id, target_count, current_count, target_date");
  } else {
    result = await insforge.database
      .from("zikr_targets")
      .insert([
        {
          user_id: data.user.id,
          zikr_id: zikrId,
          target_count: safeTarget,
        },
      ])
      .select("id, zikr_id, target_count, current_count, target_date");
  }

  if (result.error) {
    return NextResponse.json(
      { error: "Gagal menyimpan target zikir." },
      { status: 500 },
    );
  }

  const row = (result.data ?? [])[0] as TargetRow | undefined;
  return NextResponse.json({
    target: row
      ? {
          zikrId: row.zikr_id,
          targetCount: row.target_count,
          currentCount: row.current_count,
          targetDate: row.target_date,
        }
      : null,
  });
}

export async function PATCH(request: NextRequest) {
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

  const { zikrId, action } = body as Record<string, unknown>;
  if (!isValidUuid(zikrId)) {
    return NextResponse.json(
      { error: "Field \"zikrId\" harus UUID yang valid." },
      { status: 400 },
    );
  }
  if (
    action !== "increment" &&
    action !== "decrement" &&
    action !== "check" &&
    action !== "uncheck"
  ) {
    return NextResponse.json(
      {
        error:
          "Field \"action\" harus \"increment\", \"decrement\", \"check\", atau \"uncheck\".",
      },
      { status: 400 },
    );
  }

  const today = localDateString();

  const { data: existing, error: selectError } = await insforge.database
    .from("zikr_targets")
    .select("id, target_count, current_count")
    .eq("user_id", data.user.id)
    .eq("zikr_id", zikrId)
    .eq("target_date", today);

  if (selectError) {
    return NextResponse.json(
      { error: "Gagal memuat target zikir." },
      { status: 500 },
    );
  }

  const current = ((existing ?? []) as Array<{
    id: string;
    target_count: number;
    current_count: number;
  }>)[0];

  if (!current) {
    return NextResponse.json(
      { error: "Zikir tidak ada di antrian hari ini." },
      { status: 404 },
    );
  }

  const nextCount =
    action === "increment"
      ? Math.min(current.target_count, current.current_count + 1)
      : action === "decrement"
        ? Math.max(0, current.current_count - 1)
        : action === "check"
          ? current.target_count
          : 0;

  const { data: updated, error: updateError } = await insforge.database
    .from("zikr_targets")
    .update({ current_count: nextCount })
    .eq("id", current.id)
    .select("id, zikr_id, target_count, current_count, target_date");

  if (updateError) {
    return NextResponse.json(
      { error: "Gagal memperbarui antrian zikir." },
      { status: 500 },
    );
  }

  const row = (updated ?? [])[0] as TargetRow | undefined;
  return NextResponse.json({
    target: row
      ? {
          zikrId: row.zikr_id,
          targetCount: row.target_count,
          currentCount: row.current_count,
          targetDate: row.target_date,
        }
      : null,
  });
}

export async function DELETE(request: NextRequest) {
  const insforge = await createInsForgeServerClient();
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) {
    return NextResponse.json({ error: "Tidak terautentikasi." }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const zikrId = searchParams.get("zikrId");
  if (!isValidUuid(zikrId)) {
    return NextResponse.json(
      { error: "Parameter \"zikrId\" harus UUID yang valid." },
      { status: 400 },
    );
  }

  const { error: deleteError } = await insforge.database
    .from("zikr_targets")
    .delete()
    .eq("user_id", data.user.id)
    .eq("zikr_id", zikrId)
    .eq("target_date", localDateString());

  if (deleteError) {
    return NextResponse.json(
      { error: "Gagal menghapus dari antrian." },
      { status: 500 },
    );
  }

  return new NextResponse(null, { status: 204 });
}
