import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

/**
 * Presigned URL generator for S3/R2 uploads
 * 
 * Supports both AWS S3 and Cloudflare R2 (S3-compatible)
 * 
 * Environment variables:
 * - R2_ACCOUNT_ID: Cloudflare account ID (for R2)
 * - R2_ACCESS_KEY_ID: R2 access key
 * - R2_SECRET_ACCESS_KEY: R2 secret key
 * - R2_BUCKET: R2 bucket name
 * - R2_PUBLIC_URL: Public URL for the bucket (e.g., https://media.medpact.com or R2.dev URL)
 * 
 * OR for AWS S3:
 * - S3_REGION: AWS region
 * - S3_BUCKET: S3 bucket name
 * - AWS_ACCESS_KEY_ID: AWS access key (auto-detected)
 * - AWS_SECRET_ACCESS_KEY: AWS secret key (auto-detected)
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
      credentials: undefined, // AWS SDK auto-detects from env
    };
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const { filename } = await req.json().catch(() => ({}));
    if (!filename) {
      return new Response(
        JSON.stringify({ error: 'filename required' }), 
        { status: 400, headers: { 'Content-Type': 'application/json' }}
      );
    }
    
    const config = getStorageConfig();
    if (!config) {
      return new Response(
        JSON.stringify({ error: 'Cloud storage not configured. Set R2 or S3 environment variables.' }), 
        { status: 500, headers: { 'Content-Type': 'application/json' }}
      );
    }

    // Sanitize filename
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `uploads/${Date.now()}-${safeFilename}`;
    
    const clientConfig: any = {
      region: config.region,
    };
    
    if (config.endpoint) {
      clientConfig.endpoint = config.endpoint;
    }
    
    if (config.credentials?.accessKeyId) {
      clientConfig.credentials = config.credentials;
    }

    const client = new S3Client(clientConfig);
    const cmd = new PutObjectCommand({ 
      Bucket: config.bucket, 
      Key: key,
    });
    
    try {
      const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
      const url = await getSignedUrl(client, cmd, { expiresIn: 3600 });
      const publicUrl = `${config.publicUrl}/${key}`;
      
      return new Response(
        JSON.stringify({ 
          url, 
          key, 
          publicUrl,
          provider: config.provider,
        }), 
        { status: 200, headers: { 'Content-Type': 'application/json' }}
      );
    } catch (e: any) {
      console.error('Presign error:', e);
      return new Response(
        JSON.stringify({ error: 'Failed to generate presigned URL', details: e.message }), 
        { status: 500, headers: { 'Content-Type': 'application/json' }}
      );
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: String(e) }), 
      { status: 500, headers: { 'Content-Type': 'application/json' }}
    );
  }
}
