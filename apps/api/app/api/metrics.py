from fastapi import APIRouter, Body, HTTPException, Response, Depends, Request
from typing import Dict, Any
from ..db import create_metric_entry, list_metric_entries, get_engine, delete_metric_entry
from ..auth import get_practice_id
from sqlalchemy import text
import csv
import io
from redis import Redis
from rq import Queue, Retry
import os
import json
from uuid import uuid4

router = APIRouter(prefix="/metrics", tags=["metrics"])

# Catalog with input schema for frontend auto-generation
METRICS_CATALOG = {
    'collection_rate': {
        'title': 'Net Collection Rate',
        'description': 'Percent of allowed charges collected',
        'inputs': [
            {'key': 'allowed_amount', 'label': 'Allowed Amount', 'type': 'number'},
            {'key': 'paid_amount', 'label': 'Paid Amount', 'type': 'number'},
        ],
        'goal': 0.9
    },
    'denial_rate': {
        'title': 'Denial Rate',
        'description': 'Percent of claims denied',
        'inputs': [
            {'key': 'denied_count', 'label': 'Denied Count', 'type': 'number'},
            {'key': 'total_claims', 'label': 'Total Claims', 'type': 'number'},
        ],
        'goal': 0.03
    },
    'avg_days_to_payment': {
        'title': 'Average Days to Payment (DSO)',
        'description': 'Average days between date_of_service and payment_date',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': 45
    },
    'paid_per_claim': {
        'title': 'Paid per Claim',
        'description': 'Average paid amount per claim',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
    'payer_mix_top': {
        'title': 'Top Payer Mix',
        'description': 'Distribution of allowed by payer',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
    'top_cpt_concentration': {
        'title': 'CPT Concentration',
        'description': 'Top CPTs by volume/revenue',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
    'avg_allowed_paid_by_cpt': {
        'title': 'Avg Allowed/Paid by CPT',
        'description': 'Average allowed and paid per CPT',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
    'visits_per_week': {
        'title': 'Visits / Encounters Volume',
        'description': 'Total encounters in period',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
    'new_patients': {
        'title': 'New Patient Count',
        'description': 'New unique patients in period',
        'inputs': [
            {'key': 'start_date', 'label': 'Start Date', 'type': 'date'},
            {'key': 'end_date', 'label': 'End Date', 'type': 'date'},
        ],
        'goal': None
    },
}


@router.get('/catalog')
def catalog():
    return METRICS_CATALOG


@router.post('/calculate/{metric_key}')
def calculate(metric_key: str, payload: Dict[str, Any] = Body(...)):
    if metric_key not in METRICS_CATALOG:
        raise HTTPException(status_code=404, detail='metric not implemented')

    # quick numeric helpers
    def n(v):
        try:
            return float(v)
        except Exception:
            return None

    if metric_key == 'collection_rate':
        allowed = n(payload.get('allowed_amount'))
        paid = n(payload.get('paid_amount'))
        value = (paid / allowed) if allowed else None
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': value, 'inputs': payload})
        suggestion = None
        if value is None:
            suggestion = 'Missing allowed_amount or paid_amount.'
        elif value < METRICS_CATALOG['collection_rate']['goal']:
            suggestion = 'Collection rate below target; review denials and AR follow-up.'
        else:
            suggestion = 'Collection rate meets target.'
        return {'value': value, 'suggestion': suggestion, 'entry': entry}

    if metric_key == 'denial_rate':
        denied = n(payload.get('denied_count'))
        total = n(payload.get('total_claims'))
        value = (denied / total) if total else None
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': value, 'inputs': payload})
        suggestion = None
        if value is None:
            suggestion = 'Missing denied_count or total_claims.'
        elif value > METRICS_CATALOG['denial_rate']['goal']:
            suggestion = 'Denial rate high; audit top denial reasons and re-train coding.'
        else:
            suggestion = 'Denial rate acceptable.'
        return {'value': value, 'suggestion': suggestion, 'entry': entry}

    # SQL-backed metrics
    engine = get_engine()

    if metric_key == 'avg_days_to_payment':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT AVG(EXTRACT(EPOCH FROM (payment_date - date_of_service))/86400.0) as avg_days
            FROM claim_lines
            WHERE payment_date IS NOT NULL
              AND date_of_service BETWEEN :start AND :end
        """)
        r = engine.execute(q, {'start': start, 'end': end}).fetchone()
        val = r['avg_days'] if r is not None else None
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': val, 'inputs': payload})
        suggestion = 'OK' if val is not None and val <= METRICS_CATALOG['avg_days_to_payment']['goal'] else 'Investigate AR aging' if val is not None else 'Missing data'
        return {'value': val, 'suggestion': suggestion, 'entry': entry}

    if metric_key == 'paid_per_claim':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT SUM(COALESCE(paid_amount,0)) / NULLIF(COUNT(DISTINCT claim_id),0) as avg_paid
            FROM claim_lines
            WHERE date_of_service BETWEEN :start AND :end
        """)
        r = engine.execute(q, {'start': start, 'end': end}).fetchone()
        val = r['avg_paid'] if r is not None else None
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': val, 'inputs': payload})
        return {'value': val, 'suggestion': None, 'entry': entry}

    if metric_key == 'payer_mix_top':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT payer_name, SUM(COALESCE(allowed_amount,0)) AS allowed
            FROM claim_lines
            WHERE date_of_service BETWEEN :start AND :end
            GROUP BY payer_name
            ORDER BY allowed DESC
            LIMIT 10
        """)
        rows = engine.execute(q, {'start': start, 'end': end}).fetchall()
        data = [{'payer': r['payer_name'], 'allowed': r['allowed']} for r in rows]
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': data, 'inputs': payload})
        return {'value': data, 'suggestion': None, 'entry': entry}

    if metric_key == 'top_cpt_concentration':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT cpt_code, COUNT(*) as cnt, SUM(COALESCE(allowed_amount,0)) as allowed
            FROM claim_lines
            WHERE date_of_service BETWEEN :start AND :end
            GROUP BY cpt_code
            ORDER BY allowed DESC
            LIMIT 20
        """)
        rows = engine.execute(q, {'start': start, 'end': end}).fetchall()
        data = [{'cpt': r['cpt_code'], 'count': r['cnt'], 'allowed': r['allowed']} for r in rows]
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': data, 'inputs': payload})
        return {'value': data, 'suggestion': None, 'entry': entry}

    if metric_key == 'avg_allowed_paid_by_cpt':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT cpt_code, AVG(COALESCE(allowed_amount,0)) as avg_allowed, AVG(COALESCE(paid_amount,0)) as avg_paid
            FROM claim_lines
            WHERE date_of_service BETWEEN :start AND :end
            GROUP BY cpt_code
            ORDER BY avg_allowed DESC
            LIMIT 50
        """)
        rows = engine.execute(q, {'start': start, 'end': end}).fetchall()
        data = [{'cpt': r['cpt_code'], 'avg_allowed': r['avg_allowed'], 'avg_paid': r['avg_paid']} for r in rows]
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': data, 'inputs': payload})
        return {'value': data, 'suggestion': None, 'entry': entry}

    if metric_key == 'visits_per_week':
        start = payload.get('start_date')
        end = payload.get('end_date')
        q = text("""
            SELECT COUNT(DISTINCT claim_id) as visits
            FROM claim_lines
            WHERE date_of_service BETWEEN :start AND :end
        """)
        r = engine.execute(q, {'start': start, 'end': end}).fetchone()
        val = r['visits'] if r is not None else 0
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': val, 'inputs': payload})
        return {'value': val, 'suggestion': None, 'entry': entry}

    if metric_key == 'new_patients':
        start = payload.get('start_date')
        end = payload.get('end_date')
        # Assuming claim_lines has patient_id and first_claim_date isn't tracked; infer new by first claim in dataset
        q = text("""
            SELECT COUNT(*) as new_patients FROM (
              SELECT patient_id, MIN(date_of_service) AS first_dos
              FROM claim_lines
              GROUP BY patient_id
              HAVING MIN(date_of_service) BETWEEN :start AND :end
            ) sub
        """)
        r = engine.execute(q, {'start': start, 'end': end}).fetchone()
        val = r['new_patients'] if r is not None else 0
        entry = create_metric_entry(payload.get('practice_id'), payload.get('profile','practice'), metric_key, {'value': val, 'inputs': payload})
        return {'value': val, 'suggestion': None, 'entry': entry}

    raise HTTPException(status_code=404, detail='metric not implemented')


@router.get('/entries')
def entries(practice_id: str = None, metric_key: str = None):
    return list_metric_entries(practice_id, metric_key)


@router.delete('/entries/{entry_id}')
def delete_entry(entry_id: int):
    delete_metric_entry(entry_id)
    return {'deleted': entry_id}


@router.get('/entries.csv')
def export_entries(practice_id: str = None):
    rows = list_metric_entries(practice_id)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id','practice_id','metric_key','created_at','payload'])
    for r in rows:
        writer.writerow([r.get('id'), r.get('practice_id'), r.get('metric_key'), r.get('created_at'), r.get('payload')])
    return Response(content=output.getvalue(), media_type='text/csv')


# scheduling stub — in a real app you'd enqueue a background job
@router.post('/schedule/{metric_key}')
def schedule_metric(metric_key: str, payload: Dict[str, Any] = Body(...), practice_id: str = Depends(get_practice_id), request: Request = None):
    # enqueue a background job to run this metric via RQ
    redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
    redis_conn = Redis.from_url(redis_url)
    q = Queue('default', connection=redis_conn)
    # Attach practice_id into payload so worker can create metric entries with practice scope.
    # Read header directly from Request when available to be robust under uvicorn/requests calls.
    try:
        header_pid = None
        if request is not None:
            header_pid = request.headers.get('X-Practice-Id') or request.query_params.get('practice_id')
    except Exception:
        header_pid = None
    pid = header_pid or practice_id
    if payload is None:
        payload = {}
    if pid:
        # enforce practice_id into payload so worker always has it
        payload['practice_id'] = pid

    # create a stable job id that the caller and the worker will agree on
    job_id = str(uuid4())
    # Enqueue the actual callable so RQ stores args correctly (passing a string can mis-order args)
    try:
        # Prefer importing the worker module and enqueue the callable to guarantee positional arg ordering
        import importlib, logging
        worker_mod = importlib.import_module('apps.api.worker')
        try:
            print('metrics.schedule_metric: enqueueing job', job_id, 'metric_key=', metric_key, 'payload=', payload)
        except Exception:
            pass
        job = q.enqueue(worker_mod.process_metric_job, job_id, metric_key, payload)
    except Exception as e:
        # Importing the worker module failed — don't fallback to ambiguous enqueueing.
        try:
            print('metrics.schedule_metric: import apps.api.worker failed, cannot enqueue deterministically:', e)
        except Exception:
            pass
        raise HTTPException(status_code=500, detail=f'worker import failed: {e}')
    try:
        # publish queued event including payload so SSE subscribers get the practice_id immediately
        redis_conn.publish('metric_jobs', json.dumps({'job_id': job_id, 'status': 'queued', 'metric': metric_key, 'payload': payload}))
    except Exception:
        pass
    # include RQ job serialization info to help debug worker arg shapes
    try:
        rq_args = getattr(job, 'args', None)
    except Exception:
        rq_args = None
    return {'scheduled': True, 'metric': metric_key, 'job_id': job_id, 'rq_args': rq_args}
