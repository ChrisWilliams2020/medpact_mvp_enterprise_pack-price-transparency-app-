import fs from 'fs';
import path from 'path';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

type MapEntry = { url: string; filename?: string; uploadedAt: number };

const s3Bucket = process.env.S3_BUCKET;
const s3Region = process.env.S3_REGION;

async function streamToString(stream: any): Promise<string> {
  if (!stream) return '';
  if (typeof stream.transformToString === 'function') {
    return await stream.transformToString('utf-8');
  }
  return await new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export async function readMapping(): Promise<Record<string, MapEntry>> {
  if (s3Bucket) {
    try {
      const client = new S3Client({ region: s3Region });
      const res = await client.send(new GetObjectCommand({ Bucket: s3Bucket, Key: 'mapping.json' }));
      const body = await streamToString(res.Body);
      return JSON.parse(body || '{}');
    } catch (e) {
      return {};
    }
  }

  const mapFile = path.join(process.cwd(), 'public', 'media', 'mapping.json');
  try {
    const txt = await fs.promises.readFile(mapFile, 'utf8');
    return JSON.parse(txt || '{}');
  } catch (e) {
    return {};
  }
}

export async function writeMapping(map: Record<string, MapEntry>) {
  if (s3Bucket) {
    const client = new S3Client({ region: s3Region });
    await client.send(new PutObjectCommand({ Bucket: s3Bucket, Key: 'mapping.json', Body: JSON.stringify(map, null, 2), ContentType: 'application/json' }));
    return;
  }

  const mediaDir = path.join(process.cwd(), 'public', 'media');
  await fs.promises.mkdir(mediaDir, { recursive: true });
  const mapFile = path.join(mediaDir, 'mapping.json');
  await fs.promises.writeFile(mapFile, JSON.stringify(map, null, 2));
}
