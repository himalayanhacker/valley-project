from django.db import models
from apps.content.models import Article


class ArticleChunk(models.Model):
    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name='chunks')
    chunk_text = models.TextField()
    embedding = models.JSONField(default=list)
    chunk_index = models.IntegerField(default=0)

    class Meta:
        ordering = ['article', 'chunk_index']

    def __str__(self):
        return f"{self.article.title} — chunk {self.chunk_index}"
