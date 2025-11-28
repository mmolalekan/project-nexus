from django.conf import settings
from api.users.models import User
from django.dispatch import receiver
from .models import Booking, ReferralLog
from .tasks import update_user_earnings_task
from django.db.models.signals import post_save


@receiver(post_save, sender=Booking)
def booking_post_save(sender, instance, created, **kwargs):
    """
    Updates referral logs and user earnings after a booking is paid.
    Also triggers confirmation email.
    """
    if not created and instance.paid and instance.status == 'completed':  # Only when a booking is updated to paid and completed
        # Ensure referral is logged only once and for valid referrer
        if instance.referral_code:
            try:
                referrer = User.objects.get(
                    referral_code=instance.referral_code)
                # Check if this specific user-referrer pair for this booking has already been processed
                if not ReferralLog.objects.filter(referrer=referrer, referred=instance.user, booking=instance).exists():
                    if not ReferralLog.objects.filter(referrer=referrer, referred=instance.user).exists():
                        referral_log = ReferralLog(
                            referrer=referrer, referred=instance.user, amount_earned=settings.REFERRAL_BONUS, booking=instance)
                        referral_log.save()
                        # Use Celery to update user earnings
                        update_user_earnings_task.delay(
                            referrer.id, settings.REFERRAL_BONUS)
            except User.DoesNotExist:
                pass  # Invalid referral code, ignore
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(
                    f"Error in booking_post_save signal for referral: {e}")
