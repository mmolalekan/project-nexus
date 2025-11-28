import os
from .base import *
from dotenv import load_dotenv

load_dotenv()

DEBUG = bool(os.environ.get('DJANGO_DEBUG', default=False))

FRONTEND_URL = 'https://qurbaan.com.ng'

# logo url
LOGO_URL = f"{FRONTEND_URL}/images/logo.png"

# set these 2 to allow cross origin
CORS_ALLOWED_ORIGINS = ['https://qurbaan.com.ng', 'https://www.qurbaan.com.ng']
CORS_ALLOW_CREDENTIALS = True

SECURE_BROWSER_XSS_FILTER = True

SECURE_CONTENT_TYPE_NOSNIFF = True

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True

X_FRAME_OPTIONS = 'DENY'
