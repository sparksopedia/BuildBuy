import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [rubrics] = await sql`SELECT COUNT(*)::int AS count FROM rubrics`;
  const [responses] = await sql`SELECT COUNT(*)::int AS count FROM responses`;
  const [authors] = await sql`SELECT COUNT(DISTINCT author_key)::int AS count FROM rubrics`;
  const [bans] = await sql`SELECT COUNT(*)::int AS count FROM admin_bans`;
  const [recentRubrics] = await sql`SELECT COUNT(*)::int AS count FROM rubrics WHERE created_at > now() - interval '7 days'`;
  const [recentResponses] = await sql`SELECT COUNT(*)::int AS count FROM responses WHERE submitted_at > now() - interval '7 days'`;

  return NextResponse.json({
    totalRubrics: rubrics.count,
    totalResponses: responses.count,
    totalAuthors: authors.count,
    totalBans: bans.count,
    recentRubrics: recentRubrics.count,
    recentResponses: recentResponses.count,
  });
}
