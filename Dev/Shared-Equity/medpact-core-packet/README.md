# MedPact Core (Foundation App)
A foundation application for MedPact’s data-intelligent platform:
- Multi-tenant organization model
- RBAC (roles/permissions-ready)
- Audit logging
- Ingestion job scaffolding (file-based for MVP)
- Metric Registry scaffolding
- API-first architecture

## Tech
- .NET 8 (ASP.NET Core Web API)
- EF Core (PostgreSQL recommended)
- Docker Compose for local infrastructure

## Getting started (local)
### 1) Requirements
- .NET SDK 8.x
- Docker Desktop (optional but recommended)

Note: If port 5000 or 5001 is already in use on your machine (macOS services like AirPlay may occupy ports), you can override the API port by setting `API_PORT` in your `.env` file before running `docker compose up`.


### 2) Configure environment
Copy `.env.example` to `.env` and adjust values if needed.

### Secrets and CI
- In CI (GitHub Actions) set the following repository secrets:
	- `CONNECTION_STRING` — full Postgres connection string used by the migrator and API (e.g. Host=postgres;Port=5432;Database=medpact;Username=medpact;Password=...)
	- `JWT_KEY` — secret signing key for the dev JWT (set to a secure random value in non-dev)
- The CI workflows included (`.github/workflows/ci-migrations.yml`, `.github/workflows/ci-e2e.yml`) expect these secrets and will write a `.env` before running docker-compose.

### 3) Start infrastructure (Postgres)
```bash
docker compose up -d
```

### 4) Run API
```bash
cd apps/api/MedPact.Api
dotnet restore
dotnet run
```

### 5) Apply migrations
This repo ships with entity models and DbContext. Create migrations on your machine:
```bash
cd apps/api/MedPact.Api
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate -p ../MedPact.Infrastructure -s .
dotnet ef database update -p ../MedPact.Infrastructure -s .
```

## Authentication (dev scaffold)
This repo includes a simple dev JWT login endpoint:
- `POST /api/auth/login` with `{ "email": "...", "tenantId": "..." }`
- Returns a JWT signed with `JWT__Key` from `.env` / user-secrets.

**Important:** This is for scaffolding only. Swap to Azure AD B2C / Auth0 / OpenIddict for production.

## Postman
Import `docs/MedPactCore.postman_collection.json` and set:
- `baseUrl`
- `tenantId`
- `token`

## License
Proprietary (MedPact).

## CI contract checks and frontend

This repository runs a lightweight contract check during CI. After services are started (the API on port 5100 in CI), the workflow will:

- Build the frontend image (if `apps/web` exists).
- Fetch the OpenAPI/Swagger JSON from `/swagger/v1/swagger.json` and assert the presence of a few key paths (`/api/health`, `/api/tenants`, `/api/auth/login`, `/api/metrics/definitions`).

The checks are intentionally small and are a guard against accidental public API changes; consider replacing them with Pact or a full contract test suite for stronger guarantees.
