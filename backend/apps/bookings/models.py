from django.db import models
from django.conf import settings


class Package(models.Model):
    name = models.CharField(max_length=100)
    duration_days = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    highlights = models.JSONField(default=list)
    accommodation = models.CharField(max_length=150)
    image = models.ImageField(upload_to='packages/', null=True, blank=True)
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')
    package = models.ForeignKey(Package, on_delete=models.PROTECT, related_name='bookings')
    check_in = models.DateField()
    check_out = models.DateField()
    adults = models.IntegerField(default=1)
    children = models.IntegerField(default=0)
    email = models.EmailField()
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.email} — {self.package.name} ({self.check_in})"
