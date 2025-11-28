import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent


# Make a "logs" directory in the BASE_DIR if it doesn't exist
logs_dir = os.path.join(BASE_DIR, 'logs')
if not os.path.exists(logs_dir):
    os.makedirs(logs_dir)


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
            'datefmt': '%Y-%m-%d %H:%M:%S %p',
        },
        'simple': {
            'format': '{asctime} {levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            # Logs will be stored in a "logs" directory
            'filename': os.path.join(BASE_DIR, 'logs', 'backend.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'django.request': {
            'handlers': ['file', 'console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.db.backends': {
            'handlers': ['file', 'console'],
            'level': 'ERROR',
            'propagate': False,
        },
        '': {  # This logger applies to all apps by default
            'handlers': ['file', 'console'],
            'level': 'INFO',
            'propagate': True,
        },
        'allauth': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
