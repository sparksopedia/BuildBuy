import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export async function POST(req: NextRequest) {
  const { rubric_id, password } = await req.json();

  if (!rubric_id || !password) {
    return NextResponse.json({ error: "rubric_id and password required" }, { status: 400 });
  }

  const rows = await sql`SELECT password_hash FROM rubrics WHERE id = ${rubric_id} LIMIT 1`;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Rubric not found" }, { status: 404 });
  }

  const { password_hash } = rows[0];
  if (!password_hash) {
    return NextResponse.json({ valid: true });
  }

  const valid = verifyPassword(password, password_hash as string);
  return NextResponse.json({ valid });
}
