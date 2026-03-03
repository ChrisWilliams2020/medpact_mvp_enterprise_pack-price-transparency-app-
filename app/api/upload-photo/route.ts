import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readMapping, writeMapping } from '@/lib/mapping';

export const runtime = "nodejs";

function sanitizeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function persistMapping(key: string, url: string, filename?: string) {
  try {
    const map = await readMapping();
    map[key] = { url, filename, uploadedAt: Date.now() } as any;
    await writeMapping(map);
  } catch (e) {
    // ignore
  }
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const mediaDir = path.join(process.cwd(), "public", "media");
    await fs.promises.mkdir(mediaDir, { recursive: true });

    let filename = `upload_${Date.now()}`;
    let buffer: Buffer | null = null;
    let key: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      const file = fd.get("file") as any;
      key = (fd.get('key') as string) || undefined;
      if (!file) return new Response(JSON.stringify({ error: "no file provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const name = file.name || filename;
      const arr = await file.arrayBuffer();
      buffer = Buffer.from(arr);
      const ext = name.split('.').pop() || '';
      filename = `${crypto.randomUUID()}.${sanitizeName(ext)}`;
    } else {
      const body = await req.json().catch(() => ({}));
      const { filename: f, data, key: k } = body || {};
      key = k || undefined;
      if (!data) return new Response(JSON.stringify({ error: "no image data provided" }), { status: 400, headers: { "Content-Type": "application/json" } });
      const match = f ? f.split('.') : [];
      const ext = match.length > 1 ? match.pop() : 'png';
      filename = `${crypto.randomUUID()}.${sanitizeName(ext || 'png')}`;
      buffer = Buffer.from(data, "base64");
    }

    const s3Bucket = process.env.S3_BUCKET;
    let url = '';

    if (s3Bucket) {
      const client = new S3Client({ region: process.env.S3_REGION });
      const keyName = filename;
      await client.send(new PutObjectCommand({ Bucket: s3Bucket, Key: keyName, Body: buffer }));
      url = `https://${s3Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${keyName}`;
    } else {
      const filePath = path.join(mediaDir, sanitizeName(filename));
      await fs.promises.writeFile(filePath, buffer!);
      url = `/media/${path.basename(filePath)}`;
    }

  if (key) await persistMapping(key, url, filename);

  return new Response(JSON.stringify({ url, filename }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
