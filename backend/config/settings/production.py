"""
Production settings for the Oracle Cloud VM deployment.

Differs from local.py in that DEBUG is off, secrets are required (no insecure
defaults), WhiteNoise serves Django/admin static files, and the security
headers expected behind an HTTPS reverse proxy are enabled.

Activate with:  DJANGO_SETTINGS_MODULE=config.settings.production
"""
from .base import *  # noqa: F401,F403

# ---------------------------------------------------------------------------
# Core
# ---------------------------------------------------------------------------
DEBUG = False

# No insecure fallback in production — fail loudly if SECRET_KEY is missing.
SECRET_KEY = config('SECRET_KEY')

# e.g. ALLOWED_HOSTS=valley.example.com,123.45.67.89
ALLOWED_HOSTS = [h.strip() for h in config('ALLOWED_HOSTS', default='').split(',') if h.strip()]

# Always allow the loopback host so the in-container Docker healthcheck
# (curl http://localhost:8000/...) and any local probes pass regardless of the
# configured public domain. Nginx forwards the real Host header for real traffic.
ALLOWED_HOSTS += ['localhost', '127.0.0.1']

# ---------------------------------------------------------------------------
# Static files via WhiteNoise (serves the Django admin CSS/JS through gunicorn)
# ---------------------------------------------------------------------------
# Insert directly after SecurityMiddleware, as WhiteNoise's docs require.
MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware')

STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# ---------------------------------------------------------------------------
# CORS / CSRF
# ---------------------------------------------------------------------------
# The SPA is served from the same origin as the API (Nginx proxies /api),
# so cross-origin requests normally don't happen. These remain configurable
# in case the frontend is ever hosted on a separate domain.
CORS_ALLOWED_ORIGINS = [
    o.strip() for o in config('CORS_ALLOWED_ORIGINS', default='').split(',') if o.strip()
]

# Required for Django admin login over HTTPS. e.g.
# CSRF_TRUSTED_ORIGINS=https://valley.example.com
CSRF_TRUSTED_ORIGINS = [
    o.strip() for o in config('CSRF_TRUSTED_ORIGINS', default='').split(',') if o.strip()
]

# ---------------------------------------------------------------------------
# Security (safe to enable; HTTPS-related ones are gated by an env flag so the
# site still works on plain HTTP / bare IP before you've set up a certificate)
# ---------------------------------------------------------------------------
# Trust the X-Forwarded-Proto header set by the Nginx/Caddy reverse proxy.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Flip USE_HTTPS=True only AFTER a certificate is in place (see DEPLOY.md).
USE_HTTPS = config('USE_HTTPS', default=False, cast=bool)
SECURE_SSL_REDIRECT = USE_HTTPS
SESSION_COOKIE_SECURE = USE_HTTPS
CSRF_COOKIE_SECURE = USE_HTTPS

SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = 'DENY'

# ---------------------------------------------------------------------------
# Logging — surface errors to the container logs (docker compose logs -f)
# ---------------------------------------------------------------------------
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
