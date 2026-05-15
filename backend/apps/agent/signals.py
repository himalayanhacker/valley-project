from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.content.models import Article


@receiver(post_save, sender=Article)
def index_article_on_save(sender, instance, **kwargs):
    from django.conf import settings
    if not settings.OPENAI_API_KEY:
        return
    from .rag import index_article
    try:
        index_article(instance)
    except Exception:
        pass  # Don't block article save if embedding fails
