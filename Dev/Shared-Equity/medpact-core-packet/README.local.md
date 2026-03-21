Local dev & test quickstart

This file documents the minimal steps to get the repo running locally (dev) and to run the provider tests.

Prereqs
- Docker Desktop running
- .NET 8 SDK available locally (the project targets net8.0)
- Node.js 18+ and npm

Start local stack (Postgres + API + Web)

1. Copy the example .env or create one with these values (file: `.env` at repo root):

```bash
POSTGRES_DB=medpactdb
POSTGRES_USER=medpact
POSTGRES_PASSWORD=medpactpass
POSTGRES_PORT=5433
CONNECTION_STRING=Host=postgres;Port=5432;Database=medpactdb;Username=medpact;Password=medpactpass
API_PORT=5100
PROVIDER_STATES_ENABLED=true
```

2. Start the stack:

```bash
docker-compose up --build
```

3. Apply migrations (the compose stack includes a `migrator` service; you can also run it manually):

```bash
# run migrator once (optional; compose 'migrator' will also run)
docker-compose run --rm migrator
```

4. Verify services:

- API: http://localhost:5100/swagger
- Web: http://localhost:5173

Run provider tests locally (requires dotnet 8)

```bash
export DOTNET_ROOT="$HOME/.dotnet"
export PATH="$HOME/.dotnet:$PATH"
cd apps/api
$HOME/.dotnet/dotnet test ./MedPact.ProviderTests/MedPact.ProviderTests.csproj -c Debug --logger "trx;LogFileName=provider-tests.trx"
```

Notes
- CI workflow runs migrations against a Postgres service provided by GitHub Actions.
- If you encounter issues with Docker Desktop networking, confirm containers are up (`docker ps`) and that the `postgres` service is reachable from `api` container.
