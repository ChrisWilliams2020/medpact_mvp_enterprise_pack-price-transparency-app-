import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mediaDir = path.join(process.cwd(), "public", "media");
    await fs.promises.mkdir(mediaDir, { recursive: true });
    const files = await fs.promises.readdir(mediaDir, { withFileTypes: true });
    const videos = [] as { name: string; url: string; mtime: number }[];
    for (const f of files) {
      if (f.isFile() && /\.(mp4|webm|ogg)$/i.test(f.name)) {
        const stat = await fs.promises.stat(path.join(mediaDir, f.name));
        videos.push({ name: f.name, url: `/media/${f.name}`, mtime: stat.mtimeMs });
      }
    }
    videos.sort((a, b) => b.mtime - a.mtime);
    return new Response(JSON.stringify({ videos }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
