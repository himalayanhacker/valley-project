from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied
from .models import Photo
from .serializers import PhotoSerializer


class PhotoListCreateView(generics.ListCreateAPIView):
    serializer_class = PhotoSerializer

    def get_queryset(self):
        qs = Photo.objects.filter(approved=True)
        category = self.request.query_params.get('category')
        if category and category != 'all':
            qs = qs.filter(category=category)
        return qs

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PhotoDeleteView(generics.DestroyAPIView):
    queryset = Photo.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.author != self.request.user and not self.request.user.is_staff:
            raise PermissionDenied("You can only delete your own photos.")
        instance.delete()
