import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type") || "rubrics";
  const format = req.nextUrl.searchParams.get("format") || "json";

  let rows;
  if (type === "responses") {
    rows = await sql`
      SELECT r.id, r.rubric_id, rb.title AS rubric_title, r.evaluator_name, r.role, r.scores, r.comment, r.submitted_at
      FROM responses r
      LEFT JOIN rubrics rb ON rb.id = r.rubric_id
      ORDER BY r.submitted_at DESC
    `;
  } else {
    rows = await sql`
      SELECT id, org, title, description, author_name, dimensions, scale, created_at,
             CASE WHEN password_hash IS NOT NULL THEN true ELSE false END AS has_password
      FROM rubrics
      ORDER BY created_at DESC
    `;
  }

  if (format === "csv") {
    if (rows.length === 0) {
      return new NextResponse("", { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="${type}.csv"` } });
    }
    const headers = Object.keys(rows[0]);
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((h) => {
            const val = row[h];
            const str = typeof val === "object" ? JSON.stringify(val) : String(val ?? "");
            return `"${str.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ];
    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}.csv"`,
      },
    });
  }

  return NextResponse.json(rows);
}
