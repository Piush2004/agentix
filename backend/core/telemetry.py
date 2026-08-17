import os
import logging
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, ConsoleSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

logger = logging.getLogger("agentix_v2")

class NoOpSpanExporter(ConsoleSpanExporter):
    """Silent exporter when telemetry is completely disabled or unreachable."""
    def export(self, spans):
        return

def setup_telemetry(app):
    """
    Initializes telemetry with a graceful fallback hierarchy:
    1. OTLPSpanExporter (Production/Staging if OTEL_ENDPOINT is set)
    2. ConsoleSpanExporter (Development)
    3. NoOpSpanExporter (Fallback if disabled or unreachable)
    """
    telemetry_enabled = os.getenv("TELEMETRY_ENABLED", "true").lower() == "true"
    env = os.getenv("ENVIRONMENT", "development")
    otel_endpoint = os.getenv("OTEL_TRACES_EXPORTER_ENDPOINT", "http://otel-collector:4317")
    
    resource = Resource(attributes={SERVICE_NAME: "agentix-backend"})
    trace_provider = TracerProvider(resource=resource)
    
    if not telemetry_enabled:
        processor = BatchSpanProcessor(NoOpSpanExporter())
        logger.info("Telemetry disabled. Using NoOp exporter.")
    else:
        try:
            # We attempt to setup OTLP, but we shouldn't fail if the network is down.
            # OTLPSpanExporter will queue and log internally. To avoid crash, 
            # we can check if it's production or we explicitly want OTLP.
            if env == "production" or os.getenv("FORCE_OTLP") == "true":
                exporter = OTLPSpanExporter(endpoint=otel_endpoint, insecure=True)
                logger.info(f"Using OTLPSpanExporter at {otel_endpoint}")
            else:
                exporter = ConsoleSpanExporter()
                logger.info("Using ConsoleSpanExporter for development.")
                
            processor = BatchSpanProcessor(exporter)
        except Exception as e:
            logger.warning(f"Failed to initialize primary telemetry exporter: {str(e)}. Falling back to NoOp.")
            processor = BatchSpanProcessor(NoOpSpanExporter())
            
    trace_provider.add_span_processor(processor)
    trace.set_tracer_provider(trace_provider)
    FastAPIInstrumentor.instrument_app(app)
