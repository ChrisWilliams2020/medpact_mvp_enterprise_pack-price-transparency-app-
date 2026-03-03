import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const days = body?.days ?? 30;
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    const mediaDir = path.join(process.cwd(), 'public', 'media');
    const files = await fs.promises.readdir(mediaDir, { withFileTypes: true });
    const removed: string[] = [];
    for (const f of files) {
      if (!f.isFile()) continue;
      const fp = path.join(mediaDir, f.name);
      const stat = await fs.promises.stat(fp);
      if (stat.mtimeMs < cutoff) {
        await fs.promises.unlink(fp).catch(() => {});
        removed.push(f.name);
      }
    }
    // update mapping
    const mapFile = path.join(mediaDir, 'mapping.json');
    let map = {} as Record<string,string>;
    try { map = JSON.parse(await fs.promises.readFile(mapFile,'utf8')); } catch (e) {}
    for (const k of Object.keys(map)) {
      if (removed.includes(map[k])) delete map[k];
    }
    await fs.promises.writeFile(mapFile, JSON.stringify(map, null, 2));
    return new Response(JSON.stringify({ removed }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
