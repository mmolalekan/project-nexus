from django.conf import settings
from django.db.models import Sum
from api.users.models import User
from rest_framework import serializers
from .models import Booking, ReferralLog
from rest_framework.serializers import CharField
from django.core.validators import MinValueValidator


def raise_error(message):
    # Helper function to raise validation error with a custom message
    raise serializers.ValidationError({"error": message})


class BookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        read_only=True, default=serializers.CurrentUserDefault())
    package_type = serializers.ChoiceField(
        choices=Booking.PACKAGE_CHOICES)
    delivery_option = serializers.ChoiceField(
        choices=Booking.DELIVERY_CHOICES)
    slots = serializers.IntegerField(validators=[MinValueValidator(1)])
    amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    referral_code = CharField(
        required=False, allow_blank=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'package_type', 'delivery_option', 'slots',
                  'amount', 'paid', 'created_at', 'referral_code', 'status']
        read_only_fields = ['id', 'user', 'amount',
                            'paid', 'created_at', 'status']

    def validate(self, data):
        slots = data['slots']
        referral_code = data.get('referral_code')
        user = self.context['request'].user

        # Check for self-referral
        if referral_code and referral_code == user.referral_code:
            raise_error(
                "You cannot use your own referral code.")

        # Check if the user has already used this referral code
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                if ReferralLog.objects.filter(referred=user, referrer=referrer).exists():
                    raise_error("You have already used this referral code.")
            except User.DoesNotExist:
                # Treat non-existent referral code as invalid early
                raise_error("Invalid referral code.")

        # check user slot limit (max 4 slots per user as per Flutterwave limit)
        if slots > settings.MAX_SLOTS_PER_TRANSACTION:
            raise_error(
                f"You cannot book more than {settings.MAX_SLOTS_PER_TRANSACTION} slots per transaction.")

        # Check user overall limit of 7 slots
        existing_bookings_slots = Booking.objects.filter(
            user=user, paid=True).aggregate(total=Sum('slots'))['total'] or 0
        if existing_bookings_slots + slots > settings.MAX_TOTAL_SLOTS_PER_USER:
            raise_error(
                f"You cannot book more than {settings.MAX_TOTAL_SLOTS_PER_USER} slots in total.")

        return data

    def create(self, validated_data):
        # The amount calculation is now handled by GeneratePaymentLinkView
        # This serializer's create method will be called by GeneratePaymentLinkView directly.
        package_type = validated_data['package_type']
        slots = validated_data['slots']
        delivery_option = validated_data['delivery_option']

        # Import calculate_expected_amount locally to avoid circular dependency
        from api.booking.utils import calculate_expected_amount
        amount = calculate_expected_amount(
            slots=slots,
            package_type=package_type,
            delivery_option=delivery_option,
            basic_slot_price=settings.BASIC_SLOT_PRICE,
            standard_slot_price=settings.STANDARD_SLOT_PRICE,
            delivery_fee=settings.DELIVERY_FEE
        )
        validated_data['amount'] = amount

        booking = Booking.objects.create(
            user=self.context['request'].user,
            package_type=package_type,
            delivery_option=delivery_option,
            slots=slots,
            amount=amount,
            referral_code=validated_data.get('referral_code'),
            paid=False,  # Ensure it's created as unpaid
            status='pending'  # Default status
        )
        return booking


class GeneratePaymentLinkSerializer(serializers.Serializer):
    package_type = serializers.ChoiceField(
        choices=Booking.PACKAGE_CHOICES)
    delivery_option = serializers.ChoiceField(
        choices=Booking.DELIVERY_CHOICES)
    slots = serializers.IntegerField(validators=[MinValueValidator(1)])
    referral_code = CharField(required=False, allow_blank=True)

    def validate(self, data):
        package_type = data['package_type']
        slots = data['slots']
        delivery_option = data['delivery_option']
        user = self.context['request'].user
        referral_code = data.get('referral_code')

        # Check for self-referral
        if referral_code and referral_code == user.referral_code:
            raise_error("You cannot use your own referral code.")

        # Check if the user has already used this referral code
        if referral_code:
            try:
                referrer = User.objects.get(referral_code=referral_code)
                if ReferralLog.objects.filter(referred=user, referrer=referrer).exists():
                    raise_error(
                        {"valid": False, "error": "You have already used this referral code."})
            except User.DoesNotExist:
                raise_error(
                    {"valid": False, "error": "Invalid referral code."})

        # Enforce max slots per transaction
        if slots > settings.MAX_SLOTS_PER_TRANSACTION:
            raise_error(
                f"You cannot book more than {settings.MAX_SLOTS_PER_TRANSACTION} slots per transaction due to payment gateway limits.")

        # Check user's total booked slots (overall limit)
        existing_bookings_slots = Booking.objects.filter(
            user=user, paid=True).aggregate(total=Sum('slots'))['total'] or 0
        if existing_bookings_slots + slots > settings.MAX_TOTAL_SLOTS_PER_USER:
            raise_error(
                f"You cannot book more than {settings.MAX_TOTAL_SLOTS_PER_USER} slots in total across all your bookings.")
        return data
