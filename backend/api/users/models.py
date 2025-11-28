import random
from decimal import Decimal
from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import AbstractUser, BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Provide an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if not extra_fields.get('is_staff'):
            raise ValueError("Superuser must have is_staff=True.")
        if not extra_fields.get('is_superuser'):
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    GENDER_CHOICES = [('Male', 'Male'), ('Female', 'Female')]

    email = models.EmailField(unique=True)
    username = None
    phone_number = models.CharField(max_length=25, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_sent_at = models.DateTimeField(blank=True, null=True)
    # Removed location as it's no longer needed for booking
    city = models.CharField(max_length=255, blank=True)
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, blank=True)
    # Added unique=True for referral_code
    referral_code = models.CharField(blank=True, null=True, unique=True)
    total_referral_earnings = models.DecimalField(
        # Ensure default is Decimal
        max_digits=10, decimal_places=2, default=Decimal('0.00'))
    account_number = models.CharField(
        max_length=20, blank=True, null=True)
    account_name = models.CharField(
        max_length=255, blank=True, null=True)
    bank_name = models.CharField(
        max_length=255, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.first_name or self.email

    def generate_verification_code(self):
        return str(random.randint(100000, 999999))

    def generate_referral_code(self):
        return f"{self.first_name[:3]}{self.last_name[:3]}{self.id}".upper()

    def clean(self):
        super().clean()
        if self.referral_code:
            self.referral_code = self.referral_code.upper()

    def verify_code(self, code):
        if timezone.now() > self.verification_code_sent_at + timedelta(minutes=10):
            return False, "Verification code has expired."
        if self.verification_code != code:
            return False, "Invalid verification code."
        return True, "Verification code valid."

    def save(self, *args, **kwargs):
        if not self.verification_code:
            self.verification_code = self.generate_verification_code()
            self.verification_code_sent_at = timezone.now()
        is_new = self.pk is None
        super().save(*args, **kwargs)  # Save first to get ID
        if is_new and not self.referral_code:
            self.referral_code = self.generate_referral_code()
            super().save(update_fields=["referral_code"])
