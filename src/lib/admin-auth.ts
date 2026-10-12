import { createHmac, timingSafeEqual } from "crypto";
import { verifyPassword } from "./password";

const SECRET = process.env.ADMIN_SESSION_SECRET || process.env.DATABASE_URL || "fallback-dev-secret";
const TOKEN_TTL = 8 * 60 * 60 * 1000; // 8 hours

export function authenticateAdmin(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME;
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  if (!expectedUser || !expectedHash) return false;

  if (username !== expectedUser) return false;
  return verifyPassword(password, expectedHash);
}

export function createSessionToken(): string {
  const expires = Date.now() + TOKEN_TTL;
  const payload = `admin:${expires}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function verifySessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    const [role, expiresStr, sig] = parts;
    if (role !== "admin") return false;

    const expires = parseInt(expiresStr, 10);
    if (Date.now() > expires) return false;

    const expectedSig = createHmac("sha256", SECRET)
      .update(`${role}:${expiresStr}`)
      .digest("hex");

    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expectedSig, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function getAdminToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)admin_session=([^\s;]+)/);
  return match ? match[1] : null;
}
