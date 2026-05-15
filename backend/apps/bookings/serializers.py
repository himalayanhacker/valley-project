from rest_framework import serializers
from .models import Package, Booking


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id', 'name', 'duration_days', 'price', 'highlights', 'accommodation', 'image', 'featured']


class BookingSerializer(serializers.ModelSerializer):
    package_name = serializers.CharField(source='package.name', read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'package', 'package_name', 'check_in', 'check_out', 'adults', 'children',
                  'email', 'special_requests', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']
