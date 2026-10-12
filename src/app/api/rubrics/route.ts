import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  const author = searchParams.get("author");

  if (id) {
    const rows = await sql`SELECT * FROM rubrics WHERE id = ${id} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json(null);
    return NextResponse.json(rows[0]);
  }

  if (author) {
    const rows = await sql`
      SELECT * FROM rubrics
      WHERE LOWER(author_key) = LOWER(${author})
      ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  }

  return NextResponse.json({ error: "id or author param required" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, org, title, description, author_name, author_key, dimensions, scale, created_at } = body;

  await sql`
    INSERT INTO rubrics (id, org, title, description, author_name, author_key, dimensions, scale, created_at)
    VALUES (${id}, ${org || null}, ${title}, ${description || null}, ${author_name}, ${author_key}, ${JSON.stringify(dimensions)}, ${JSON.stringify(scale)}, ${created_at})
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}
