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
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False, "timeout": 15}
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

def init_db():
    """Automatic Migration (Creates tables if they do not exist)"""
    if wait_for_db():
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema initialized.")
        ensure_guest_user()
