import time
from redis import Redis
from rq import Queue, Worker
from fastapi.testclient import TestClient

from apps.api.app.main import app


def test_metrics_worker_smoke():
    client = TestClient(app)
    headers = {"X-Practice-Id": "test_practice"}

    # schedule a metric job via the API (this will enqueue into Redis)
    resp = client.post("/metrics/schedule/collection_rate", headers=headers, json={})
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("scheduled") is True
    job_id = data.get("job_id")
    assert job_id

    # process queued jobs with a burst RQ worker (connects to redis service)
    r = Redis.from_url(os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0'))
    q = Queue("default", connection=r)
    Worker([q], connection=r).work(burst=True)

    # small delay for DB commit visibility
    time.sleep(0.5)

    # fetch metric entries and assert created for practice
    resp = client.get("/metrics/entries")
    assert resp.status_code == 200
    entries = resp.json()
    assert any(e.get("metric_key") == "collection_rate" and e.get("practice_id") == "test_practice" for e in entries)
import os
import time
import json
import requests
from redis import Redis
from rq import Queue, Worker

from sqlalchemy import text

# Simple smoke test that enqueues a metric job via the running API,
# runs an in-process burst worker that consumes the RQ queue, and
# asserts a row in practice_metric_entries was created.

API_URL = os.getenv('API_URL', 'http://localhost:8000')
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+pg8000://medpact:medpact@localhost:5433/medpact')

def run_burst_worker():
    r = Redis.from_url(REDIS_URL)
    q = Queue('default', connection=r)
    Worker([q], connection=r).work(burst=True)


def query_metric_count(practice_id: str, metric_key: str):
    # use pg8000 connection via SQLAlchemy text query; avoid importing app DB helpers
    from sqlalchemy import create_engine
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        res = conn.execute(text("SELECT count(1) FROM practice_metric_entries WHERE practice_id = :pid AND metric_key = :mk"), {'pid': practice_id, 'mk': metric_key})
        row = res.first()
        return row[0] if row is not None else 0


def test_schedule_and_process_collection_rate():
    practice_id = 'ci_test_practice'
    metric = 'collection_rate'

    # 1) schedule a metric job via API
    resp = requests.post(f"{API_URL}/metrics/schedule/{metric}", headers={'X-Practice-Id': practice_id, 'Content-Type': 'application/json'}, json={})
    assert resp.status_code == 200, f"schedule failed: {resp.status_code} {resp.text}"
    payload = resp.json()
    assert payload.get('scheduled') is True

    # 2) run a burst worker locally (consumes queued RQ job)
    run_burst_worker()

    # 3) poll DB for an inserted metric entry
    deadline = time.time() + 5
    count = 0
    while time.time() < deadline:
        count = query_metric_count(practice_id, metric)
        if count > 0:
            break
        time.sleep(0.5)

    assert count > 0, 'expected at least one practice_metric_entries row after worker processed job'
