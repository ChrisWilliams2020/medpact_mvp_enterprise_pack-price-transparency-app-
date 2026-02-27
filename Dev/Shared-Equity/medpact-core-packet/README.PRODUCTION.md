Production deploy notes
======================

Required secrets / environment variables
- GHCR_TOKEN: Personal access token or GitHub App token with packages:write to push images
- KUBE_CONFIG (optional): base64-encoded kubeconfig to apply k8s manifests
- SSH_HOST / SSH_USER / SSH_KEY (optional): for SSH-based docker-compose deploy
- POSTGRES_USER / POSTGRES_PASSWORD / POSTGRES_DB / CONNECTION_STRING: database credentials

Quick deploy (docker-compose on remote host via SSH)

1. Create a release branch and push images to GHCR (CI will push when configured).
2. Trigger `Deploy` workflow or run on remote host via SSH to pull and run `deploy/docker-compose.prod.yml`.

Kubernetes

Edit `deploy/k8s/medpact-deployment.yaml` to set correct image path (ghcr.io/<owner>/medpact-api:latest) and create a `medpact-secrets` k8s secret with the app env vars.
 
S3 backups and lifecycle

If you enable S3 backups via the migrator (set `S3_BUCKET` and AWS credentials), consider applying the sample lifecycle policy in `deploy/s3-lifecycle.json` to automatically expire older backups. You can apply it using the AWS CLI:

```bash
aws s3api put-bucket-lifecycle-configuration --bucket <your-bucket> --lifecycle-configuration file://deploy/s3-lifecycle.json
```

Rollback guidance

Automatic rollback for application images is supported in the deploy workflow when k8s is used: if migration or health checks fail, the workflow attempts to re-deploy the previous image tag. Database rollbacks are not automated — they require manual intervention and careful planning. Always retain backups before running migrations.
