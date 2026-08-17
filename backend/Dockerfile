FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONPATH=/app
ENV PORT=8000

EXPOSE 8000

# Shell form (not exec-form JSON array) so $PORT expands - Railway/Render
# assign the listen port dynamically via this env var at container start,
# and a hardcoded --port 8000 would ignore it and fail their health check.
CMD uvicorn core.api.main:app --host 0.0.0.0 --port ${PORT:-8000}\n