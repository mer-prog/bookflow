import { NextResponse } from "next/server";
import { auth } from "./auth";

/**
 * Require authenticated session. Returns session or error response.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "認証が必要です" }, { status: 401 }) };
  }
  return { session, error: null };
}

/**
 * Require admin role. Returns session or error response.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { session: null, error: NextResponse.json({ error: "認証が必要です" }, { status: 401 }) };
  }
  if ((session.user as Record<string, unknown>).role !== "ADMIN") {
    return { session: null, error: NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 }) };
  }
  return { session, error: null };
}
