import os
from redis import Redis
from rq import Queue, Worker
import csv
import json
from apps.api.app.db import get_engine, get_claim_lines, update_import_job
from prometheus_client import Counter

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
redis_conn = Redis.from_url(redis_url)
q = Queue('default', connection=redis_conn)

# Prometheus counters
JOB_PROCESSED = Counter('mp_jobs_processed_total', 'Total import jobs processed')
JOB_FAILED = Counter('mp_jobs_failed_total', 'Total import jobs failed')


def process_import_job(job_id: str, filepath: str, practice_id: str = None):
    # Update status to running
    update_import_job(job_id, status='running', progress=0)
    try:
        # publish queued->running event
        try:
            redis_conn.publish('import_jobs', json.dumps({'job_id': job_id, 'status': 'running'}))
        except Exception:
            pass

        inserted = 0

        # Check checksum and skip if already processed
        from apps.api.app.db import find_import_job_by_checksum
        # attempt to retrieve this job's checksum
        this_job = None
        try:
            from apps.api.app.db import get_import_job
            this_job = get_import_job(job_id)
        except Exception:
            this_job = None

        if this_job and this_job.get('checksum'):
            existing = find_import_job_by_checksum(this_job['checksum'])
            if existing and existing.get('status') == 'done' and existing.get('job_id') != job_id:
                # Already processed by another job, mark this as done with 0 rows
                update_import_job(job_id, status='done', processed_rows=0, progress=100)
                return

        # If filepath is a minio URI, download it to local uploads dir first
        local_path = filepath
        if isinstance(filepath, str) and filepath.startswith('minio://'):
            # format: minio://bucket/object
            parts = filepath[len('minio://'):].split('/', 1)
            bucket = parts[0]
            object_name = parts[1] if len(parts) > 1 else ''
            from apps.api.app.storage import download_to_path
            local_fn = os.path.join('uploads', f"{job_id}-{os.path.basename(object_name)}")
            download_to_path(bucket, object_name, local_fn)
            local_path = local_fn

        engine = get_engine()
        claim_lines_tbl = get_claim_lines()
        with open(local_path, 'r', encoding='utf-8') as fh:
            reader = csv.DictReader(fh)
            # basic header validation
            required = {'claim_id', 'date_of_service'}
            headers = set(reader.fieldnames or [])
            if not required.issubset(headers):
                raise Exception(f"CSV missing required columns: {required - headers}")
            with engine.begin() as conn:
                for row in reader:
                    conn.execute(claim_lines_tbl.insert().values(
                        claim_id=row.get('claim_id'),
                        practice_id=practice_id or row.get('practice_id'),
                        date_of_service=row.get('date_of_service'),
                        cpt_code=row.get('cpt_code'),
                        payer_name=row.get('payer_name'),
                        allowed_amount=_as_float(row.get('allowed_amount')),
                        paid_amount=_as_float(row.get('paid_amount')),
                        status=row.get('status'),
                        raw_payload=str(row),
                    ))
                    inserted += 1

        # mark done
        update_import_job(job_id, status='done', processed_rows=inserted, progress=100)
        JOB_PROCESSED.inc()
        try:
            redis_conn.publish('import_jobs', json.dumps({'job_id': job_id, 'status': 'done', 'processed_rows': inserted}))
        except Exception:
            pass

    except Exception as e:
        update_import_job(job_id, status='failed', error=str(e))
        JOB_FAILED.inc()
        try:
            redis_conn.publish('import_jobs', json.dumps({'job_id': job_id, 'status': 'failed', 'error': str(e)}))
        except Exception:
            pass
        raise


def _as_float(v):
    try:
        return float(v)
    except Exception:
        return None


def process_metric_job(job_id: str | None, metric_key: str | None = None, payload: dict | None = None):
    """Process a scheduled metric job.

    Accepts two call signatures for compatibility with different enqueue styles:
      - (job_id, metric_key, payload)
      - (metric_key, payload)  # job_id inferred from the RQ current job id

    The function will attempt to infer a missing job_id using RQ's get_current_job().
    """
    # lazily import get_current_job to avoid import-time dependency on rq internals
    try:
        from rq import get_current_job
        cj = get_current_job()
        # Verbose dump of RQ job object for debugging
        print('worker.process_metric_job ENTRY')
        print('  positional args received: job_id=', repr(job_id), 'metric_key=', repr(metric_key), 'payload=', repr(payload))
        if cj:
            print('  RQ current job id=', cj.id)
            print('  RQ job.args=', getattr(cj, 'args', None))
            print('  RQ job.kwargs=', getattr(cj, 'kwargs', None))
            print('  RQ job.description=', getattr(cj, 'description', None))
            print('  RQ job.meta=', getattr(cj, 'meta', None))
        else:
            print('  RQ current job is None')
    except Exception as e:
        print('worker.process_metric_job: error getting current job', e)
        def get_current_job():
            return None

    # detect alternate call signature
    if payload is None and isinstance(metric_key, dict):
        # called as process_metric_job(metric_key, payload)
        payload = metric_key
        metric_key = job_id
        job = get_current_job()
        job_id = job.id if job is not None else None

    try:
        # publish running
        try:
            redis_conn.publish('metric_jobs', json.dumps({'job_id': job_id, 'status': 'running', 'metric': metric_key}))
        except Exception:
            pass
        # attempt to repair missing payload/practice_id by inspecting RQ job metadata
        try:
            job = get_current_job()
        except Exception:
            job = None
        if (not payload or not isinstance(payload, dict) or 'practice_id' not in payload) and job is not None:
            try:
                # check job.args/kwargs for a payload dict in common positions
                jargs = getattr(job, 'args', None) or ()
                jkwargs = getattr(job, 'kwargs', None) or {}
                # positional patterns: (job_id, metric_key, payload) or (metric_key, payload)
                if not payload or not isinstance(payload, dict):
                    if len(jargs) >= 3 and isinstance(jargs[2], dict):
                        payload = jargs[2]
                    elif len(jargs) >= 2 and isinstance(jargs[1], dict):
                        payload = jargs[1]
                # kwargs may include a payload key
                if (not payload or not isinstance(payload, dict)) and 'payload' in jkwargs and isinstance(jkwargs.get('payload'), dict):
                    payload = jkwargs.get('payload')
                # job.meta or kwargs may include practice_id
                if payload is None:
                    payload = {}
                if 'practice_id' not in payload:
                    if 'practice_id' in jkwargs:
                        payload.setdefault('practice_id', jkwargs.get('practice_id'))
                    else:
                        meta = getattr(job, 'meta', None) or {}
                        if isinstance(meta, dict) and meta.get('practice_id'):
                            payload.setdefault('practice_id', meta.get('practice_id'))
                        else:
                            # last resort: try to parse description for a practice_id pattern
                            desc = getattr(job, 'description', '') or ''
                            if isinstance(desc, str) and 'practice_id' in desc:
                                try:
                                    import re
                                    m = re.search(r"practice_id'?:\s*'(?P<p>[^']+)'", desc)
                                    if m:
                                        payload.setdefault('practice_id', m.group('p'))
                                except Exception:
                                    pass
            except Exception:
                pass
        # simple calculation example for collection_rate
        if metric_key == 'collection_rate':
            allowed = _as_float(payload.get('allowed_amount')) if payload else None
            paid = _as_float(payload.get('paid_amount')) if payload else None
            value = (paid / allowed) if allowed else None
            from apps.api.app.db import create_metric_entry
            practice_id = payload.get('practice_id') if payload else None
            create_metric_entry(practice_id, payload.get('profile','practice') if payload else 'practice', metric_key, {'value': value, 'inputs': payload})
        # publish done
        try:
            redis_conn.publish('metric_jobs', json.dumps({'job_id': job_id, 'status': 'done', 'metric': metric_key}))
        except Exception:
            pass
    except Exception as e:
        try:
            redis_conn.publish('metric_jobs', json.dumps({'job_id': job_id, 'status': 'failed', 'metric': metric_key, 'error': str(e)}))
        except Exception:
            pass
        raise


if __name__ == '__main__':
    Worker([q], connection=redis_conn).work()

