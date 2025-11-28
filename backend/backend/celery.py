from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from dotenv import load_dotenv
from django.conf import settings


load_dotenv()

# Set default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', os.getenv(
    'DJANGO_SETTINGS_MODULE', 'backend.config.dev'))

app = Celery('backend', broker='redis://localhost:6379/0')

app.conf.result_backend = 'redis://localhost:6379/1'

# Load task modules from all registered Django app configs.
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))
