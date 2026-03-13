#!/usr/bin/env python
"""
Reproducer script: schedule a metric job, inspect RQ job, run burst worker, check DB.
Run: PYTHONPATH=$(pwd) python tools/reproduce_schedule.py
"""
import os
import sys
import json
import time

# Ensure we can import from the project
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql+pg8000://medpact:medpact@localhost:5432/medpact')
API_URL = os.getenv('API_URL', 'http://localhost:8000')

def main():
    import requests
    from redis import Redis
    from rq import Queue, Worker
    from rq.job import Job
    from sqlalchemy import create_engine, text

    r = Redis.from_url(REDIS_URL)
    q = Queue('default', connection=r)

    practice_id = 'repro_test_practice'
    metric = 'collection_rate'

    print(f"[1] Scheduling metric job via API: POST {API_URL}/metrics/schedule/{metric}")
    resp = requests.post(
        f"{API_URL}/metrics/schedule/{metric}",
        headers={'X-Practice-Id': practice_id, 'Content-Type': 'application/json'},
        json={}
    )
    print(f"    Response status: {resp.status_code}")
    payload = resp.json()
    print(f"    Response JSON: {json.dumps(payload, indent=2)}")
    job_id = payload.get('job_id')
    rq_args = payload.get('rq_args')
    print(f"    Returned job_id: {job_id}")
    print(f"    Returned rq_args: {rq_args}")

    # Fetch the RQ job directly from Redis
    print(f"\n[2] Fetching RQ job from Redis (job_id={job_id})")
    try:
        # RQ stores jobs under rq:job:<id>; the Job.fetch uses connection to retrieve
        # But our job_id != RQ's internal job.id unless we set job_id explicitly.
        # RQ's enqueue returns a Job object whose .id is auto-generated unless we pass job_id=.
        # Let's list all jobs in the queue to find the one we just enqueued.
        job_ids_in_queue = q.job_ids
        print(f"    Jobs currently in queue: {job_ids_in_queue}")
        for jid in job_ids_in_queue:
            j = Job.fetch(jid, connection=r)
            print(f"    Job {jid}: func={j.func_name}, args={j.args}, kwargs={j.kwargs}, description={j.description}")
    except Exception as e:
        print(f"    Error fetching jobs: {e}")

    print(f"\n[3] Running burst worker to process queued jobs")
    Worker([q], connection=r).work(burst=True)

    print(f"\n[4] Querying DB for practice_metric_entries with practice_id={practice_id}")
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT id, practice_id, metric_key, payload, created_at FROM practice_metric_entries WHERE practice_id = :pid ORDER BY id DESC LIMIT 5"), {'pid': practice_id}).fetchall()
        if rows:
            for row in rows:
                print(f"    Row: id={row[0]}, practice_id={row[1]}, metric_key={row[2]}, payload={row[3]}, created_at={row[4]}")
        else:
            print(f"    No rows found for practice_id={practice_id}")

    # Also show all recent metric entries regardless of practice_id
    print(f"\n[5] Recent practice_metric_entries (any practice_id):")
    with engine.connect() as conn:
        rows = conn.execute(text("SELECT id, practice_id, metric_key, payload, created_at FROM practice_metric_entries ORDER BY id DESC LIMIT 10")).fetchall()
        for row in rows:
            print(f"    Row: id={row[0]}, practice_id={row[1]}, metric_key={row[2]}, payload={row[3]}, created_at={row[4]}")

    print("\n[Done]")


if __name__ == '__main__':
    main()
