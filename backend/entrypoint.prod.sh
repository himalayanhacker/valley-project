#!/usr/bin/env bash
# Production startup: wait for the DB, apply migrations, collect static files,
# then hand off to gunicorn. Runs every container start (safe & idempotent).
set -euo pipefail

echo "==> Applying database migrations"
python manage.py migrate --noinput

echo "==> Collecting static files"
python manage.py collectstatic --noinput

echo "==> Starting gunicorn"
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers "${GUNICORN_WORKERS:-3}" \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
