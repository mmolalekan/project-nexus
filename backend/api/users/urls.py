from django.urls import path
from .views import (
    LoginView,
    ForgotPasswordView,
    ResetPasswordConfirmView,
    ResendVerificationCodeView,
    VerifyEmailView, RegisterUserView,
    LogoutView,
    ProfileView,
)

from .token_views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    TokenValidityCheckView)

urlpatterns = [
    # User Registration
    path("register/", RegisterUserView.as_view(), name="register"),

    # Email Verification
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("resend-verification-code/", ResendVerificationCodeView.as_view(),
         name="resend-verification-code"),

    # Password Management
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordConfirmView.as_view(),
         name="reset-password"),

    # Authentication
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),

    # JWT Token
    path('token/', CustomTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token-refresh"),
    path("token/validity/", TokenValidityCheckView.as_view(), name="token-validity"),

    # Profile Update
    path("profile/update/", ProfileView.as_view(), name="profile-update"),

    # Profile Retrieval
    path("profile/", ProfileView.as_view(), name="profile"),

]
