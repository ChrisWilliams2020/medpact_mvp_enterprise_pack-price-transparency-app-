# MedPact Practice Intelligence

## 🏥 Healthcare Practice Analytics & Benchmarking Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)]()

MedPact Practice Intelligence is a comprehensive analytics platform designed for healthcare practices to monitor financial performance, benchmark against peers, and receive AI-powered insights for operational improvement.

---

## ✨ Version 1.0.0 - Foundation Release (March 14, 2026)

This release establishes the production-ready baseline with 18 fully hardened React components.

### Key Features
- **AI-Powered Analytics** - Insights, suggestions, and expert narration
- **Financial Dashboards** - NCR, EBITDA, Days in A/R tracking
- **Peer Benchmarking** - Multi-practice comparison
- **Quality Metrics** - MIPS scorecard, patient satisfaction
- **Report Builder** - Custom drag-and-drop reports
- **Multi-Channel Delivery** - Email, SMS, Slack, Teams

See [CHANGELOG.md](CHANGELOG.md) for full release notes.

---

## 🚀 Quick Start (Development)

### Frontend Only (Recommended for UI development)
```bash
cd apps/web
npm install
npm run dev
# Open http://localhost:3000
```

### Full Stack (Original MVP Setup)

This repo contains a small prototype for importing claims CSVs, processing them in a background worker, and streaming job status updates to clients (SSE via Redis pub/sub).

Quick start (macOS):

1. Build and start all services:

```bash
docker compose up -d --build
```

2. Verify services:
- API: http://localhost:8000
- Frontend (NGINX): http://localhost:3001
- MinIO console: http://localhost:9001 (user: `minio`, pass: `minio123`)

3. Smoke test (open SSE viewer in a browser tab):
- Open http://localhost:8000/imports/events (keep tab open)
- Run the provided smoke script:

```bash
./scripts/smoke.sh
```

4. Debug publish (QA): with SSE viewer open, you can POST a test event to the API to confirm forwarding:

```bash
curl -sS -X POST http://localhost:8000/imports/debug-publish -H 'Content-Type: application/json' -d '{"job_id":"test-1","status":"queued"}'
```

Cleanup: to return to a clean dev image state, rebuild the `api` service:

```bash
docker compose up -d --build api
```

If you want, I can open a PR with these docs and small QA endpoint removed after testing.
MedPact Practice Intelligence — Minimal Demo

This workspace contains a minimal scaffold so you can run a small demo locally.

Quick start (macOS):

1. Copy env:

   cp .env.example .env

2. Start local infrastructure (Postgres, Redis, MinIO):

   docker compose up -d

3. Create Python venv and install API deps:

   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r apps/api/requirements.txt

4. Start the API (in activated venv):

   uvicorn apps.api.app.main:app --reload --host 0.0.0.0 --port 8000

5. Start the static web locally (separate terminal):

   cd apps/web
   npm install
   npm run start

- Web will be at http://localhost:3000 (it proxies to /api path locally, but this demo expects the API on the same host; open http://localhost:3000 and clicking will try /api/health)
- API docs will be at http://localhost:8000/docs

Notes:
- If your machine has no `python` on PATH use `python3` and `pip3`.
- If Docker Compose complains about a missing file, run these commands from the repo root where `docker-compose.yml` lives.

Test tokens (for local dev):

- `token-practice-a` → practice-a
- `token-practice-b` → practice-b

To test from the browser UI, run in the console:

```js
localStorage.setItem('mp_token', 'token-practice-a')
```

---

## 🧩 Component Architecture

### Fully Hardened Components (18 total)

All components include PropTypes, React.memo, error handling, and accessibility features.

| Category | Components |
|----------|-----------|
| **Analytics** | AIInsights, Charts, Forecasting, PeerBenchmarking, QualityMetrics |
| **AI Tools** | AIAssistant, AISuggestionsTodo, ExpertNarration |
| **Operations** | Alerts, ConsultantEngagement, DashboardDelivery, DataExport, ReportBuilder |
| **UI** | Button, Toast, FileUpload, DebugPublishButton, RoleBasedDashboard |

---

## 🔐 Version Control & Releases

```bash
# View current version
git describe --tags

# Create a new release (example)
git tag -a v1.1.0 -m "Feature release description"
git push origin v1.1.0
```

### Branching Strategy
- `main` - Production-ready code
- `ci/production-mvp` - Current production branch (v1.0.0)
- `feature/*` - Feature development
- `hotfix/*` - Production fixes

---

## 📦 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18.2, Vite 5.2, TailwindCSS 3.4 |
| **Backend** | Python, FastAPI, Uvicorn |
| **Database** | PostgreSQL, Alembic migrations |
| **Infrastructure** | Docker, Redis, MinIO |

---

## 📄 License

Proprietary - MedPact Healthcare Solutions

---

*Foundation Release v1.0.0 - March 14, 2026*
