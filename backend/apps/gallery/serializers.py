from rest_framework import serializers
from .models import Photo


class PhotoSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Photo
        fields = ['id', 'image', 'caption', 'location', 'category', 'author', 'author_name', 'approved', 'created_at']
        read_only_fields = ['id', 'author', 'approved', 'created_at']
