from celery import shared_task
from django.conf import settings
from .models import Booking, ReferralLog  # Removed Location
from api.users.models import User
from django.db import transaction
import logging
from api.users.utils import send_email
from decimal import Decimal

logger = logging.getLogger(__name__)


# Removed check_booking_expiration as there are no "available slots" to manage anymore with locations gone.
# If you still want to handle unpaid bookings expiration for cleanup, the logic would be simpler
# (just marking as expired, no slot release). Re-add if needed for cleanup.


@shared_task
def send_booking_confirmation_email_task(booking_id):
    """
    Sends a booking confirmation email to the user and a referral notification
    email to the referrer (if applicable).
    """
    try:
        booking = Booking.objects.get(pk=booking_id)
    except Booking.DoesNotExist:
        logger.error(
            f"Booking with id {booking_id} not found when trying to send confirmation email."
        )
        return

    # Send email to the user who made the booking
    user_subject = "Qurbaan Booking Confirmation"
    user_context = {"booking": booking}

    try:
        send_email(booking.user, user_subject,
                   'booking_confirmation_email.html', user_context)
        logger.info(
            f"Booking confirmation email sent for booking {booking.id} to {booking.user.email}"
        )
    except Exception as e:
        logger.error(
            f"Error sending booking confirmation email for booking {booking.id} to {booking.user.email}: {e}"
        )

    # Send email to the referrer (if there's a referrer)
    try:
        # Filter by booking to get the specific referral related to this payment
        referral = ReferralLog.objects.filter(
            booking=booking).first()
        if referral:
            logger.info(
                f"Preparing referral email for Referrer: {referral.referrer.email}, Referred: {referral.referred.email}"
            )

            referrer_subject = "Your Qurbaan Referral Code Was Used!"
            referrer_context = {
                "referral": referral,
                # Use amount_earned from the ReferralLog instance
                "amount_earned": referral.amount_earned,
                "booking": booking
            }

            send_email(referral.referrer, referrer_subject,
                       'referral_notification_email.html', referrer_context)
            logger.info(
                f"Referral notification email sent for booking {booking.id} to {referral.referrer.email}"
            )

    except ReferralLog.DoesNotExist:  # This might not be caught if .first() returns None
        logger.warning(
            f"No referral log found for booking {booking.id}. No referral email sent."
        )
    except Exception as e:
        logger.error(
            f"Error sending referral notification email for booking {booking.id}: {e}"
        )


@shared_task
def update_user_earnings_task(user_id, amount: Decimal):
    """
    Updates the total earnings of a user.
    """
    try:
        user = User.objects.get(pk=user_id)
        # Ensure Decimal context for addition to prevent float issues
        user.total_referral_earnings = (
            user.total_referral_earnings or Decimal('0.00')) + Decimal(str(amount))
        # Only update this field
        user.save(update_fields=['total_referral_earnings'])
        logger.info(
            f"User {user.email} earnings updated with amount {amount}. New total: {user.total_referral_earnings}")
    except User.DoesNotExist:
        logger.error(
            f"User with id {user_id} not found when trying to update earnings.")
    except Exception as e:
        logger.error(f"Error updating user earnings for user {user_id}: {e}")
