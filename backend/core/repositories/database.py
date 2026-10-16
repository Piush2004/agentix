import os
import time
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./agentix.db")

# Connection Pooling & Configuration
if DATABASE_URL.startswith("sqlite"):
    # SQLAlchemy's default QueuePool (pool_size=5, max_overflow=10) is sized for a
    # networked database where each connection is expensive; a SQLite connection is
    # just a local file handle, cheap to hold one per in-flight request. With the
    # default pool, as few as ~12 truly concurrent dataset uploads (each holding a
    # connection through a multi-stage pipeline run) exhausted the pool and failed
    # with "QueuePool limit of size 5 overflow 10 reached, connection timed out" -
    # reproduced directly. WAL mode below already allows real concurrent SQLite
    # access; raise the pool to actually take advantage of that instead of
    # bottlenecking on an unrelated default.
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False, "timeout": 15},
        pool_size=30,
        max_overflow=60,
        pool_timeout=30,
    )
    # Enable WAL mode for concurrent writes
    from sqlalchemy import event
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA synchronous=NORMAL")
        cursor.close()
else:
    engine = create_engine(
        DATABASE_URL,
        pool_size=20,
        max_overflow=10,
        pool_timeout=30,
        pool_pre_ping=True,  # Health Check before using a connection
        pool_recycle=1800    # Recycle connections every 30 minutes
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def wait_for_db(retries=5, delay=5):
    """Retry logic for database connection"""
    for i in range(retries):
        try:
            with engine.connect() as conn:
                logger.info("Successfully connected to the database.")
                return True
        except OperationalError as e:
            logger.warning(f"Database connection failed. Retrying in {delay} seconds... ({i+1}/{retries})")
            time.sleep(delay)
    
    logger.error("Failed to connect to the database after multiple retries.")
    return False

def ensure_guest_user():
    """
    Several code paths (unauthenticated uploads, platform routes) fall back to
    owner_id="guest_user" without ever inserting a matching User row. SQLite
    doesn't enforce foreign keys by default so this went unnoticed, but Postgres
    always enforces them — every unauthenticated WorkflowRun/Dataset insert would
    fail with a ForeignKeyViolation without this row existing first.
    """
    from core.models.models import User
    db = SessionLocal()
    try:
        if not db.query(User).filter_by(id="guest_user").first():
            db.add(User(
                id="guest_user",
                email="guest@agentix.local",
                hashed_password="!disabled",
                role="guest",
            ))
            db.commit()
            logger.info("Created default guest_user row.")
    finally:
        db.close()

def reap_stale_workflow_runs():
    """
    WorkflowRun/PipelineStage progress is only ever advanced by the process
    that started it (FastAPI BackgroundTasks in this in-process orchestrator,
    not a durable external worker). If that process is killed or restarted
    while a run is mid-flight, the run's row is permanently left at status
    "started"/"running" with no code path left to ever move it forward -
    a real, previously-unresolved defect (confirmed via runtime inspection:
    thousands of "started" rows with no dataset_id had accumulated in the
    database from an unrelated bug, plus at least one genuine "running" row
    stale since a prior backend restart).

    On every fresh process start, nothing can possibly still be executing a
    run that predates this process, so any run left at started/running is
    unambiguously stale. Mark it (and any of its non-terminal stages) failed
    with an honest, diagnosable reason instead of leaving it stuck forever
    or silently deleting history.
    """
    from core.models.models import WorkflowRun, PipelineStage
    db = SessionLocal()
    try:
        stale_runs = db.query(WorkflowRun).filter(WorkflowRun.status.in_(["started", "running"])).all()
        if not stale_runs:
            return
        for run in stale_runs:
            run.status = "failed"
            reason = "Backend process restarted while this run was in progress; no worker remained to complete it."
            run.logs = (run.logs + "\n" if run.logs else "") + f"[stale-run-reaper] {reason}"
            for stage in run.stages:
                if stage.status in ("pending", "running"):
                    stage.status = "failed"
                    stage.errors = stage.errors or (
                        '{"root_cause": "StaleRunOnStartup", "message": "%s"}' % reason
                    )
        db.commit()
        logger.warning(f"[stale-run-reaper] Marked {len(stale_runs)} orphaned workflow run(s) as failed on startup.")
    finally:
        db.close()


def _migrate_add_missing_columns():
    """
    Base.metadata.create_all() only creates tables that don't exist yet - it
    never alters an existing table to add a column a model gained later, so
    a column added to a model (e.g. Dataset.parquet_path) would silently be
    missing from an already-initialized database, causing a confusing
    "no such column" error the first time it's read rather than at startup.
    Compares each mapped table's columns against what's actually in the
    database and adds any that are missing, which is safe because every
    column added this way is nullable (ADD COLUMN with no default backfills
    existing rows as NULL in both SQLite and Postgres).
    """
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    for table in Base.metadata.sorted_tables:
        if table.name not in existing_tables:
            continue
        existing_columns = {col["name"] for col in inspector.get_columns(table.name)}
        for column in table.columns:
            if column.name in existing_columns:
                continue
            if not column.nullable:
                logger.warning(
                    f"[migrate] Skipping non-nullable column {table.name}.{column.name} - "
                    "add it with a server_default or a real migration, not auto-ALTER."
                )
                continue
            col_type = column.type.compile(engine.dialect)
            with engine.begin() as conn:
                conn.execute(text(f"ALTER TABLE {table.name} ADD COLUMN {column.name} {col_type}"))
            logger.info(f"[migrate] Added missing column {table.name}.{column.name} ({col_type})")


def init_db():
    """Automatic Migration (Creates tables if they do not exist)"""
    if wait_for_db():
        Base.metadata.create_all(bind=engine)
        _migrate_add_missing_columns()
        logger.info("Database schema initialized.")
        ensure_guest_user()
        reap_stale_workflow_runs()
