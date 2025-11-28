import os
import logging
from django.utils.html import strip_tags
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError
from django.template.loader import render_to_string
from rest_framework.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def send_email(user, subject, template_name, context):
    """
    Send an email to the user.
    """
    try:
        # Render HTML template
        html_message = render_to_string(template_name, context)

        plain_message = strip_tags(html_message)

        from_email = settings.DEFAULT_FROM_EMAIL
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=from_email,
            recipient_list=[user.email],
            html_message=html_message
        )

    except BadHeaderError as e:
        logging.error(f"Failed to send email to {user.email}: {e}")
        print(f"Failed to send email to {user.email}: {e}")

    except Exception as e:
        logging.error(
            f"An unexpected error occurred while sending email to {user.email}: {e}")
        print(
            f"An unexpected error occurred while sending email to {user.email}: {e}")


def send_verification_email(user, verify_url):
    """
    Send a verification email to the user.
    """
    send_email(user, "Verify Your Email", 'verification_email.html',
               {'user': user, 'verify_url': verify_url})


def send_password_reset_email(user, reset_url):
    """
    Send a password reset email to the user.
    """
    send_email(user, "Reset Your Password", 'reset_password.html',
               {'user': user, 'reset_url': reset_url})


def validate_verification_code(user, verification_code):
    """
    Validate the verification code sent by the user.
    """
    if not user:
        raise ValidationError({"email": _("Invalid email address.")})
    if user.verification_code != verification_code:
        raise ValidationError(
            {"verification_code": _("Invalid verification code.")})
    if not user.verify_code(verification_code):
        raise ValidationError({"verification_code": _(
            "The verification code has expired.")})
