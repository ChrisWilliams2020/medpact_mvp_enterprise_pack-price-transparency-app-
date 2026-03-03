import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mediaDir = path.join(process.cwd(), "public", "media");
    await fs.promises.mkdir(mediaDir, { recursive: true });
    const files = await fs.promises.readdir(mediaDir, { withFileTypes: true });
    const list = files.filter(f => f.isFile()).map(f => ({ name: f.name, url: `/media/${f.name}` }));
    return new Response(JSON.stringify({ files: list }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name } = body || {};
    if (!name) return new Response(JSON.stringify({ error: "no name provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
    const mediaDir = path.join(process.cwd(), "public", "media");
    const filePath = path.join(mediaDir, path.basename(name));
    await fs.promises.unlink(filePath).catch(() => {});
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
