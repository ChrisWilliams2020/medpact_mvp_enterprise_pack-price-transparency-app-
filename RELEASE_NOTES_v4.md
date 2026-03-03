MedPACT Site — Release v4.0.0

This release stabilizes the foundational MedPACT site.

Highlights:
- App-router Next.js site with Tailwind and TypeScript
- Admin UI and secure HMAC-signed admin login cookie
- File upload endpoint with local/public/media persistence and optional S3 presign support
- Mapping storage in `public/media/mapping.json` for media references
- Team page with per-member photo upload and preview
- E2E smoke scripts and CI workflow skeleton
- Visual updates: larger site identity, hero revisions and external CTAs

Next steps:
- Replace placeholder external URLs with production targets
- Migrate to a production session store or NextAuth
- Implement signed GETs for private S3 assets when using cloud storage
