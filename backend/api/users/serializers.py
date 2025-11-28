import os
import logging
from .models import User
from django.conf import settings
from django.utils import timezone
from django.db import transaction
from django.db import IntegrityError
from rest_framework import serializers
from django.contrib.auth import authenticate
from .utils import validate_verification_code
from .tasks import send_verification_email_task
from django.db import IntegrityError, transaction
from django.utils.http import urlsafe_base64_decode
from django.utils.http import urlsafe_base64_encode
from django.utils.translation import gettext_lazy as _
from django.utils.encoding import force_str, force_bytes
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.password_validation import validate_password
from .tasks import send_verification_email_task, send_password_reset_email_task


logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'gender',
                  'address', 'city', 'email_verified', 'referral_code', 'total_referral_earnings',
                  'account_number', 'account_name', 'bank_name']  # Added address
        read_only_fields = ['id', 'email_verified', 'city',
                            'referral_code', 'total_referral_earnings']


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, validators=[validate_password])
    phone_number = serializers.CharField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)

    class Meta:
        model = User
        fields = ['email', 'password', 'first_name',
                  'last_name', 'phone_number']

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if user:
            raise serializers.ValidationError(
                "A user with this email is already registered.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        # Extract user-related data
        email = validated_data.pop("email")
        password = validated_data.pop("password")
        first_name = validated_data.pop("first_name", "")
        last_name = validated_data.pop("last_name", "")
        phone_number = validated_data.pop("phone_number", "")

        try:
            # Create user
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
            )
            user.verification_code = user.generate_verification_code()
            user.verification_code_sent_at = timezone.now()
            user.save()

            # Send verification email via Celery
            verify_url = f"{settings.FRONTEND_URL}/verification?email={user.email}"
            # Schedule the task *after* the DB commit
            transaction.on_commit(
                lambda: send_verification_email_task.delay(user.id, verify_url))

            logger.info(
                f"Verification email task scheduled for user {user.id} ({user.email})")

        except IntegrityError:
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."})

        return user


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        verification_code = attrs.get("verification_code")
        user = User.objects.filter(email=email).first()

        validate_verification_code(user, verification_code)
        return attrs


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError(
                {"detail": _("Invalid credentials.")})
        if not user.email_verified:
            raise serializers.ValidationError(
                {"detail": _("Email is not verified.")})

        refresh = RefreshToken.for_user(user)
        return {
            "user": user,
        }


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['email',
                  'first_name',
                  'last_name',
                  'phone_number',
                  'gender',
                  'address',
                  'city',
                  'referral_code',
                  'total_referral_earnings',
                  'account_number',
                  'account_name',
                  'bank_name'
                  ]

    read_only_fields = ['email', 'referral_code',
                        'total_referral_earnings']

    def update(self, instance, validated_data):
        logger.info(f"Updating user with data: {validated_data}")

        editable_fields = [
            'first_name',
            'last_name',
            'phone_number',
            'gender',
            'address',
            'city',
            'account_number',
            'account_name',
            'bank_name'
        ]

        for field in editable_fields:
            if field in validated_data:
                current_value = getattr(instance, field)
                new_value = validated_data[field]
                if current_value != new_value:
                    setattr(instance, field, new_value)

        instance.save()
        return instance


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get("email")
        user = User.objects.filter(email=email).first()
        if not user:
            raise serializers.ValidationError(
                {"detail": _("User with this email does not exist.")})
        return attrs

    def save(self):
        email = self.validated_data["email"]
        user = User.objects.get(email=email)
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        reset_url = f"{settings.FRONTEND_URL}/reset-password?uid={uid}&token={token}"

        # Send the reset link via email ASYNCHRONOUSLY
        send_password_reset_email_task.delay(user.id, reset_url)
        logger.info(
            f"Password reset email task scheduled for user {user.id} ({user.email})")


class ResetPasswordSerializer(serializers.Serializer):
    uidb64 = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        uidb64 = attrs.get("uidb64")
        token = attrs.get("token")
        new_password = attrs.get("new_password")

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            raise serializers.ValidationError("Invalid Reset Link")

        if not default_token_generator.check_token(user, token):
            raise serializers.ValidationError("Invalid or expired token")

        return attrs

    def save(self, **kwargs):
        uidb64 = self.validated_data["uidb64"]
        new_password = self.validated_data["new_password"]

        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
        user.set_password(new_password)
        user.save()
