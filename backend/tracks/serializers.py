from rest_framework import serializers
from .models import Tag, Band, Image, Album, Credentials, Track, Comment
from users.serializers import UserSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class BandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Band
        fields = '__all__'


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'


class AlbumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Album
        fields = '__all__'


class CredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credentials
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class TrackSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    album = AlbumSerializer()
    tags = TagSerializer(many=True)
    musicians = UserSerializer(many=True)
    bands = BandSerializer(many=True, source='band')
    images = ImageSerializer(many=True)
    comments = CommentSerializer(many=True)

    class Meta:
        model = Track
        fields = (
            'id', 'user', 'album', 'tags', 'musicians', 'bands', 'images', 'comments', 'title', 'description',
            'music_file',
            'liner_notes', 'release_date')

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
