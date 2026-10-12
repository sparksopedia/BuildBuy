import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getAdminToken, verifySessionToken } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM admin_bans ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { ban_type, ban_value, reason } = await req.json();
  if (!ban_type || !ban_value) {
    return NextResponse.json({ error: "ban_type and ban_value required" }, { status: 400 });
  }
  if (ban_type !== "email" && ban_type !== "ip") {
    return NextResponse.json({ error: "ban_type must be 'email' or 'ip'" }, { status: 400 });
  }

  await sql`
    INSERT INTO admin_bans (ban_type, ban_value, reason)
    VALUES (${ban_type}, ${ban_value.trim().toLowerCase()}, ${reason || null})
    ON CONFLICT (ban_type, ban_value) DO NOTHING
  `;

  await sql`
    INSERT INTO admin_audit_log (action, target_type, target_id, details)
    VALUES ('create_ban', 'ban', ${ban_value}, ${JSON.stringify({ ban_type, reason })}::jsonb)
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const token = getAdminToken(req.headers.get("cookie"));
  if (!token || !verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await sql`DELETE FROM admin_bans WHERE id = ${id}::uuid`;
  await sql`
    INSERT INTO admin_audit_log (action, target_type, target_id)
    VALUES ('delete_ban', 'ban', ${id})
  `;

  return NextResponse.json({ ok: true });
}
