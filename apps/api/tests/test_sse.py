import os
import time
import json
import threading
import requests
from redis import Redis


def test_sse_forwarding():
    """Start an SSE client to the API, publish a message to Redis, and assert the event is received."""
    url = "http://localhost:8000/imports/events"
    r = requests.get(url, stream=True, timeout=5)

    received = []

    def reader():
        for line in r.iter_lines(decode_unicode=True):
            if line and line.startswith('data:'):
                payload = line[len('data:'):].strip()
                try:
                    received.append(json.loads(payload))
                except Exception:
                    received.append(payload)
                break

    t = threading.Thread(target=reader, daemon=True)
    t.start()

    # publish a test message (use REDIS_URL env so test works inside container)
    redis_url = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0')
    redis = Redis.from_url(redis_url)
    redis.publish('import_jobs', json.dumps({'job_id': 'pytest-1', 'status': 'queued'}))

    # wait up to 5s
    for _ in range(25):
        if received:
            break
        time.sleep(0.2)

    r.close()
    assert received, "No SSE events received"
    assert any((isinstance(x, dict) and x.get('job_id') == 'pytest-1') for x in received)
