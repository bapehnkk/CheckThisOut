from rest_framework import viewsets, generics
from .models import Tag, Band, Image, Album, Credentials, Track, Comment, Clip
from .serializers import TagSerializer, BandSerializer, ImageSerializer, AlbumSerializer, CredentialsSerializer, \
    TrackSerializer, CommentSerializer
from django.http import FileResponse, Http404
from django.conf import settings
from .models import Track
import os

from sendfile import sendfile

from rest_framework import status
from rest_framework.generics import CreateAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from users.permissions import IsUser
from django.db.models import Q
from rest_framework.generics import ListAPIView
from django.utils import timezone
from uuid import UUID


def serve_audio(request, track_id):
    try:
        track = Track.objects.get(id=track_id)
    except Track.DoesNotExist:
        raise Http404("Track not found")

    file_path = track.music_file.path

    response = sendfile(request, file_path)
    response['Content-Type'] = 'audio/mpeg'  # или другой подходящий MIME-тип в зависимости от формата аудиофайла
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
    response['Accept-Ranges'] = 'bytes'
    return response


def serve_video(request, clip_id):
    try:
        clip = Clip.objects.get(id=clip_id)
    except Clip.DoesNotExist:
        raise Http404("Clip not found")

    file_path = clip.clip_file.path

    response = sendfile(request, file_path)
    response['Content-Type'] = 'video/mp4'  # или другой подходящий MIME-тип в зависимости от формата видеофайла
    response['Content-Length'] = os.path.getsize(file_path)
    response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
    response['Accept-Ranges'] = 'bytes'
    return response


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class BandViewSet(viewsets.ModelViewSet):
    queryset = Band.objects.all()
    serializer_class = BandSerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class CredentialsViewSet(viewsets.ModelViewSet):
    queryset = Credentials.objects.all()
    serializer_class = CredentialsSerializer


class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class TrackDetailView(generics.RetrieveAPIView):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer


class AlbumDetailView(generics.RetrieveAPIView):
    queryset = Album.objects.all()
    serializer_class = AlbumSerializer


class CommentAlbumCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsUser]

    def perform_create(self, serializer):
        album_id = self.kwargs.get('album_id')
        album = get_object_or_404(Album, id=album_id)
        serializer.save(user=self.request.user, album=album)


class CommentTrackCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, IsUser]

    def perform_create(self, serializer):
        track_id = self.kwargs.get('track_id')
        track = get_object_or_404(Track, id=track_id)
        serializer.save(user=self.request.user, track=track)


class UserCommentListAPIView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Comment.objects.filter(user__id=user_id)


class TrackCommentListAPIView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        track_id = self.kwargs['track_id']
        return Comment.objects.filter(track__id=track_id)


class AlbumCommentListAPIView(ListAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        album_id = self.kwargs['album_id']
        return Comment.objects.filter(album__id=album_id)
