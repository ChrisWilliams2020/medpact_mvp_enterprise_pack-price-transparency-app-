.PHONY: up down api web

up:
	docker compose up -d

down:
	docker compose down

api:
	@echo "Create a Python venv, activate it, then run:\n  source .venv/bin/activate && pip install -r apps/api/requirements.txt && uvicorn apps.api.app.main:app --reload --host 0.0.0.0 --port 8000"

web:
	@echo "From the repo root run:\n  cd apps/web && npm install && npm run start"
