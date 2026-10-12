import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rubricId = req.nextUrl.searchParams.get("rubric_id");
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 100);

  let rows;
  let total;
  if (rubricId) {
    [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM responses WHERE rubric_id = ${rubricId}`;
    rows = await sql`
      SELECT r.*, rb.title AS rubric_title
      FROM responses r
      LEFT JOIN rubrics rb ON rb.id = r.rubric_id
      WHERE r.rubric_id = ${rubricId}
      ORDER BY r.submitted_at DESC
      OFFSET ${offset} LIMIT ${limit}
    `;
  } else {
    [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM responses`;
    rows = await sql`
      SELECT r.*, rb.title AS rubric_title
      FROM responses r
      LEFT JOIN rubrics rb ON rb.id = r.rubric_id
      ORDER BY r.submitted_at DESC
      OFFSET ${offset} LIMIT ${limit}
    `;
  }

  return NextResponse.json({ rows, total, offset, limit });
}

export async function DELETE(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await sql`DELETE FROM responses WHERE id = ${id}::uuid`;
  await sql`INSERT INTO admin_audit_log (action, target_type, target_id) VALUES ('delete_response', 'response', ${id})`;

  return NextResponse.json({ ok: true });
}
