# Vercel deployment guide — MedPACT site (v4.0.0)

This document describes the exact environment variables and steps to deploy the repo to Vercel, and notes required S3/permissions configuration so uploads and mapping persistence work in production.

## Summary
- Connect this GitHub repository to Vercel (Import Project).
- Configure environment variables in the Vercel Project settings (Preview & Production as required).
- Ensure S3 bucket and IAM permissions exist if you want persistent uploads and `mapping.json` stored in S3.

## Required environment variables
Set these in Vercel Project → Settings → Environment Variables.

- ADMIN_PASS (preview) — short dev password for admin UI (used in some scripts).
- ADMIN_SECRET (preview & production) — strong secret used to HMAC-sign admin cookie (keep private).
- NEXT_PUBLIC_BASE_URL (optional) — e.g. `https://your-project.vercel.app` to help clients construct absolute URLs.

If you will use S3 for storage (recommended for production on Vercel):
- S3_BUCKET — e.g. `medpact-prod-media` (the bucket name where media and `mapping.json` will be stored)
- S3_REGION — e.g. `us-east-1`
- AWS_ACCESS_KEY_ID — IAM user access key id
- AWS_SECRET_ACCESS_KEY — IAM user secret

Optional but recommended:
- ENABLE_SENTRY (or related keys) — if you add observability; set only if configured.

Notes about scope:
- Keep `ADMIN_SECRET`, `AWS_SECRET_ACCESS_KEY` private and add only to Vercel as Environment Variables. Do not commit them.

## Minimal IAM policy for the upload/mapping behavior
Attach this (or similar least-privilege) policy to the IAM user used by `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    }
  ]
}
```

## S3 CORS and public access
- If the site serves media directly from S3, ensure objects are publicly readable or served via a CDN. A simple CORS policy:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
    <MaxAgeSeconds>3000</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

For production, prefer CloudFront or another CDN with restricted bucket access.

## Deploy steps (recommended)
1. In Vercel, click "Import Project" → select the GitHub repo.
2. Use the detected Next.js preset. Leave build options at default (Build command: `npm run build`).
3. In Project Settings → Environment Variables, add the variables listed above.
   - Add `S3_BUCKET`, `S3_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` for Preview and Production (or only for Production, depending on your workflow).
   - Add `ADMIN_SECRET` for Production and Preview (use a different value for each environment if desired).
4. Deploy. Vercel will run `npm run build` and create a preview deployment.

## Local testing (before deploy)
1. Install deps: `npm install`.
2. Create `.env.local` from `.env.example` or set the environment variables in your shell.
3. To test the S3 flow locally, export the S3/AWS env vars in your terminal before running the dev server:

```bash
export S3_BUCKET=your-bucket
export S3_REGION=us-east-1
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
npm run dev
```

4. Use the admin UI or `scripts/e2e_test.js` to run a quick upload and confirm the uploaded file appears in S3 and `mapping.json` is written to the bucket.

## Post-deploy checks
- POST to `/api/upload-photo` to verify uploads return an S3 URL (or `/media/...` if local storage used).
- GET `/api/mapping` (or the Team page) and confirm images are loading from the returned URLs.
- Check Vercel function logs for any errors (Vercel Dashboard → Functions → Logs).

## Troubleshooting
- If uploads succeed but images 404: check the object ACL and whether the URL matches the object key and region.
- If mapping.json is not updating: ensure the IAM user has `s3:GetObject` and `s3:PutObject` permissions for `mapping.json`.
- If you want secure private media: store objects privately in S3 and generate signed GET URLs (we can add an endpoint to presign GETs).

## Next steps I can do for you
- Add CloudFront/Cloudflare configuration to serve S3 assets behind CDN.
- Make mapping stored as per-object metadata in S3 or in a small DB (Supabase/Vercel KV) instead of a single JSON file.
- Add a GitHub Action or Vercel hook to run smoke tests after deploy.

If you want, I can now push the S3 mapping changes and create a PR for review, or run a local S3 e2e test (you'll need to supply AWS credentials). Which would you like?
