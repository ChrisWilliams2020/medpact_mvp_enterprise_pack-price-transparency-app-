Demo runbook — smoke test

Quick steps for a practice tester or developer to run a local demo:

1) Start services

```bash
docker compose up -d --build
```

2) Run the automated smoke demo script (this will init DB, ensure MinIO bucket, upload a sample CSV, process it, and show DB checks)

```bash
./scripts/run_smoke_demo.sh
```

3) What to expect
- The script prints the API response with job_id and filename.
- The job should be processed quickly and the database will show status 'done' and processed_rows = 2.
- If something fails, capture the job_id and check container logs:

```bash
docker compose logs api worker minio
docker compose exec -T postgres psql -U medpact -d medpact -c "SELECT * FROM import_jobs WHERE job_id='<job_id>'"
```

Notes
- This is a minimal demo for local testing only. Do not use in production with real PHI without adding encryption, access controls, and backups.
