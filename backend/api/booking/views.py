import json
import uuid
import logging
import requests
from decimal import Decimal
from django.db.models import Sum
from django.conf import settings
from django.db import transaction
from api.users.models import User
from django.utils import timezone
from rest_framework.response import Response
from django.http import JsonResponse, HttpRequest
from rest_framework import viewsets, views, status
from api.booking.utils import calculate_expected_amount
from .models import Booking, ReferralLog, FlutterwaveWebhookLog
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from .serializers import BookingSerializer, GeneratePaymentLinkSerializer
from .tasks import send_booking_confirmation_email_task, update_user_earnings_task


logger = logging.getLogger(__name__)


class BookingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing user's bookings.
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Filter bookings to only show the current user's bookings.
        """
        user = self.request.user
        return Booking.objects.filter(user=user).order_by('-created_at')


class BookingSummaryView(views.APIView):
    """
    Returns a summary of all bookings across all users, categorized by package type.
    """
    permission_classes = [
        AllowAny]  # Changed to AllowAny for public/overall summary

    def get(self, request):
        # Overall totals for all users
        overall_total_slots_booked = Booking.objects.filter(paid=True).aggregate(
            total_slots=Sum('slots'))['total_slots'] or 0
        overall_total_amount_spent = Booking.objects.filter(paid=True).aggregate(
            total_amount=Sum('amount'))['total_amount'] or Decimal('0.00')

        # Totals per package type for all users
        basic_bookings_data = Booking.objects.filter(
            paid=True, package_type='basic').aggregate(
                total_slots=Sum('slots'), total_amount=Sum('amount')
        )
        basic_total_slots = basic_bookings_data['total_slots'] or 0
        basic_total_amount = basic_bookings_data['total_amount'] or Decimal(
            '0.00')

        standard_bookings_data = Booking.objects.filter(
            paid=True, package_type='standard').aggregate(
                total_slots=Sum('slots'), total_amount=Sum('amount')
        )
        standard_total_slots = standard_bookings_data['total_slots'] or 0
        standard_total_amount = standard_bookings_data['total_amount'] or Decimal(
            '0.00')

        # Total referral earnings (across all referrers)
        total_referral_earnings_overall = ReferralLog.objects.aggregate(
            total_earnings=Sum('amount_earned'))['total_earnings'] or Decimal('0.00')
        total_referrals_used_overall = ReferralLog.objects.count()

        summary_data = {
            'overall_bookings': {
                'total_slots_booked': overall_total_slots_booked,
                'total_amount_generated': overall_total_amount_spent,  # Renamed to generated
            },
            'package_breakdown': {
                'basic': {
                    'total_slots_booked': basic_total_slots,
                    'total_amount_generated': basic_total_amount,
                },
                'standard': {
                    'total_slots_booked': standard_total_slots,
                    'total_amount_generated': standard_total_amount,
                }
            },
            'overall_referral_stats': {  # New key for overall stats
                'total_referral_earnings': total_referral_earnings_overall,
                'total_referrals_used': total_referrals_used_overall,
            },
            # Removed 'recent_bookings' and 'user_info' as this is now a global summary
        }
        return Response(summary_data, status=status.HTTP_200_OK)


class GeneratePaymentLinkView(views.APIView):
    """
    API endpoint to generate a Flutterwave payment link and create an unpaid booking.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = GeneratePaymentLinkSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        package_type = serializer.validated_data['package_type']
        delivery_option = serializer.validated_data['delivery_option']
        slots = serializer.validated_data['slots']
        referral_code = serializer.validated_data.get('referral_code')
        user = request.user

        current_time = timezone.now()
        if current_time >= settings.BOOKING_CUTOFF_DATETIME and package_type != "monthly":
            return Response(
                {"error": "Bookings are now closed for Eid al-Adha. Thank you for your understanding."},
                status=status.HTTP_403_FORBIDDEN  # 403 Forbidden is appropriate for "not allowed"
            )

        expected_amount = calculate_expected_amount(
            slots=slots,
            package_type=package_type,
            delivery_option=delivery_option,
            basic_slot_price=settings.BASIC_SLOT_PRICE,
            standard_slot_price=settings.STANDARD_SLOT_PRICE,
            monthly_slot_price=settings.MONTHLY_SLOT_PRICE,
            delivery_fee=settings.DELIVERY_FEE
        )

        tx_ref = f"qrbn-{uuid.uuid4()}"

        try:
            with transaction.atomic():
                booking = Booking.objects.create(
                    user=user,
                    package_type=package_type,
                    delivery_option=delivery_option,
                    slots=slots,
                    amount=expected_amount,
                    paid=False,
                    status='pending',
                    payment_reference=tx_ref,
                    referral_code=referral_code
                )
        except Exception as e:
            logger.error(
                f"Error creating booking before payment link generation: {e}")
            return Response({"error": "Failed to create booking entry."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        payload = {
            "tx_ref": tx_ref,
            "amount": float(expected_amount),
            "currency": "NGN",
            "redirect_url": f"{settings.FRONTEND_URL}/payment-complete?booking_id={booking.id}&tx_ref={tx_ref}",
            "payment_options": "card,ussd,banktransfer",
            "customer": {
                "email": user.email,
                "name": f"{user.first_name} {user.last_name}".strip(),
            },
            "customizations": {
                "title": "Qurbaan Payment",
                "description": f"Payment for {slots} {package_type} slots with {delivery_option} option",
                "logo": getattr(settings, 'LOGO_URL', '')
            }
        }

        headers = {
            "Authorization": f"Bearer {settings.FLUTTERWAVE_SECRET_KEY}",
            "Content-Type": "application/json"
        }

        try:
            response = requests.post(
                "https://api.flutterwave.com/v3/payments",
                headers=headers,
                json=payload
            )
            response.raise_for_status()
            res_data = response.json()

            if res_data.get("status") == "success":
                payment_link = res_data["data"]["link"]
                return Response({
                    "payment_link": payment_link,
                    "booking_id": booking.id,
                    "tx_ref": tx_ref
                }, status=status.HTTP_200_OK)
            else:
                logger.error(
                    f"Flutterwave API error: {res_data.get('message', 'Unknown error')} for booking {booking.id}")
                booking.delete()
                return Response({"error": "Unable to generate payment link."}, status=status.HTTP_400_BAD_REQUEST)

        except requests.exceptions.RequestException as e:
            logger.error(
                f"Network error communicating with Flutterwave for booking {booking.id}: {e}")
            booking.delete()
            return Response({"error": "Failed to connect to payment gateway."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(
                f"Unexpected error in payment link generation for booking {booking.id}: {e}")
            booking.delete()
            return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class FlutterwaveWebhookView(views.APIView):
    """
    Handles Flutterwave webhook notifications.
    """

    def post(self, request: HttpRequest) -> JsonResponse:
        body_raw = request.body
        signature = request.headers.get('VERIF-HASH')

        try:
            body_json = json.loads(body_raw.decode('utf-8'))
        except json.JSONDecodeError:
            body_json = {"raw_body_decode_error": body_raw.decode(
                'utf-8', errors='ignore')}
            logger.error(
                'Invalid JSON payload in webhook request for logging.')

        webhook_log = FlutterwaveWebhookLog.objects.create(
            headers=dict(request.headers),
            body=body_json,
            verif_hash=signature,
            processing_status='received'
        )
        logger.info(
            f"Webhook received. Log ID: {webhook_log.id}. Signature: {signature}")

        if not signature:
            webhook_log.processing_status = 'missing_signature'
            webhook_log.error_message = 'Webhook request missing signature.'
            webhook_log.save()
            logger.warning('Webhook request missing signature.')
            return JsonResponse({'status': 'error', 'message': 'Missing signature.'}, status=400)

        secret = settings.FLUTTERWAVE_WEBHOOK_SECRET

        if secret and signature != secret:
            webhook_log.processing_status = 'invalid_signature'
            webhook_log.error_message = f'Invalid webhook signature. Expected: {secret}, Got: {signature}'
            webhook_log.save()
            logger.warning(
                f'Invalid webhook signature. Expected: {secret}, Got: {signature}')
            return JsonResponse({'status': 'error', 'message': 'Invalid signature.'}, status=400)

        logger.info('Valid webhook signature received.')
        webhook_log.processing_status = 'signature_verified'
        webhook_log.save()

        try:
            data = json.loads(body_raw.decode('utf-8'))
        except json.JSONDecodeError:
            webhook_log.processing_status = 'invalid_json'
            webhook_log.error_message = 'Invalid JSON payload in webhook request after signature verification.'
            webhook_log.save()
            logger.error(
                'Invalid JSON payload in webhook request after signature verification.')
            return JsonResponse({'status': 'error', 'message': 'Invalid JSON payload.'}, status=400)

        transaction_status = data.get('data', {}).get('status')
        transaction_reference = data.get('data', {}).get('tx_ref')
        amount_paid_raw = data.get('data', {}).get('amount')
        amount_paid_naira = Decimal(str(amount_paid_raw))

        if not transaction_reference:
            webhook_log.processing_status = 'missing_tx_ref'
            webhook_log.error_message = 'Webhook payload missing transaction reference (tx_ref).'
            webhook_log.save()
            logger.error(
                'Webhook payload missing transaction reference (tx_ref).')
            return JsonResponse({'status': 'error', 'message': 'Missing transaction reference.'}, status=400)

        try:
            with transaction.atomic():
                try:
                    booking = Booking.objects.select_for_update().get(
                        payment_reference=transaction_reference)
                    webhook_log.booking = booking
                    webhook_log.save()
                except Booking.DoesNotExist:
                    webhook_log.processing_status = 'booking_not_found'
                    webhook_log.error_message = f'Booking with transaction reference {transaction_reference} not found.'
                    webhook_log.save()
                    logger.warning(
                        f'Webhook: Booking with transaction reference {transaction_reference} not found. Ignoring.'
                    )
                    return JsonResponse({'status': 'success'}, status=200)

                if booking.paid:
                    webhook_log.processing_status = 'already_paid'
                    webhook_log.error_message = f'Booking {booking.id} already paid. Ignoring duplicate webhook.'
                    webhook_log.save()
                    logger.info(
                        f"Webhook: Booking {booking.id} already paid. Ignoring duplicate webhook.")
                    return JsonResponse({'status': 'success'}, status=200)

                expected_amount = calculate_expected_amount(
                    slots=booking.slots,
                    package_type=booking.package_type,
                    delivery_option=booking.delivery_option,
                    basic_slot_price=settings.BASIC_SLOT_PRICE,
                    standard_slot_price=settings.STANDARD_SLOT_PRICE,
                    delivery_fee=settings.DELIVERY_FEE
                )

                if transaction_status == 'successful' and amount_paid_naira >= expected_amount:
                    booking.paid = True
                    booking.status = 'completed'
                    booking.save()

                    if booking.referral_code:
                        try:
                            referrer = User.objects.get(
                                referral_code=booking.referral_code)
                            if not ReferralLog.objects.filter(referrer=referrer, referred=booking.user).exists():
                                referral_log = ReferralLog.objects.create(
                                    referrer=referrer,
                                    referred=booking.user,
                                    amount_earned=settings.REFERRAL_BONUS,
                                    booking=booking
                                )
                                update_user_earnings_task.delay(
                                    referrer.id, settings.REFERRAL_BONUS)
                        except User.DoesNotExist:
                            logger.warning(
                                f"Webhook: Referral code {booking.referral_code} not found for booking {booking.id}.")
                        except Exception as referral_error:
                            logger.error(
                                f"Webhook: Error processing referral for booking {booking.id}: {referral_error}")

                    send_booking_confirmation_email_task.delay(booking.id)
                    webhook_log.processing_status = 'success'
                    logger.info(
                        f'Webhook: Payment successful for booking {booking.id} (TX_REF: {transaction_reference})'
                    )
                elif transaction_status == 'successful' and amount_paid_naira < expected_amount:
                    webhook_log.processing_status = 'amount_mismatch'
                    webhook_log.error_message = (
                        f'Amount mismatch for booking {booking.id}. Paid: {amount_paid_naira}, Expected: {expected_amount}. '
                        f'(TX_REF: {transaction_reference})'
                    )
                    booking.status = 'amount_mismatch'
                    booking.save()
                    logger.error(webhook_log.error_message)
                else:
                    webhook_log.processing_status = 'failed_payment_status'
                    webhook_log.error_message = (
                        f'Payment not successful for booking {booking.id}. Status: {transaction_status}. '
                        f'(TX_REF: {transaction_reference})'
                    )
                    booking.status = 'failed'
                    booking.save()
                    logger.warning(webhook_log.error_message)

                webhook_log.save()

        except Exception as e:
            webhook_log.processing_status = 'internal_error'
            webhook_log.error_message = f'Unhandled error processing webhook for TX_REF {transaction_reference}: {e}'
            webhook_log.save()
            logger.error(
                f'Webhook: Unhandled error processing webhook for TX_REF {transaction_reference}: {e}', exc_info=True
            )
            return JsonResponse({'status': 'error', 'message': 'Internal server error.'}, status=500)

        return JsonResponse({'status': 'success'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_referral_code(request):
    """
    API endpoint to validate a referral code and return referrer details.
    """
    referral_code = request.data.get('referral_code')
    user = request.user

    if not referral_code:
        return Response({"error": "Referral code is required."}, status=status.HTTP_400_BAD_REQUEST)

    if referral_code == user.referral_code:
        return Response({"valid": False, "error": "You cannot use your own referral code."}, status=status.HTTP_400_BAD_REQUEST)

    if ReferralLog.objects.filter(referred=user, referrer__referral_code=referral_code).exists():
        return Response({"valid": False, "error": "You have already used this referral code."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        referrer = User.objects.get(referral_code=referral_code)
        referrer_name = f"{referrer.first_name} {referrer.last_name}".strip()
        return Response({
            "valid": True,
            "referrer_id": referrer.id,
            "referrer_name": referrer_name,
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"valid": False, "error": "Invalid referral code."}, status=status.HTTP_404_NOT_FOUND)
