import os
import logging
from .models import User
from dotenv import load_dotenv
from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from .utils import send_verification_email
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import (
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer
)


load_dotenv()
logger = logging.getLogger(__name__)


class RegisterUserView(APIView):
    """Register a new user."""
    serializer_class = RegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully! Please check your email for verification."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyEmailView(APIView):
    """Verify the user's email using the verification code."""

    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('verification_code')

        # Check if the email exists
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        # Check if the verification code is valid
        valid, message = user.verify_code(code)
        if not valid:
            return Response({"detail": message}, status=status.HTTP_400_BAD_REQUEST)

        # Verify the email
        user.email_verified = True
        user.verification_code = None
        user.save()
        return Response({"detail": "Email verified successfully."}, status=status.HTTP_200_OK)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get user from serializer
        user = serializer.validated_data["user"]

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Get profile data based on role
        if user:
            profile_data = ProfileSerializer(user).data

        # Prepare response
        response = Response({
            "detail": "Login Successful",
            "data": profile_data
        }, status=status.HTTP_200_OK)

        # Set cookies for tokens
        response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Lax").capitalize(),
            max_age=settings.REFRESH_TOKEN_LIFETIME,
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=os.getenv("COOKIE_SECURE", "True").lower() == "true",
            samesite=os.getenv("COOKIE_SAMESITE", "Lax"),
            max_age=settings.ACCESS_TOKEN_LIFETIME,
        )

        return response


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response({
            "detail": "Profile fetched successfully",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request):
        serializer = self.serializer_class(
            request.user,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            logger.info(f"Validated data: {serializer.validated_data}")

            updated_user = serializer.save()
            updated_user.refresh_from_db()

            logger.info(f"Updated user data: {updated_user.__dict__}")

            response_serializer = self.serializer_class(updated_user)
            return Response({
                "detail": "Profile updated successfully",
                "data": response_serializer.data
            }, status=status.HTTP_200_OK)

        logger.error(f"Validation errors: {serializer.errors}")
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ForgotPasswordView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password reset link has been sent to your email."}, status=status.HTTP_200_OK)


class ResetPasswordConfirmView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password has been reset successfully."}, status=status.HTTP_200_OK)


class ResendVerificationCodeView(APIView):
    """Resend the verification code to the user."""

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')

        if not email:
            return Response({"detail": "Email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        if user.email_verified:
            return Response({"detail": "Email is already verified."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the last code was sent less than 1 minute ago
        if user.verification_code_sent_at and timezone.now() < user.verification_code_sent_at + timedelta(minutes=1):
            return Response({"detail": "You can only request a new code every 1 minute."}, status=status.HTTP_429_TOO_MANY_REQUESTS)

        # Generate a new verification code and send it
        user.verification_code = user.generate_verification_code()
        user.verification_code_sent_at = timezone.now()
        user.save()

        verify_url = f"{settings.FRONTEND_URL}/verification?email={user.email}"
        # consider celery for this
        send_verification_email(user, verify_url)

        return Response({"detail": "Verification code resent successfully."}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # Blacklist the refresh token
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            # Clear cookies
            response = Response(
                {"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
