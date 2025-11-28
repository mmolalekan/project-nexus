import logging
from .models import User
from celery import shared_task
from .utils import send_verification_email, send_password_reset_email


logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_verification_email_task(self, user_id, verify_url):
    """Send verification email asynchronously with retry support"""
    try:
        user = User.objects.get(id=user_id)
        send_verification_email(user, verify_url)
        logger.info(f"Verification email sent successfully to {user.email}")
    except Exception as exc:
        logger.error(
            f"Failed to send verification email to user {user_id}: {str(exc)}")
        self.retry(exc=exc, countdown=60*1)  # Retry after 1 minute


@shared_task(bind=True, max_retries=3)
def send_password_reset_email_task(self, user_id, reset_url):
    """Send password reset email asynchronously with retry support"""
    try:
        user = User.objects.get(id=user_id)
        send_password_reset_email(user, reset_url)
        logger.info(f"Password reset email sent successfully to {user.email}")
    except Exception as exc:
        logger.error(
            f"Failed to send password reset email to user {user_id}: {str(exc)}")
        self.retry(exc=exc, countdown=60*1)  # Retry after 1 minute
