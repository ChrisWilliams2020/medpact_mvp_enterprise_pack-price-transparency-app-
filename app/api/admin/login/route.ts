export const runtime = "edge";

async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig as ArrayBuffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json().catch(() => ({}));
    const ADMIN = process.env.ADMIN_PASS || "admin";
    if (password !== ADMIN) return new Response(JSON.stringify({ error: "invalid" }), { status: 401, headers: { "Content-Type": "application/json" } });

    const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASS || 'dev-secret';
    const ts = Date.now();
    const sig = await hmacHex(ADMIN_SECRET, String(ts));
    const cookieVal = `${ts}:${sig}`;

    // set signed cookie, HttpOnly, Secure in prod, SameSite=Lax
    const cookieParts = [`admin=${cookieVal}`, `Path=/`, `HttpOnly`, `SameSite=Lax`];
    if (process.env.NODE_ENV === 'production') cookieParts.push('Secure');

  const headers: Record<string,string> = { "Set-Cookie": cookieParts.join('; '), "Content-Type": "application/json" };
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
