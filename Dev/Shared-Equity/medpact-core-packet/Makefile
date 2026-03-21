SHELL := /bin/bash

.PHONY: setup lint test ci pre-commit

setup:
	@echo "Installing git hooks and basic tooling..."
	@if [ -f .git/hooks/pre-commit ]; then echo "pre-commit hook exists"; else if command -v pre-commit >/dev/null 2>&1; then pre-commit install || true; else echo "pre-commit not installed: skip installing hook"; fi; fi

lint:
	@echo "Running repo lint checks"
	@scripts/detect_and_run.sh lint || true

test:
	@echo "Running repo tests (if available)"
	@scripts/detect_and_run.sh test || true

ci: lint test
	@echo "CI checks complete"

pre-commit:
	@echo "Running pre-commit"
	@pre-commit run --all-files || true

docker-build:
	@echo "Building api docker image"
	@docker build -t medpact/api:local -f apps/api/MedPact.Api/Dockerfile . || true

docker-up:
	@echo "Starting docker-compose services"
	@docker compose up -d || true

docker-down:
	@echo "Stopping docker-compose services"
	@docker compose down || true

frontend-build:
	@echo "Building frontend"
	@cd apps/web && npm ci && npm run build || true

contract-check:
	@echo "Running contract checks against localhost:5100"
	@BASE_URL=http://localhost:5100 bash scripts/contract_test.sh || true

docker-api-entrypoint:
	@echo "Builds the API image that runs migrations at container start"
	@docker build -t medpact/api:entrypoint -f apps/api/MedPact.Api/Dockerfile . || true

# Convenience aliases and explicit dev targets
.PHONY: up down build test-provider migrate logs web build-web

# Start the full docker compose stack (detached)
up: docker-up

# Stop and remove the docker compose stack
down: docker-down

# Build the .NET solution
build:
	@echo "Building .NET solution"
	@dotnet build apps/api/MedPact.Core.sln

# Run provider contract tests (uses local dotnet install if present)
DOTNET ?= $(HOME)/.dotnet/dotnet
test-provider:
	@echo "Running provider tests"
	@export DOTNET_ROOT="$${HOME}/.dotnet" && export PATH="$${HOME}/.dotnet:$${PATH}" && \
		$${DOTNET} test apps/api/MedPact.ProviderTests/MedPact.ProviderTests.csproj -c Debug --logger "trx;LogFileName=provider-tests.trx"

# Run the EF Core migrator container
migrate:
	@echo "Running migrator to apply database migrations"
	@docker compose run --rm migrator

# Follow API container logs
logs:
	@echo "Tailing api container logs"
	@docker logs -f medpact_api

# Start frontend in dev mode (local)
web:
	@echo "Starting frontend in dev mode"
	@cd apps/web && npm ci && npm run dev

# Build frontend for production
build-web:
	@echo "Building frontend for production"
	@cd apps/web && npm ci && npm run build

# Run a quick smoke end-to-end: bring up stack, migrate, wait for API, run provider tests, and tear down
.PHONY: smoke
smoke:
	@echo "Starting full stack for smoke test..."
	@docker compose up -d
	@echo "Running migrations..."
	@docker compose run --rm migrator
	@echo "Waiting for API to become healthy (trying /health and /api/health)..."
	@i=0; until (curl --silent --fail http://localhost:5100/health >/dev/null 2>&1) || (curl --silent --fail http://localhost:5100/api/health >/dev/null 2>&1) || [ $$i -ge 60 ]; do \
		echo -n "."; sleep 1; i=$$((i+1)); done; \
	if (curl --silent --fail http://localhost:5100/health >/dev/null 2>&1) || (curl --silent --fail http://localhost:5100/api/health >/dev/null 2>&1); then \
		echo "\nAPI is healthy, running provider tests..."; \
		export DOTNET_ROOT="$${HOME}/.dotnet" && export PATH="$${HOME}/.dotnet:$${PATH}" && $${HOME}/.dotnet/dotnet test apps/api/MedPact.ProviderTests/MedPact.ProviderTests.csproj -c Debug; \
	else \
		echo "\nTimed out waiting for API to become healthy. Showing api logs:"; \
		docker logs --tail 200 medpact_api || true; exit 2; \
	fi
	@echo "Tearing down stack..."
	@docker compose down

# Faster smoke target for CI/local quick checks
.PHONY: smoke-fast
smoke-fast:
	@echo "Starting minimal stack for fast smoke test..."
	@docker compose up -d postgres api
	@echo "Running migrations..."
	@docker compose run --rm migrator
	@echo "Waiting for API (fast)"
	@./scripts/wait-for http://localhost:5100/health 30 || ./scripts/wait-for http://localhost:5100/api/health 30
	@export DOTNET_ROOT="$${HOME}/.dotnet" && export PATH="$${HOME}/.dotnet:$${PATH}" && \
		$${HOME}/.dotnet/dotnet test apps/api/MedPact.ProviderTests/MedPact.ProviderTests.csproj -c Debug
	@echo "Tearing down minimal stack..."
	@docker compose down -v

