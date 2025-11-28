import os
from .base import *
from dotenv import load_dotenv

load_dotenv()

DEBUG = bool(os.environ.get('DJANGO_DEBUG', default=True))

FRONTEND_URL = 'http://localhost:3000'

# logo url
LOGO_URL = f"{FRONTEND_URL}/images/logo.png"

# set these 2 to allow cross origin
CORS_ALLOWED_ORIGINS = [FRONTEND_URL]
CORS_ALLOW_CREDENTIALS = True

# Media files
# Uploads to both local and cloudinary
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
