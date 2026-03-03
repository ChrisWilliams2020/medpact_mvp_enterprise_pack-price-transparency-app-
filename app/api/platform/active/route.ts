import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const file = path.join(process.cwd(), "public", "media", "platform.json");
    const txt = await fs.promises.readFile(file, "utf8").catch(() => "{}");
    const json = JSON.parse(txt || "{}");
    return new Response(JSON.stringify(json), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body || {};
    if (!url) return new Response(JSON.stringify({ error: "no url provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
    const file = path.join(process.cwd(), "public", "media", "platform.json");
    await fs.promises.writeFile(file, JSON.stringify({ url, updated: Date.now() }));
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
