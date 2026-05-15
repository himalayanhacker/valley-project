from django.db import models
from django.conf import settings


class Photo(models.Model):
    CATEGORY_CHOICES = [
        ('landscapes', 'Landscapes'),
        ('wildlife', 'Wildlife'),
        ('activities', 'Activities'),
        ('seasons', 'Seasons'),
    ]

    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=255)
    location = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='landscapes')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='photos')
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.caption
