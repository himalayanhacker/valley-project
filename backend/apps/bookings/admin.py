from django.contrib import admin
from .models import Package, Booking


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['name', 'duration_days', 'price', 'accommodation', 'featured']
    list_editable = ['featured']
    list_filter = ['featured']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['package', 'email', 'check_in', 'check_out', 'adults', 'children', 'status', 'created_at']
    list_filter = ['status', 'package']
    list_editable = ['status']
    search_fields = ['email']
    date_hierarchy = 'created_at'
