# This makes sure Django loads Celery when it starts.
from .celery import app as celery_app

__all__ = ('celery_app',)
