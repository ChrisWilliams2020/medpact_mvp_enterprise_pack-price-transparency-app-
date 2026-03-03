import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function hmacHex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const bytes = new Uint8Array(sig as ArrayBuffer);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

async function verifyCookie(cookieValue: string | undefined, secret: string) {
  if (!cookieValue) return false;
  const parts = cookieValue.split(':');
  if (parts.length !== 2) return false;
  const [tsStr, sig] = parts;
  const ts = Number(tsStr);
  if (!ts || Number.isNaN(ts)) return false;
  const expected = await hmacHex(secret, String(ts));
  if (!sig || !expected) return false;
  if (!timingSafeEqualHex(sig, expected)) return false;
  // expiry: 24 hours
  const age = Date.now() - ts;
  if (age > 24 * 60 * 60 * 1000) return false;
  return true;
}

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  // allow the login page and login API to be reached without an existing cookie
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const cookie = req.cookies.get('admin')?.value;
    const secret = process.env.ADMIN_SECRET || process.env.ADMIN_PASS || 'dev-secret';
    const ok = await verifyCookie(cookie, secret);
    if (!ok) {
      // If this is an API request, return 401 JSON. For page requests, redirect to login.
      if (pathname.startsWith('/api/')) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
      }
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*']
};
