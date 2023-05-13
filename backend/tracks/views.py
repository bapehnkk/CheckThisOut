from rest_framework import viewsets, generics
from .models import Tag, Band, Image, Album, Credentials, Track, Comment
from .serializers import TagSerializer, BandSerializer, ImageSerializer, AlbumSerializer, CredentialsSerializer, \
    TrackSerializer, CommentSerializer
from django.http import FileResponse, Http404
from django.conf import settings
from .models import Track
import os

from sendfile import sendfile


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
