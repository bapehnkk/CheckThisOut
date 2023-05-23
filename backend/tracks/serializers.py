from rest_framework import serializers
from .models import Tag, Band, Image, Album, Credentials, Track, Comment, Clip
from users.serializers import UserSerializer
from django.utils import timezone


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class BandSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True)

    class Meta:
        model = Band
        fields = ('id', 'title', 'description', 'musicians', 'images')


class SimpleTrackSerializer(serializers.ModelSerializer):
    bands = BandSerializer(many=True, source='band')
    images = ImageSerializer(many=True)

    class Meta:
        model = Track
        fields = ('id', 'title', "bands", "images")


class AlbumSerializer(serializers.ModelSerializer):
    tracks = SimpleTrackSerializer(many=True, read_only=True, source='album_tracks')
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = ('id', 'album_type', 'title', 'tracks', 'tags')

    def get_tags(self, obj):
        tags = set()
        for track in obj.album_tracks.all():
            track_tags = track.tags.values_list('title', flat=True)
            tags.update(track_tags)
        return list(tags)


class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credentials
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'user', 'track', 'album', 'parent_comment', 'text', 'pub_date', 'update_date']
        read_only_fields = ['user', 'pub_date', 'update_date']

    def create(self, validated_data):
        validated_data['pub_date'] = timezone.now()
        validated_data['update_date'] = timezone.now()
        return super().create(validated_data)


class ClipSerializer(serializers.ModelSerializer):
    clip_file = serializers.SerializerMethodField()

    class Meta:
        model = Clip
        fields = ('clip_url', 'clip_file',)

    def get_clip_file(self, obj):
        if obj.clip_file:
            return f"http://localhost:8000/api/video/{obj.id}/"
        return None


class TrackSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    album = AlbumSerializer()
    tags = serializers.SerializerMethodField()
    musicians = UserSerializer(many=True)
    bands = BandSerializer(many=True, source='band')
    images = ImageSerializer(many=True)
    comments = CommentSerializer(many=True)
    clips = ClipSerializer(many=True, read_only=True)

    class Meta:
        model = Track
        fields = (
            'id', 'user', 'album', 'tags', 'musicians', 'bands', 'images', 'comments', 'title', 'description', 'lyrics',
            'clips', 'music_file', 'liner_notes', 'release_date')

    counter = 0

    def get_music_file_url(self, obj):
        return f"http://localhost:8000/api/audio/{obj.id}/"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['uuid'] = data.pop('id')

        if 'counter' not in self.context:
            self.context['counter'] = 0

        data['id'] = self.context['counter']
        self.context['counter'] += 1
        data['music_file'] = self.get_music_file_url(instance)
        return data

    def get_tags(self, obj):
        return [tag.title for tag in obj.tags.all()]
