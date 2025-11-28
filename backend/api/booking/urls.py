from .views import (
    BookingViewSet,
    BookingSummaryView,
    FlutterwaveWebhookView,
    validate_referral_code,
    GeneratePaymentLinkView,
)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.views.decorators.csrf import csrf_exempt


router = DefaultRouter()
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('validate-referral-code/', validate_referral_code,
         name='validate_referral_code'),
    path('generate-payment-link/', GeneratePaymentLinkView.as_view(),
         name='generate_payment_link'),
    path('flutterwave-webhook/', csrf_exempt(FlutterwaveWebhookView.as_view()),
         name='flutterwave_webhook'),
    path('bookings-summary/', BookingSummaryView.as_view(),
         name='booking_summary'),
]
