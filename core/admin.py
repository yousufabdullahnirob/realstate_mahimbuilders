from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Project, ProjectImage, Apartment, ApartmentImage,
    Inquiry, Booking, Installment, Payment, Sale,
    Notification, PropertyView, Favorite
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'is_active', 'date_joined']
    list_filter = ['role', 'is_active']
    search_fields = ['email', 'full_name']
    ordering = ['-date_joined']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('full_name', 'phone', 'role', 'profile_image')}),
    )


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'location', 'status', 'total_floors', 'total_units', 'launch_date', 'is_active']
    list_filter = ['status', 'is_active']
    search_fields = ['name', 'location']
    inlines = [ProjectImageInline]


class ApartmentImageInline(admin.TabularInline):
    model = ApartmentImage
    extra = 1


@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'location', 'price', 'bedrooms', 'bathrooms', 'status', 'is_approved']
    list_filter = ['status', 'is_approved']
    search_fields = ['title', 'location']
    inlines = [ApartmentImageInline]


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ['user', 'apartment', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['user__email', 'apartment__title']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_reference', 'user', 'apartment', 'status', 'advance_amount', 'booking_date']
    list_filter = ['status']
    search_fields = ['booking_reference', 'user__email']


@admin.register(Installment)
class InstallmentAdmin(admin.ModelAdmin):
    list_display = ['booking', 'due_date', 'amount', 'is_paid', 'paid_date']
    list_filter = ['is_paid']


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'booking', 'amount', 'payment_status', 'verification_status', 'payment_date']
    list_filter = ['payment_status', 'verification_status']
    search_fields = ['transaction_id', 'booking__booking_reference']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'type', 'is_read', 'created_at']
    list_filter = ['type', 'is_read']


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ['apartment', 'buyer', 'final_price', 'sale_date']


@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'apartment', 'created_at']


admin.site.register(PropertyView)
