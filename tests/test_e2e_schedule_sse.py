import requests
import time
import json
import os
import subprocess

API = 'http://127.0.0.1:8000'
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')


def wait_for_ready(timeout=60):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(f"{API}/ready", timeout=2)
            if r.status_code == 200:
                return True
        except Exception:
            pass
        time.sleep(0.5)
    return False


def stream_sse(url, timeout=15):
    """Simple SSE iterator yielding parsed JSON payloads from server-sent events.
    Note: this reads until `timeout` seconds have elapsed or the connection closes.
    """
    with requests.get(url, stream=True, timeout=timeout) as r:
        r.raise_for_status()
        buf = ''
        start = time.time()
        # iter_content with small chunk size to be responsive
        for chunk in r.iter_content(chunk_size=1024):
            if chunk is None:
                continue
            try:
                s = chunk.decode('utf-8')
            except Exception:
                continue
            buf += s
            while '\n' in buf:
                line, buf = buf.split('\n', 1)
                line = line.strip()
                if not line:
                    continue
                if line.startswith('data:'):
                    payload = line[len('data:'):].strip()
                    try:
                        yield json.loads(payload)
                    except Exception:
                        yield payload
            if time.time() - start > timeout:
                break


def test_schedule_roundtrip_sse():
    assert wait_for_ready(), 'API did not become ready in time'

    # schedule a job
    r = requests.post(f"{API}/metrics/schedule/collection_rate", headers={'X-Practice-Id': 'e2e_test'}, json={})
    assert r.status_code == 200
    job = r.json()
    job_id = job.get('job_id')
    assert job_id

    # Run a burst worker in a subprocess to process the job
    # This will publish the 'done' event that we're listening for via SSE
    worker_proc = subprocess.Popen(
        ['python', '-m', 'rq.cli', 'worker', '--burst', '--url', REDIS_URL],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    # Try to listen for SSE events with reconnect/backoff until overall timeout
    overall_timeout = 60
    deadline = time.time() + overall_timeout
    seen = []
    backoff = 0.5
    terminal_event = None

    while time.time() < deadline:
        try:
            # read for a short window per connection to allow reconnects
            for event in stream_sse(f"{API}/metrics/events/", timeout=10):
                seen.append(event)
                if isinstance(event, dict) and event.get('job_id') == job_id and event.get('status') in ('done', 'failed'):
                    terminal_event = event
                    break
            if terminal_event:
                break
        except Exception as exc:
            seen.append({'error': str(exc)})

        # backoff before reconnecting
        time.sleep(backoff)
        backoff = min(backoff * 2, 5)

    if not terminal_event:
        assert False, f"Did not observe done event for job {job_id} within {overall_timeout}s, events: {seen}"

    assert terminal_event.get('status') == 'done', f"Job {job_id} finished with status {terminal_event.get('status')}, events: {seen}"
