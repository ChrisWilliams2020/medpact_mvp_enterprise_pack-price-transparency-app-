from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
import os
from redis import Redis
import json
from time import time
from sqlalchemy import text
from ..db import get_engine
import asyncio

router = APIRouter(prefix="/metrics/events", tags=["metrics"])


@router.get('/')
async def metric_events(request: Request):
    """SSE endpoint that publishes messages from the 'metric_jobs' Redis channel.
    Falls back to DB polling of a lightweight metric_jobs table if Redis unavailable.
    """
    redis_url = os.getenv('REDIS_URL', 'redis://127.0.0.1:6379/0')
    try:
        r = Redis.from_url(redis_url)
    except Exception:
        r = None

    async def redis_event_gen():
        pubsub = r.pubsub() if r is not None else None
        if pubsub is None:
            # fallback: poll DB for recent metric entries
            try:
                last_heartbeat = 0
                while True:
                    if await request.is_disconnected():
                        break
                    engine = get_engine()
                    with engine.connect() as conn:
                        rows = conn.execute(text('SELECT id, metric_key, created_at FROM practice_metric_entries ORDER BY created_at DESC LIMIT 20')).fetchall()
                    for row in rows:
                        yield f"data: {json.dumps({'id': row['id'], 'metric_key': row['metric_key'], 'created_at': str(row['created_at'])})}\n\n"
                    # heartbeat to keep connection alive
                    if time() - last_heartbeat > 5:
                        last_heartbeat = time()
                        yield ': heartbeat\n\n'
                    await asyncio.sleep(1)
            except Exception as e:
                try:
                    print('metrics_events: exception in DB fallback SSE loop', e)
                except Exception:
                    pass
            return
        pubsub.subscribe('metric_jobs')
        try:
            print('metrics_events: subscribed to metric_jobs')
        except Exception:
            pass
        try:
            # Use non-blocking get_message in an async loop so we can detect disconnects
            # send an immediate heartbeat to ensure clients with short read timeouts stay connected
            last_heartbeat = time() - 1
            yield ': connected\n\n'
            while True:
                if await request.is_disconnected():
                    break
                try:
                    msg = pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                except Exception as e:
                    try:
                        print('metrics_events: pubsub.get_message error', e)
                    except Exception:
                        pass
                    await asyncio.sleep(0.2)
                    continue
                if msg and msg.get('type') == 'message':
                    try:
                        data = msg.get('data')
                        if isinstance(data, bytes):
                            data = data.decode('utf-8')
                        print('metrics_events: got message', data)
                    except Exception:
                        data = None
                    yield f"data: {data}\n\n"
                # heartbeat to keep connection alive (more frequent to satisfy short client read timeouts)
                if time() - last_heartbeat > 1:
                    last_heartbeat = time()
                    yield ': heartbeat\n\n'
                await asyncio.sleep(0.1)
        except Exception as gen_err:
            import traceback
            try:
                print('metrics_events: exception in SSE generator', traceback.format_exc())
            except Exception:
                pass
            yield f"event: error\ndata: {json.dumps({'error': str(gen_err)})}\n\n"
        finally:
            try:
                pubsub.close()
            except Exception:
                pass

    return StreamingResponse(redis_event_gen(), media_type='text/event-stream')
