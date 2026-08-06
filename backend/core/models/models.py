from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from core.repositories.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    datasets = relationship("Dataset", back_populates="owner", cascade="all, delete-orphan")
    settings = relationship("UserSettings", back_populates="owner", uselist=False, cascade="all, delete-orphan")
    workflow_runs = relationship("WorkflowRun", back_populates="owner", cascade="all, delete-orphan")

class UserSettings(Base):
    __tablename__ = "user_settings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)
    llm_provider = Column(String, default="ollama")
    openai_api_key = Column(String, nullable=True)
    theme = Column(String, default="dark")
    
    owner = relationship("User", back_populates="settings")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, index=True, nullable=False)
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    filepath = Column(String, nullable=False)
    rows = Column(Integer, default=0)
    columns = Column(Integer, default=0)
    size_bytes = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="datasets")

class WorkflowRun(Base):
    __tablename__ = "workflow_runs"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(String, ForeignKey("datasets.id"), nullable=True)
    status = Column(String, default="running") # running, completed, failed
    execution_time = Column(Float, default=0.0)
    logs = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    owner = relationship("User", back_populates="workflow_runs")
    stages = relationship("PipelineStage", back_populates="run", cascade="all, delete-orphan", order_by="PipelineStage.step_order")

class PipelineStage(Base):
    __tablename__ = "pipeline_stages"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    run_id = Column(String, ForeignKey("workflow_runs.id"), nullable=False)
    agent_name = Column(String, nullable=False)
    step_order = Column(Integer, nullable=False)
    status = Column(String, default="pending") # pending, started, running, completed, failed
    execution_time = Column(Float, default=0.0)
    memory_usage_mb = Column(Float, default=0.0)
    output_data = Column(Text, nullable=True) # JSON
    errors = Column(Text, nullable=True) # JSON
    warnings = Column(Text, nullable=True) # JSON
    recommendations = Column(Text, nullable=True) # JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    run = relationship("WorkflowRun", back_populates="stages")
