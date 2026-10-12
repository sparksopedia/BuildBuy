import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get("search") || "";
  const offset = parseInt(req.nextUrl.searchParams.get("offset") || "0", 10);
  const limit = Math.min(parseInt(req.nextUrl.searchParams.get("limit") || "50", 10), 100);

  let rows;
  let total;
  if (search) {
    const pattern = `%${search}%`;
    [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM rubrics WHERE title ILIKE ${pattern} OR author_name ILIKE ${pattern} OR id ILIKE ${pattern}`;
    rows = await sql`
      SELECT id, org, title, author_name, created_at,
             (SELECT COUNT(*)::int FROM responses WHERE rubric_id = rubrics.id) AS response_count,
             CASE WHEN password_hash IS NOT NULL THEN true ELSE false END AS has_password
      FROM rubrics
      WHERE title ILIKE ${pattern} OR author_name ILIKE ${pattern} OR id ILIKE ${pattern}
      ORDER BY created_at DESC
      OFFSET ${offset} LIMIT ${limit}
    `;
  } else {
    [{ count: total }] = await sql`SELECT COUNT(*)::int AS count FROM rubrics`;
    rows = await sql`
      SELECT id, org, title, author_name, created_at,
             (SELECT COUNT(*)::int FROM responses WHERE rubric_id = rubrics.id) AS response_count,
             CASE WHEN password_hash IS NOT NULL THEN true ELSE false END AS has_password
      FROM rubrics
      ORDER BY created_at DESC
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

  await sql`DELETE FROM rubrics WHERE id = ${id}`;
  await sql`INSERT INTO admin_audit_log (action, target_type, target_id) VALUES ('delete_rubric', 'rubric', ${id})`;

  return NextResponse.json({ ok: true });
}
