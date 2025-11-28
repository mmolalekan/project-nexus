from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff',
                    'email_verified', 'referral_code', 'total_referral_earnings', 'phone_number', 'address')  # Added address to list_display
    # Added gender to list_filter
    list_filter = ('is_staff', 'email_verified', 'gender')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number',
                     'referral_code', 'address')  # Added address to search_fields
    ordering = ('email',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('first_name',
         'last_name', 'phone_number', 'gender', 'address', 'city')}),  # Added address
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Email Verification', {'fields': (
            'email_verified', 'verification_code', 'verification_code_sent_at')}),
        ('Referral Info', {
         'fields': ('referral_code', 'total_referral_earnings')}),
        # Added bank details fieldset
        ('Bank Details', {
         'fields': ('account_number', 'account_name', 'bank_name')}),
    )
    readonly_fields = ('email_verified', 'verification_code', 'verification_code_sent_at',
                       'last_login', 'date_joined', 'total_referral_earnings', 'referral_code', 'city')


admin.site.register(User, UserAdmin)
