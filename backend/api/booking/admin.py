from django.contrib import admin
from django.db.models import Count, Sum, IntegerField, DecimalField
from .models import Booking, ReferralLog, FlutterwaveWebhookLog  # Import new model
from django.shortcuts import render
from django.db.models.functions import Coalesce
from decimal import Decimal

# Removed LocationAdmin


class BookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'package_type', 'delivery_option', 'slots', 'amount',  # Added new fields
                    'paid', 'payment_reference', 'created_at', 'status')
    list_filter = ('package_type', 'delivery_option',
                   'paid', 'status')  # Updated filters
    date_hierarchy = 'created_at'
    readonly_fields = ('amount', 'payment_reference', 'created_at', 'user',
                       'slots', 'referral_code', 'status', 'package_type', 'delivery_option')  # Make more fields readonly

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)


class ReferralLogAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred', 'amount_earned',
                    'booking', 'created_at')
    list_filter = ('referrer', 'referred')
    readonly_fields = ('referrer', 'referred',
                       'amount_earned', 'booking', 'created_at')

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        queryset = queryset.select_related('referrer', 'referred', 'booking')
        return queryset

    def total_referral_earnings(self, request, queryset):
        total_earnings = queryset.aggregate(
            total_earnings=Coalesce(Sum('amount_earned'), Decimal(
                '0.00'), output_field=DecimalField())
        )['total_earnings']
        context = {
            'title': 'Total Referral Earnings',
            'total_earnings': total_earnings,
        }
        return render(request, 'admin/booking/referral_log_total_earnings.html', context)

    total_referral_earnings.short_description = "Show Total Referral Earnings"
    actions = [total_referral_earnings]


# This line and the class below add it to admin
@admin.register(FlutterwaveWebhookLog)
class FlutterwaveWebhookLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'received_at', 'processing_status',
                    'verif_hash', 'booking', 'error_message_summary')
    list_filter = ('processing_status', 'received_at')
    search_fields = ('body', 'verif_hash', 'error_message')
    readonly_fields = ('received_at', 'headers', 'body', 'verif_hash',
                       'processing_status', 'booking', 'error_message')

    def error_message_summary(self, obj):
        return obj.error_message[:100] + '...' if obj.error_message and len(obj.error_message) > 100 else obj.error_message
    error_message_summary.short_description = 'Error Summary'


# Removed admin.site.register(Location, LocationAdmin)
admin.site.register(Booking, BookingAdmin)
admin.site.register(ReferralLog, ReferralLogAdmin)
