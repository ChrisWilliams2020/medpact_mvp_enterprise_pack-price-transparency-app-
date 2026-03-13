from fastapi import FastAPI, Response
from .api.imports import router as imports_router
from .api.qa import router as qa_router
from .api.todos import router as todos_router
from .api.metrics import router as metrics_router
from .api.metrics_events import router as metrics_events_router
from fastapi import Request

# simple auth/practice stub dependency
async def get_practice_id(request: Request):
    # Allow X-Practice-Id header or query param; in production replace with real auth
    practice = request.headers.get('X-Practice-Id') or request.query_params.get('practice_id')
    return practice or 'practice'
from .db import init_db
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
from . import db as _db
import json
from sqlalchemy import text

app = FastAPI(title="MedPact Demo API")


@app.on_event('startup')
def startup():
    # ensure database tables exist
    try:
        init_db()
    except Exception as e:
        # Log the error so startup failures are visible in the server logs
        import logging
        logging.exception('init_db failed: %s', e)


@app.get("/")
async def root():
    return {"status": "ok", "message": "MedPact demo API"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get('/ready')
def ready():
    """Readiness probe: quick DB connectivity check."""
    try:
        engine = _db.get_engine()
        with engine.connect() as conn:
            # SQLAlchemy 2.0 requires an executable for text SQL
            conn.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception as e:
        # Return a 500 status code so orchestrators treat this as not ready
        payload = json.dumps({"status": "error", "detail": str(e)})
        return Response(status_code=500, content=payload, media_type="application/json")


@app.get('/metrics')
def metrics():
    # expose default Prometheus metrics
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)


app.include_router(imports_router)
app.include_router(qa_router)
app.include_router(todos_router)
app.include_router(metrics_router)
app.include_router(metrics_events_router)

# Optional OIDC routes (authlib may not be installed in all environments)
try:
    from .oidc import router as oidc_router
    app.include_router(oidc_router)
except Exception:
    # If authlib / OIDC not available, skip mounting the auth routes
    pass
