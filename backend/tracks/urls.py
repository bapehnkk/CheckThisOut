from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tags', views.TagViewSet)
router.register(r'bands', views.BandViewSet)
router.register(r'images', views.ImageViewSet)
router.register(r'albums', views.AlbumViewSet)
router.register(r'credentials', views.CredentialsViewSet)
router.register(r'tracks', views.TrackViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('track/<str:pk>/', views.TrackDetailView.as_view(), name='track-detail'),
    path('', include(router.urls)),
    path('audio/<uuid:track_id>/', views.serve_audio, name='serve_audio'),
]
