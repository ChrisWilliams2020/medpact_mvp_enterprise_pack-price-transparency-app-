import { S3Client, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

/**
 * Media API - Lists and deletes files from R2/S3 or local storage
 * 
 * Supports both AWS S3 and Cloudflare R2 (S3-compatible)
 */

function getStorageConfig() {
  // Check for Cloudflare R2 first (preferred)
  if (process.env.R2_ACCOUNT_ID && process.env.R2_BUCKET) {
    return {
      provider: 'r2' as const,
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      bucket: process.env.R2_BUCKET,
      region: 'auto',
      publicUrl: process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET}.${process.env.R2_ACCOUNT_ID}.r2.dev`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    };
  }
  
  // Fall back to AWS S3
  if (process.env.S3_BUCKET) {
    const region = process.env.S3_REGION || 'us-east-1';
    return {
      provider: 's3' as const,
      endpoint: undefined,
      bucket: process.env.S3_BUCKET,
      region,
      publicUrl: `https://${process.env.S3_BUCKET}.s3.${region}.amazonaws.com`,
      credentials: undefined,
    };
  }
  
  return null;
}

function getS3Client(config: NonNullable<ReturnType<typeof getStorageConfig>>) {
  const clientConfig: any = { region: config.region };
  if (config.endpoint) clientConfig.endpoint = config.endpoint;
  if (config.credentials?.accessKeyId) clientConfig.credentials = config.credentials;
  return new S3Client(clientConfig);
}

export async function GET() {
  try {
    const config = getStorageConfig();
    
    // If cloud storage is configured, list from there
    if (config) {
      const client = getS3Client(config);
      const command = new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: 'uploads/',
      });
      
      const response = await client.send(command);
      const files = (response.Contents || []).map(obj => ({
        name: obj.Key?.replace('uploads/', '') || '',
        url: `${config.publicUrl}/${obj.Key}`,
        key: obj.Key,
        size: obj.Size,
        lastModified: obj.LastModified?.toISOString(),
        provider: config.provider,
      }));
      
      return new Response(
        JSON.stringify({ files, provider: config.provider }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Fall back to local file system
    const mediaDir = path.join(process.cwd(), "public", "media");
    await fs.promises.mkdir(mediaDir, { recursive: true });
    const dirFiles = await fs.promises.readdir(mediaDir, { withFileTypes: true });
    const list = dirFiles
      .filter(f => f.isFile())
      .map(f => ({ 
        name: f.name, 
        url: `/media/${f.name}`,
        provider: 'local',
      }));
    
    return new Response(
      JSON.stringify({ files: list, provider: 'local' }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error('Media list error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { name, key } = body || {};
    
    if (!name && !key) {
      return new Response(
        JSON.stringify({ error: "no name or key provided" }), 
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    const config = getStorageConfig();
    
    // If cloud storage is configured, delete from there
    if (config) {
      const client = getS3Client(config);
      const objectKey = key || `uploads/${name}`;
      
      const command = new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: objectKey,
      });
      
      await client.send(command);
      
      return new Response(
        JSON.stringify({ ok: true, deleted: objectKey, provider: config.provider }), 
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Fall back to local file system
    const mediaDir = path.join(process.cwd(), "public", "media");
    const filePath = path.join(mediaDir, path.basename(name));
    await fs.promises.unlink(filePath).catch(() => {});
    
    return new Response(
      JSON.stringify({ ok: true, provider: 'local' }), 
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error('Media delete error:', err);
    return new Response(
      JSON.stringify({ error: String(err) }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
