import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@insforge/sdk/ssr/middleware";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/quran",
  "/zikir",
  "/doa",
  "/cerita",
  "/kalender",
  "/lokasi",
  "/kiblat",
  "/pengaturan",
];

const ADMIN_PREFIX = "/admin";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64Url.padEnd(
    base64Url.length + ((4 - (base64Url.length % 4)) % 4),
    "=",
  );
  try {
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function isAdminUser(userId: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL ?? "";
  const apiKey = process.env.INSFORGE_API_KEY ?? "";
  if (!baseUrl || !apiKey) return false;
  try {
    const url = new URL("/api/database/records/user_profiles", baseUrl);
    url.searchParams.set("user_id", `eq.${userId}`);
    url.searchParams.set("select", "role");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });
    if (!response.ok) return false;
    const rows = (await response.json()) as { role?: string }[];
    return rows[0]?.role === "admin";
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const { accessToken } = await updateSession({
    requestCookies: request.cookies,
    responseCookies: response.cookies,
  });

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (isProtected && !accessToken) {
    const url = new URL("/masuk", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith(ADMIN_PREFIX)) {
    if (!accessToken) {
      const url = new URL("/masuk", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
    const payload = decodeJwtPayload(accessToken);
    const userId = typeof payload?.sub === "string" ? payload.sub : null;
    if (!userId || !(await isAdminUser(userId))) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|verifikasi-email|verifikasi-berhasil|masuk|daftar|lupa-password|reset-password).*)",
  ],
};
