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
    path('audio/<uuid:track_id>/', views.serve_audio, name='serve_audio'),
    path('video/<uuid:clip_id>/', views.serve_video, name='serve_video'),

    path('', include(router.urls)),
    path('track/<str:pk>/', views.TrackDetailView.as_view(), name='track-detail'),
    path('album/<str:pk>/', views.AlbumDetailView.as_view(), name='album-detail'),

    path('comments/user/<uuid:user_id>/', views.UserCommentListAPIView.as_view(), name='user-comments-list'),
    path('comments/track/<uuid:track_id>/', views.TrackCommentListAPIView.as_view(), name='track-comments-list'),
    path('comments/album/<uuid:album_id>/', views.AlbumCommentListAPIView.as_view(), name='album-comments-list'),

    path('comments/track/<uuid:track_id>/add/', views.CommentTrackCreateAPIView.as_view(), name='track-comments'),
    path('comments/album/<uuid:album_id>/add/', views.CommentAlbumCreateAPIView.as_view(), name='album-comments'),

]
