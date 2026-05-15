from django.urls import path
from .views import PackageListView, BookingCreateView, BookingListView

urlpatterns = [
    path('packages/', PackageListView.as_view(), name='packages-list'),
    path('bookings/', BookingCreateView.as_view(), name='booking-create'),
    path('bookings/mine/', BookingListView.as_view(), name='booking-list'),
]
