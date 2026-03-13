from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Body, Depends
from uuid import uuid4
import hashlib
import os
from pathlib import Path
import csv
from ..db import get_engine, get_claim_lines, create_import_job_record, get_import_job, update_import_job
from ..services.import_service import enqueue_import
from ..auth import get_practice_id
from fastapi import Request
from fastapi.responses import StreamingResponse
import json
import asyncio
from redis import Redis
from sqlalchemy import text
from time import time

router = APIRouter(prefix="/imports", tags=["imports"])

@router.get('/events')
async def import_events(request: Request):
    """Server-Sent Events endpoint that streams changes to import_jobs.
    Polls the DB every second for rows updated since the last seen timestamp.
    """
    # Use Redis pub/sub for live events if available
    try:
        # default to localhost for local dev/tests; CI/container uses REDIS_URL env to point to service name
        r = Redis.from_url(os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0'))
        pubsub = r.pubsub()
        pubsub.subscribe('import_jobs')

        async def redis_event_gen():
            # immediate heartbeat to help short-lived SSE clients
            yield ': connected\n\n'
            last_heartbeat = time() - 1
            try:
                while True:
                    if await request.is_disconnected():
                        break
                    try:
                        msg = pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                    except Exception as e:
                        # transient Redis error; log and retry so the SSE client isn't broken
                        try:
                            print('imports.import_events: pubsub.get_message error', e)
                        except Exception:
                            pass
                        await asyncio.sleep(0.2)
                        continue
                    if msg and msg.get('type') == 'message':
                        data = msg.get('data')
                        if isinstance(data, bytes):
                            data = data.decode('utf-8')
                        yield f"event: job\ndata: {data}\n\n"
                    # heartbeat for short client read timeouts
                    if time() - last_heartbeat > 1:
                        last_heartbeat = time()
                        yield ': heartbeat\n\n'
                    await asyncio.sleep(0.05)
            except Exception as gen_err:
                import traceback
                try:
                    print('imports.import_events: exception in SSE generator', traceback.format_exc())
                except Exception:
                    pass
                yield f"event: error\ndata: {json.dumps({'error': str(gen_err)})}\n\n"
            finally:
                try:
                    pubsub.close()
                except Exception:
                    pass

        return StreamingResponse(redis_event_gen(), media_type='text/event-stream')
    except Exception:
        # fallback to DB polling if Redis unavailable
        pass

    from ..db import get_engine
    from sqlalchemy import text
    engine = get_engine()

    async def event_generator():
        last_ts = None
        while True:
            if await request.is_disconnected():
                break
            with engine.connect() as conn:
                if last_ts is None:
                    rows = conn.execute(text('SELECT id, job_id, filename, status, progress, processed_rows, error, created_at, updated_at FROM import_jobs ORDER BY updated_at DESC LIMIT 20')).fetchall()
                else:
                    rows = conn.execute(text('SELECT id, job_id, filename, status, progress, processed_rows, error, created_at, updated_at FROM import_jobs WHERE updated_at > :ts ORDER BY updated_at ASC'), {'ts': last_ts}).fetchall()
                for r in rows:
                    d = dict(r._mapping)
                    last_ts = d.get('updated_at') or last_ts
                    payload = json.dumps(d, default=str)
                    yield f"event: job\ndata: {payload}\n\n"
            await asyncio.sleep(1)

    return StreamingResponse(event_generator(), media_type='text/event-stream')

UPLOAD_DIR = Path(os.getenv('UPLOAD_DIR', 'uploads'))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post('/claims')
async def import_claims(file: UploadFile = File(...), practice_id: str = Depends(get_practice_id)):
    job_id = str(uuid4())
    content = await file.read()
    # upload content to MinIO using job_id as object key
    from ..storage import upload_bytes
    bucket = os.getenv('MINIO_BUCKET', 'uploads')
    object_name = f"{job_id}-{file.filename}"
    upload_bytes(bucket, object_name, content)
    dest = f"minio://{bucket}/{object_name}"

    # compute checksum to support idempotency
    checksum = hashlib.sha256(content).hexdigest()
    # Use create_or_get_import_job to atomically create or return existing by checksum
    from ..db import create_or_get_import_job
    # attach practice_id to the DB row
    canonical_job_id = create_or_get_import_job(job_id, dest, checksum=checksum, practice_id=practice_id)
    # If we created a new job (canonical_job_id == job_id), enqueue it. Otherwise return existing job info.
    if canonical_job_id == job_id:
        enqueued_job_id = enqueue_import(dest, checksum=checksum, practice_id=practice_id)
        return {"job_id": enqueued_job_id, "filename": str(dest)}
    else:
        # existing job: return its id and filename
        from ..db import find_import_job_by_checksum
        existing = find_import_job_by_checksum(checksum)
        return {"job_id": existing['job_id'], "filename": existing['filename'], "status": existing.get('status')}


 # debug endpoint removed; use /qa/publish for QA testing



@router.get('')
@router.get('/')
def list_imports(limit: int = 50, offset: int = 0):
    from ..db import get_engine
    engine = get_engine()
    from sqlalchemy import text
    with engine.connect() as conn:
        rows = conn.execute(text('SELECT id, job_id, filename, status, progress, processed_rows, error, created_at FROM import_jobs ORDER BY id DESC LIMIT :lim OFFSET :off'), {'lim': limit, 'off': offset}).fetchall()
        return [dict(r._mapping) for r in rows]



@router.get('/{job_id}')
def import_status(job_id: str):
    job = get_import_job(job_id)
    if not job:
        return {"error": "not found"}
    return job


def process_import(path: Path) -> int:
    inserted = 0
    with path.open('r', encoding='utf-8') as fh:
        reader = csv.DictReader(fh)
        engine = get_engine()
        claim_lines_tbl = get_claim_lines()
        with engine.begin() as conn:
            for row in reader:
                conn.execute(claim_lines_tbl.insert().values(
                    claim_id=row.get('claim_id'),
                    practice_id=row.get('practice_id'),
                    date_of_service=row.get('date_of_service'),
                    cpt_code=row.get('cpt_code'),
                    payer_name=row.get('payer_name'),
                    allowed_amount=_as_float(row.get('allowed_amount')),
                    paid_amount=_as_float(row.get('paid_amount')),
                    status=row.get('status'),
                    raw_payload=str(row),
                ))
                inserted += 1
    return inserted


def _as_float(v):
    try:
        return float(v)
    except Exception:
        return None
