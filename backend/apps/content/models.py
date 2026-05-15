from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Article(models.Model):
    CATEGORY_CHOICES = [
        ('guides', 'Travel Guides'),
        ('culture', 'Local Culture'),
        ('trekking', 'Trekking'),
        ('wildlife', 'Wildlife'),
        ('history', 'History'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    excerpt = models.TextField()
    body = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='guides')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='articles')
    featured_image = models.ImageField(upload_to='articles/', null=True, blank=True)
    read_time = models.IntegerField(default=5, help_text='Minutes')
    views = models.IntegerField(default=0)
    published_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
