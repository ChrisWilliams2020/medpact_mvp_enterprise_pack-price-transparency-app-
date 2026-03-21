Repository secrets and how to run CI preflight

This file lists the repository secrets the CI workflows expect and a short guide to add them in GitHub Actions (Settings → Secrets → Actions).

Required repository secrets
- GHCR_TOKEN: Personal access token (or use GITHUB_TOKEN with write:packages) for pushing images to ghcr.io.
- AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_DEFAULT_REGION: needed if using S3 uploads for backups in the migrator.
- S3_BUCKET: name of the bucket to upload pre-migration backups to (optional but recommended).
- KUBE_CONFIG: Base64 or raw kubeconfig (used by the deploy workflow for Kubernetes deploys).
- SSH_HOST, SSH_USER, SSH_KEY, SSH_PORT: for SSH/docker-compose deploy path (SSH_KEY should be the private key).
- POSTGRES_CONNECTION_STRING or POSTGRES_PASSWORD (workflow-specific): ensure your deploy workflows can reach the DB.

Notes and guidance
- Add each secret at: https://github.com/<owner>/<repo>/settings/secrets/actions
- Keep keys scoped and rotated regularly. Prefer short-lived credentials for production (OIDC, Workload Identity, etc.).
- If you cannot provide `KUBE_CONFIG`, use the SSH deploy path and provide SSH keys.

Running the migrations preflight locally
1. Ensure Docker is running.
2. From the repository root, run:

```bash
./scripts/run_preflight_local.sh
```

The script will generate `migrations.sql` (using the .NET SDK container), start a temporary Postgres, execute the script inside a single transaction (so no changes persist), show psql output, and remove the temporary container.

If you want CI to run the full preflight and publish flows, add the secrets above and push your branch — the workflows will run automatically.
