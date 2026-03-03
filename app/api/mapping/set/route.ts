import { readMapping, writeMapping } from '@/lib/mapping';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { key, url, filename } = await req.json().catch(() => ({}));
    if (!key || !url) return new Response(JSON.stringify({ error: 'key and url required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const map = await readMapping();
    map[key] = { url, filename, uploadedAt: Date.now() } as any;
    await writeMapping(map);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
