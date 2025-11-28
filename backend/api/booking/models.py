from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError


class Booking(models.Model):
    """
    Represents a user booking.
    """

    PACKAGE_CHOICES = [
        ('basic', 'Basic'),
        ('standard', 'Standard'),
        ('monthly', 'Monthly'),
    ]

    DELIVERY_CHOICES = [
        ('pickup', 'Pickup'),
        ('delivery', 'Delivery'),
    ]

    STATUS_CHOICES = [
        ('amount_mismatch', 'Amount Mismatch'),
        ('failed', 'Failed'),
        ('pending', 'Pending Payment'),
        ('completed', 'Completed'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    package_type = models.CharField(
        max_length=10, choices=PACKAGE_CHOICES, default='basic')
    delivery_option = models.CharField(
        max_length=10, choices=DELIVERY_CHOICES, default='pickup')
    slots = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid = models.BooleanField(default=False)
    status = models.CharField(max_length=50, null=True,
                              blank=True, choices=STATUS_CHOICES, default='pending')
    payment_reference = models.CharField(
        max_length=255, null=True, blank=True, unique=True,)
    created_at = models.DateTimeField(auto_now_add=True)
    referral_code = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"Booking {self.id} by {self.user.first_name or self.user.email} for {self.slots} slots of {self.package_type} package"

    def save(self, *args, **kwargs):
        if self.slots <= 0:
            raise ValidationError("Number of slots must be greater than zero.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Override the delete method. No location updates needed anymore.
        """
        super().delete(*args, **kwargs)


class ReferralLog(models.Model):
    """
    Represents a referral reward.
    """
    referrer = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='referrals_given', on_delete=models.CASCADE)
    referred = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='referrals_received', on_delete=models.CASCADE)
    amount_earned = models.DecimalField(
        max_digits=10, decimal_places=2, default=0)
    booking = models.ForeignKey(
        Booking, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.first_name or self.referrer.email} referred {self.referred.first_name or self.referred.email} - ₦{self.amount_earned}"


class FlutterwaveWebhookLog(models.Model):
    """
    Stores raw Flutterwave webhook payloads for auditing and debugging.
    """
    received_at = models.DateTimeField(auto_now_add=True)
    headers = models.JSONField(blank=True, null=True)
    body = models.JSONField(blank=True, null=True)
    # Store the raw signature for verification purposes
    verif_hash = models.CharField(max_length=255, blank=True, null=True)
    # Status of processing: pending, success, failed, invalid_signature, etc.
    processing_status = models.CharField(
        max_length=50, default='pending')
    # Optional: link to the booking if successfully processed
    booking = models.ForeignKey(
        Booking, on_delete=models.SET_NULL, null=True, blank=True)
    error_message = models.TextField(
        blank=True, null=True)  # To store detailed errors

    def __str__(self):
        return f"Webhook Log {self.id} - {self.processing_status} at {self.received_at}"

    class Meta:
        ordering = ['-received_at']
