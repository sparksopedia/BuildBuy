import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  const author = searchParams.get("author");

  if (id) {
    const rows = await sql`SELECT * FROM rubrics WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json(null);
    const row = rows[0];
    return NextResponse.json({
      ...row,
      has_password: !!row.password_hash,
      password_hash: undefined,
    });
  }

  if (author) {
    const rows = await sql`
      SELECT * FROM rubrics
      WHERE LOWER(author_key) = LOWER(${author})
      ORDER BY created_at DESC
    `;
    return NextResponse.json(
      rows.map((row) => ({
        ...row,
        has_password: !!row.password_hash,
        password_hash: undefined,
      }))
    );
  }

  return NextResponse.json({ error: "id or author param required" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, org, title, description, author_name, author_key, dimensions, scale, created_at, password } = body;

  const password_hash = password ? hashPassword(password) : null;

  await sql`
    INSERT INTO rubrics (id, org, title, description, author_name, author_key, dimensions, scale, created_at, password_hash)
    VALUES (${id}, ${org || null}, ${title}, ${description || null}, ${author_name}, ${author_key}, ${JSON.stringify(dimensions)}, ${JSON.stringify(scale)}, ${created_at}, ${password_hash})
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}
