import time
import os

import requests
import pg8000
import importlib.util
import pathlib
import sys


def load_worker():
    # ensure repo root is on sys.path so imports like 'apps.api...' work
    repo_root = pathlib.Path.cwd()
    if str(repo_root) not in sys.path:
        sys.path.insert(0, str(repo_root))
    p = repo_root / 'apps' / 'api' / 'worker.py'
    spec = importlib.util.spec_from_file_location('test_worker', str(p))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


API_URL = os.getenv('API_URL', 'http://localhost:8000')


def run_sql(sql: str):
    # Connect directly to the postgres service on the compose network
    conn = pg8000.connect(host=os.getenv('PG_HOST', 'postgres'), port=5432, user='medpact', password='medpact', database='medpact')
    try:
        cur = conn.cursor()
        cur.execute(sql)
        rows = cur.fetchall()
        cur.close()
        return rows
    finally:
        conn.close()


def wait_for_job_done(job_id: str, timeout: int = 20):
    deadline = time.time() + timeout
    timeout = 60
    while time.time() < deadline:
        try:
            rows = run_sql(f"SELECT status, processed_rows FROM import_jobs WHERE job_id='{job_id}';")
            if not rows:
                time.sleep(0.5)
                continue
            status, processed = rows[0]
            if status == 'done':
                return int(processed) if processed is not None else 0
            if status == 'failed':
                raise AssertionError(f'job {job_id} failed')
        except Exception:
            pass
        time.sleep(0.5)
    raise TimeoutError('timed out waiting for job to complete')


def test_import_happy_path():
    csv_content = 'claim_id,line,amount\n1001,1,12.34\n1002,1,45.67\n'
    files = {'file': ('test.csv', csv_content, 'text/csv')}
    r = requests.post(f"{API_URL}/imports/claims", files=files)
    assert r.status_code == 200
    body = r.json()
    job_id = body['job_id']
    filename = body.get('filename')

    # Run processing synchronously in tests to avoid queue timing issues
    worker_mod = load_worker()
    worker_mod.process_import_job(job_id, filename)

    rows = run_sql(f"SELECT status, processed_rows FROM import_jobs WHERE job_id='{job_id}';")
    assert rows[0][0] == 'done'
    assert int(rows[0][1]) == 2

    # ensure claim_lines inserted (count rows with those claim_ids)
    rows = run_sql("SELECT count(*) FROM claim_lines WHERE claim_id IN ('1001','1002');")
    assert int(rows[0][0]) >= 2


def test_import_idempotency():
    csv_content = 'claim_id,line,amount\n2001,1,7.00\n2002,1,8.00\n'
    files = {'file': ('dup.csv', csv_content, 'text/csv')}
    r1 = requests.post(f"{API_URL}/imports/claims", files=files)
    assert r1.status_code == 200
    job1 = r1.json()['job_id']
    filename1 = r1.json().get('filename')
    worker_mod = load_worker()
    worker_mod.process_import_job(job1, filename1)
    rows = run_sql(f"SELECT status, processed_rows FROM import_jobs WHERE job_id='{job1}';")
    assert rows[0][0] == 'done'
    assert int(rows[0][1]) == 2

    # Post identical file again and assert we get same job id (idempotent)
    r2 = requests.post(f"{API_URL}/imports/claims", files=files)
    assert r2.status_code == 200
    job2 = r2.json()['job_id']
    assert job1 == job2

    # ensure claim_lines did not double-insert
    rows = run_sql("SELECT count(*) FROM claim_lines WHERE claim_id IN ('2001','2002');")
    assert int(rows[0][0]) == 2
