#!/usr/bin/env python3
"""Simple healthcheck for the worker: ping Redis and report queue length.
Exit code 0 when healthy, 2 when Redis unreachable, 1 when queue backlog is too high.
"""
import sys
from redis import Redis

import os
REDIS_URL = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0')
MAX_BACKLOG = 1000

def main():
    try:
        r = Redis.from_url(REDIS_URL, socket_connect_timeout=2)
        if not r.ping():
            print("redis_ping_failed")
            return 2
        qlen = r.llen('rq:queue:default')
        print(f"ok queue_len={qlen}")
        if qlen and qlen > MAX_BACKLOG:
            print("backlog_too_high")
            return 1
        return 0
    except Exception as e:
        print("err", e)
        return 2

if __name__ == '__main__':
    sys.exit(main())
