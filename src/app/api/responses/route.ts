import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const rubricId = req.nextUrl.searchParams.get("rubric_id");
  if (!rubricId) {
    return NextResponse.json({ error: "rubric_id param required" }, { status: 400 });
  }

  const rows = await sql`
    SELECT * FROM responses
    WHERE rubric_id = ${rubricId}
    ORDER BY submitted_at ASC
  `;

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rubric_id, evaluator_name, role, scores, comment, submitted_at } = body;

  await sql`
    INSERT INTO responses (rubric_id, evaluator_name, role, scores, comment, submitted_at)
    VALUES (${rubric_id}, ${evaluator_name}, ${role || null}, ${JSON.stringify(scores)}, ${comment || null}, ${submitted_at})
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}
