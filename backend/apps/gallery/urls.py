from django.urls import path
from .views import PhotoListCreateView, PhotoDeleteView

urlpatterns = [
    path('', PhotoListCreateView.as_view(), name='gallery-list'),
    path('<int:pk>/', PhotoDeleteView.as_view(), name='gallery-delete'),
]
