import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { filename } = await req.json().catch(() => ({}));
    if (!filename) return new Response(JSON.stringify({ error: 'filename required' }), { status: 400, headers: { 'Content-Type': 'application/json' }});
    const s3Bucket = process.env.S3_BUCKET;
    if (!s3Bucket) return new Response(JSON.stringify({ error: 'S3 not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' }});
    const client = new S3Client({ region: process.env.S3_REGION });
    const key = filename;
    const cmd = new PutObjectCommand({ Bucket: s3Bucket, Key: key });
    try {
      const mod = await import('@aws-sdk/s3-request-presigner');
      const url = await mod.getSignedUrl(client, cmd, { expiresIn: 3600 });
      const publicUrl = `https://${s3Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
      return new Response(JSON.stringify({ url, key, publicUrl }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    } catch (e) {
      // fallback: return public S3 URL (not presigned)
      const publicUrl = `https://${s3Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
      return new Response(JSON.stringify({ url: publicUrl, key, publicUrl, warning: 'presign unavailable, returned public URL' }), { status: 200, headers: { 'Content-Type': 'application/json' }});
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { 'Content-Type': 'application/json' }});
  }
}
