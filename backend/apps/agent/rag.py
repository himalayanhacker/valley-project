import logging
from django.conf import settings
import numpy as np
import openai

logger = logging.getLogger(__name__)

CHUNK_SIZE = 500
EMBEDDING_MODEL = 'text-embedding-3-small'
CHAT_MODEL = 'gpt-4o-mini'


def get_openai_client():
    return openai.OpenAI(api_key=settings.OPENAI_API_KEY)


def chunk_text(text: str, size: int = CHUNK_SIZE) -> list[str]:
    words = text.split()
    chunks = []
    current = []
    count = 0
    for word in words:
        current.append(word)
        count += len(word) + 1
        if count >= size:
            chunks.append(' '.join(current))
            current = []
            count = 0
    if current:
        chunks.append(' '.join(current))
    return chunks


def embed_text(text: str) -> list[float]:
    client = get_openai_client()
    response = client.embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding


def cosine_similarity(a: list[float], b: list[float]) -> float:
    va = np.array(a)
    vb = np.array(b)
    norm = np.linalg.norm(va) * np.linalg.norm(vb)
    if norm == 0:
        return 0.0
    return float(np.dot(va, vb) / norm)


def index_article(article) -> None:
    from .models import ArticleChunk
    ArticleChunk.objects.filter(article=article).delete()
    chunks = chunk_text(article.body)
    for i, chunk in enumerate(chunks):
        try:
            embedding = embed_text(chunk)
            ArticleChunk.objects.create(
                article=article,
                chunk_text=chunk,
                embedding=embedding,
                chunk_index=i,
            )
        except Exception as e:
            logger.error(f"Failed to embed chunk {i} for article {article.id}: {e}")


def answer_question(question: str, top_k: int = 3) -> dict:
    from .models import ArticleChunk
    chunks = ArticleChunk.objects.select_related('article').all()
    if not chunks.exists():
        return {'answer': 'No articles have been indexed yet. Please add some articles first.', 'sources': []}

    question_embedding = embed_text(question)
    scored = sorted(
        chunks,
        key=lambda c: cosine_similarity(question_embedding, c.embedding),
        reverse=True,
    )[:top_k]

    context = '\n\n'.join(c.chunk_text for c in scored)
    sources = []
    seen = set()
    for c in scored:
        if c.article_id not in seen:
            seen.add(c.article_id)
            sources.append({'title': c.article.title, 'slug': c.article.slug})

    system_prompt = (
        "You are a knowledgeable travel guide for Uttarshall Valley in Mandi district, "
        "Himachal Pradesh, India. Answer the user's question using only the context provided below. "
        "If the context does not contain enough information, say so honestly. "
        "Keep your answer concise and helpful."
    )
    user_message = f"Context:\n{context}\n\nQuestion: {question}"

    client = get_openai_client()
    response = client.chat.completions.create(
        model=CHAT_MODEL,
        messages=[
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_message},
        ],
        max_tokens=600,
        temperature=0.3,
    )
    answer = response.choices[0].message.content.strip()
    return {'answer': answer, 'sources': sources}
