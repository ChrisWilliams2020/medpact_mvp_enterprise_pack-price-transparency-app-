import os
from uuid import uuid4
from redis import Redis
from rq import Queue
from rq import Retry
import json
from ..db import create_import_job_record, update_import_job, get_engine, get_claim_lines

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
redis_conn = Redis.from_url(redis_url)
q = Queue('default', connection=redis_conn)


def enqueue_import(filepath: str, checksum: str = None, practice_id: str = None) -> str:
    # If checksum provided and an import with that checksum exists, return existing job_id
    # create a job_id and insert-or-get via DB helper
    job_id = str(uuid4())
    from ..db import create_or_get_import_job
    canonical_job_id = create_or_get_import_job(job_id, filepath, checksum=checksum, practice_id=practice_id)
    if canonical_job_id != job_id:
        return canonical_job_id

    # Enqueue by fully-qualified function path. Worker will handle minio:// URIs.
    # Pass practice_id as job meta via RQ args so the worker can pick it up if needed
    # Enqueue with small retry policy for transient failures
    q.enqueue('apps.api.worker.process_import_job', job_id, filepath, practice_id, retry=Retry(max=2))
    try:
        redis_conn.publish('import_jobs', json_message := (json.dumps({'job_id': job_id, 'status': 'queued'})))
    except Exception:
        pass
    return job_id
