import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const authorKey = req.nextUrl.searchParams.get("author_key");
  if (!authorKey) {
    return NextResponse.json({ error: "author_key param required" }, { status: 400 });
  }

  const rows = await sql`
    SELECT * FROM custom_dimensions
    WHERE author_key = ${authorKey}
    ORDER BY saved_at ASC
  `;

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, author_key, name, desc, saved_at } = body;

  await sql`
    INSERT INTO custom_dimensions (id, author_key, name, "desc", saved_at)
    VALUES (${id}, ${author_key}, ${name}, ${desc || null}, ${saved_at})
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      "desc" = EXCLUDED."desc",
      saved_at = EXCLUDED.saved_at
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id param required" }, { status: 400 });
  }

  await sql`DELETE FROM custom_dimensions WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
