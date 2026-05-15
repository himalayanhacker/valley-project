from rest_framework import generics, permissions
from django.db.models import Q, F
from .models import Article
from .serializers import ArticleListSerializer, ArticleDetailSerializer


class ArticleListView(generics.ListAPIView):
    serializer_class = ArticleListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Article.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        if category and category != 'all':
            qs = qs.filter(category=category)
        if search:
            qs = qs.filter(Q(title__icontains=search) | Q(excerpt__icontains=search))
        return qs


class ArticleDetailView(generics.RetrieveAPIView):
    queryset = Article.objects.all()
    serializer_class = ArticleDetailSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]

    def retrieve(self, request, *args, **kwargs):
        Article.objects.filter(slug=kwargs['slug']).update(views=F('views') + 1)
        return super().retrieve(request, *args, **kwargs)


class ArticleCreateView(generics.CreateAPIView):
    serializer_class = ArticleDetailSerializer
    permission_classes = [permissions.IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
