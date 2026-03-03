import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const file = path.join(process.cwd(), "public", "media", "mapping.json");
    const txt = await fs.promises.readFile(file, 'utf8').catch(() => '{}');
    const json = JSON.parse(txt || '{}');
    return new Response(JSON.stringify(json), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
