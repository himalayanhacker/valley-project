from rest_framework import serializers
from .models import Article


class ArticleListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'title', 'slug', 'excerpt', 'category', 'author_name',
                  'featured_image', 'read_time', 'views', 'published_at']


class ArticleDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Article
        fields = '__all__'
