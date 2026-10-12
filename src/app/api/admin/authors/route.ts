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
    [{ count: total }] = await sql`
      SELECT COUNT(DISTINCT author_key)::int AS count FROM rubrics WHERE author_name ILIKE ${pattern}
    `;
    rows = await sql`
      SELECT author_key, author_name,
             COUNT(*)::int AS rubric_count,
             (SELECT COUNT(*)::int FROM responses WHERE rubric_id IN (SELECT id FROM rubrics r2 WHERE r2.author_key = rubrics.author_key)) AS response_count,
             MIN(created_at) AS first_rubric,
             MAX(created_at) AS last_rubric
      FROM rubrics
      WHERE author_name ILIKE ${pattern}
      GROUP BY author_key, author_name
      ORDER BY last_rubric DESC
      OFFSET ${offset} LIMIT ${limit}
    `;
  } else {
    [{ count: total }] = await sql`SELECT COUNT(DISTINCT author_key)::int AS count FROM rubrics`;
    rows = await sql`
      SELECT author_key, author_name,
             COUNT(*)::int AS rubric_count,
             (SELECT COUNT(*)::int FROM responses WHERE rubric_id IN (SELECT id FROM rubrics r2 WHERE r2.author_key = rubrics.author_key)) AS response_count,
             MIN(created_at) AS first_rubric,
             MAX(created_at) AS last_rubric
      FROM rubrics
      GROUP BY author_key, author_name
      ORDER BY last_rubric DESC
      OFFSET ${offset} LIMIT ${limit}
    `;
  }

  return NextResponse.json({ rows, total, offset, limit });
}
