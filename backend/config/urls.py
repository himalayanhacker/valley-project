from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/gallery/', include('apps.gallery.urls')),
    path('api/', include('apps.bookings.urls')),
    path('api/articles/', include('apps.content.urls')),
    path('api/agent/', include('apps.agent.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
