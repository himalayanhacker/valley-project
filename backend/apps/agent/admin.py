from django.contrib import admin
from .models import ArticleChunk


@admin.register(ArticleChunk)
class ArticleChunkAdmin(admin.ModelAdmin):
    list_display = ['article', 'chunk_index', 'chunk_preview']
    list_filter = ['article']
    readonly_fields = ['embedding']

    def chunk_preview(self, obj):
        return obj.chunk_text[:80] + '...' if len(obj.chunk_text) > 80 else obj.chunk_text
    chunk_preview.short_description = 'Preview'
