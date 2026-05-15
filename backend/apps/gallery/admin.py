from django.contrib import admin
from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['caption', 'author', 'category', 'location', 'approved', 'created_at']
    list_filter = ['category', 'approved']
    list_editable = ['approved']
    search_fields = ['caption', 'location', 'author__username']
