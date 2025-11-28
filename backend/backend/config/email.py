import os
from dotenv import load_dotenv


load_dotenv()

# Email (gmail) settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465  # EMAIL_PORT = 587 works other times
EMAIL_USE_SSL = True  # EMAIL_USE_TLS = True works other times
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = 'qurbaan.ng@gmail.com'
