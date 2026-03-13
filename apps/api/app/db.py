import os

# Read DATABASE_URL lazily inside _ensure_db so tests and runtime can override via env
# Default kept for backward compatibility but not evaluated until needed.
DEFAULT_DATABASE_URL = 'postgresql+pg8000://medpact:medpact@localhost:5433/medpact'

# Lazy-loaded SQLAlchemy objects
engine = None
metadata = None
claim_lines = None


def _ensure_db():
    global engine, metadata, claim_lines
    if engine is not None:
        return
    try:
        from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, Date, Float, Text
    except Exception:
        # SQLAlchemy not available or incompatible; surface a clear error when used
        raise

    database_url = os.getenv('DATABASE_URL', DEFAULT_DATABASE_URL)
    engine = create_engine(database_url)
    metadata = MetaData()

    claim_lines = Table(
        'claim_lines',
        metadata,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('claim_id', String(128), nullable=False, index=True),
        Column('practice_id', String(128), nullable=True, index=True),
        Column('date_of_service', Date, nullable=True),
        Column('cpt_code', String(32), nullable=True, index=True),
        Column('payer_name', String(255), nullable=True, index=True),
        Column('allowed_amount', Float, nullable=True),
        Column('paid_amount', Float, nullable=True),
        Column('status', String(32), nullable=True),
        Column('raw_payload', Text, nullable=True),
    )


def init_db():
    _ensure_db()
    metadata.create_all(engine)


def get_engine():
    _ensure_db()
    return engine


def get_claim_lines():
    _ensure_db()
    return claim_lines


def init_todos_table():
    _ensure_db()
    from sqlalchemy import Table, Column, Integer, String, Boolean, DateTime, func, Text
    todos = Table(
        'todos',
        metadata,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('text', Text, nullable=False),
        Column('done', Boolean, nullable=False, server_default='false'),
        Column('created_at', DateTime, server_default=func.now()),
    )
    metadata.create_all(engine)


def get_todos_table():
    _ensure_db()
    t = metadata.tables.get('todos')
    if t is None:
        init_todos_table()
        t = metadata.tables.get('todos')
    return t


def list_todos():
    _ensure_db()
    todos = get_todos_table()
    with engine.connect() as conn:
        rows = conn.execute(todos.select().order_by(todos.c.id.desc())).fetchall()
        return [dict(r._mapping) for r in rows]


def create_todo(text: str):
    _ensure_db()
    todos = get_todos_table()
    with engine.begin() as conn:
        r = conn.execute(todos.insert().values(text=text, done=False))
        # return created row
        row = conn.execute(todos.select().where(todos.c.id == r.inserted_primary_key[0])).first()
        return dict(row._mapping)


def update_todo(todo_id: int, **fields):
    _ensure_db()
    todos = get_todos_table()
    with engine.begin() as conn:
        conn.execute(todos.update().where(todos.c.id == int(todo_id)).values(**fields))
        row = conn.execute(todos.select().where(todos.c.id == int(todo_id))).first()
        return dict(row._mapping) if row is not None else None


def delete_todo(todo_id: int):
    _ensure_db()
    todos = get_todos_table()
    with engine.begin() as conn:
        conn.execute(todos.delete().where(todos.c.id == int(todo_id)))


def init_practice_metrics_table():
    _ensure_db()
    from sqlalchemy import Table, Column, Integer, String, JSON, DateTime, func, Text
    pm = Table(
        'practice_metric_entries',
        metadata,
        Column('id', Integer, primary_key=True, autoincrement=True),
        Column('practice_id', String(128), nullable=True, index=True),
        Column('profile', String(64), nullable=False),
        Column('metric_key', String(128), nullable=False, index=True),
        Column('payload', JSON, nullable=True),
        Column('created_at', DateTime, server_default=func.now()),
    )
    metadata.create_all(engine)


def get_practice_metrics_table():
    _ensure_db()
    t = metadata.tables.get('practice_metric_entries')
    if t is None:
        init_practice_metrics_table()
        t = metadata.tables.get('practice_metric_entries')
    return t


def create_metric_entry(practice_id: str, profile: str, metric_key: str, payload: dict):
    _ensure_db()
    t = get_practice_metrics_table()
    with engine.begin() as conn:
        r = conn.execute(t.insert().values(practice_id=practice_id, profile=profile, metric_key=metric_key, payload=payload))
        row = conn.execute(t.select().where(t.c.id == r.inserted_primary_key[0])).first()
        return dict(row._mapping)


def list_metric_entries(practice_id: str = None, metric_key: str = None):
    _ensure_db()
    t = get_practice_metrics_table()
    with engine.connect() as conn:
        q = t.select()
        if practice_id:
            q = q.where(t.c.practice_id == practice_id)
        if metric_key:
            q = q.where(t.c.metric_key == metric_key)
        rows = conn.execute(q.order_by(t.c.created_at.desc())).fetchall()
        return [dict(r._mapping) for r in rows]


def delete_metric_entry(entry_id: int):
    _ensure_db()
    t = get_practice_metrics_table()
    with engine.begin() as conn:
        conn.execute(t.delete().where(t.c.id == int(entry_id)))


def init_import_jobs_table():
    _ensure_db()
    from sqlalchemy import Table, Column, Integer, String, Text, DateTime, func
    # id, job_id, filename, status, progress, error, processed_rows, created_at, updated_at
    import_jobs = Table(
        'import_jobs',
        metadata,
        Column('id', Integer, primary_key=True, autoincrement=True),
    Column('job_id', String(64), nullable=False, unique=True, index=True),
    Column('practice_id', String(128), nullable=True, index=True),
    Column('checksum', String(128), nullable=True, index=True),
        Column('filename', Text, nullable=False),
        Column('status', String(32), nullable=False, default='queued'),
        Column('progress', Integer, nullable=True),
        Column('error', Text, nullable=True),
        Column('processed_rows', Integer, nullable=True),
        Column('created_at', DateTime, server_default=func.now()),
        Column('updated_at', DateTime, server_default=func.now(), onupdate=func.now()),
    )
    metadata.create_all(engine)


def create_import_job_record(job_id: str, filename: str):
    _ensure_db()
    import_jobs = metadata.tables.get('import_jobs')
    if import_jobs is None:
        init_import_jobs_table()
        import_jobs = metadata.tables.get('import_jobs')
    with engine.begin() as conn:
        conn.execute(import_jobs.insert().values(job_id=job_id, filename=filename, status='queued'))


def create_or_get_import_job(job_id: str, filename: str, checksum: str = None, practice_id: str = None):
    # support optional practice_id for per-practice scoping; callers may pass it explicitly
    if practice_id is None and isinstance(filename, dict) and filename.get('practice_id'):
        # support legacy pass-through where practice_id is attached to filename arg
        practice_id = filename.get('practice_id')
    """Attempt to create an import_jobs row with the given checksum; if a row
    with the same checksum already exists, return that existing job's job_id.
    Returns the job_id for the created or existing row.
    """
    _ensure_db()
    import_jobs = metadata.tables.get('import_jobs')
    if import_jobs is None:
        init_import_jobs_table()
        import_jobs = metadata.tables.get('import_jobs')

    from sqlalchemy import text
    with engine.begin() as conn:
        if checksum:
            # Try to insert and return job_id if inserted; otherwise select existing
            r = conn.execute(text(
                """
                INSERT INTO import_jobs (job_id, checksum, filename, status)
                VALUES (:job_id, :checksum, :filename, 'queued')
                ON CONFLICT (checksum) DO NOTHING
                RETURNING job_id
                """
            ), {'job_id': job_id, 'checksum': checksum, 'filename': filename}).fetchone()
            if r is not None:
                return r[0]
            # existing row: select job_id by checksum
            row = conn.execute(import_jobs.select().where(import_jobs.c.checksum == checksum)).first()
            if row is not None:
                return row._mapping.get('job_id')
            # fallthrough: should not happen, but create a new record
            conn.execute(import_jobs.insert().values(job_id=job_id, checksum=checksum, filename=filename, status='queued', practice_id=practice_id))
            return job_id
        else:
            # No checksum provided: just insert
            conn.execute(import_jobs.insert().values(job_id=job_id, filename=filename, status='queued', practice_id=practice_id))
            return job_id


def find_import_job_by_checksum(checksum: str):
    _ensure_db()
    import_jobs = metadata.tables.get('import_jobs')
    if import_jobs is None:
        init_import_jobs_table()
        import_jobs = metadata.tables.get('import_jobs')
    with engine.connect() as conn:
        row = conn.execute(import_jobs.select().where(import_jobs.c.checksum == checksum)).first()
        if row is None:
            return None
        return dict(row._mapping)


def update_import_job(job_id: str, **fields):
    _ensure_db()
    import_jobs = metadata.tables.get('import_jobs')
    if import_jobs is None:
        init_import_jobs_table()
        import_jobs = metadata.tables.get('import_jobs')
    with engine.begin() as conn:
        # job_id may be a UUID string or a numeric id (int or digit string).
        # If it's an integer (or a digit-only string) compare against the numeric PK `id` column.
        try:
            is_int = isinstance(job_id, int) or (isinstance(job_id, str) and job_id.isdigit())
        except Exception:
            is_int = False
        if is_int:
            conn.execute(import_jobs.update().where(import_jobs.c.id == int(job_id)).values(**fields))
        else:
            conn.execute(import_jobs.update().where(import_jobs.c.job_id == str(job_id)).values(**fields))


def get_import_job(job_id: str):
    _ensure_db()
    import_jobs = metadata.tables.get('import_jobs')
    if import_jobs is None:
        init_import_jobs_table()
        import_jobs = metadata.tables.get('import_jobs')
    with engine.connect() as conn:
        # Support lookup by numeric id or by job_id string
        if isinstance(job_id, int) or (isinstance(job_id, str) and job_id.isdigit()):
            row = conn.execute(import_jobs.select().where(import_jobs.c.id == int(job_id))).first()
        else:
            row = conn.execute(import_jobs.select().where(import_jobs.c.job_id == str(job_id))).first()
        if row is None:
            return None
        # convert Row to dict
        return dict(row._mapping)
