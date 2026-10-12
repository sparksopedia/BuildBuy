import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 100);

  const [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM admin_audit_log`;
  const rows = await sql`
    SELECT * FROM admin_audit_log
    ORDER BY created_at DESC
    OFFSET ${offset} LIMIT ${limit}
  `;

  return NextResponse.json({ rows, total, offset, limit });
}
