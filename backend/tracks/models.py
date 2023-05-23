from django.db import models
from users.models import User, media_directory_path
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import uuid


def image_directory_path(instance, filename):
    return media_directory_path(instance, filename, 'images')


def music_directory_path(instance, filename):
    return media_directory_path(instance, filename, 'music')


def clip_directory_path(instance, filename):
    return media_directory_path(instance, filename, 'clips')


class Tag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Band(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    musicians = models.ManyToManyField(User)
    title = models.CharField(max_length=255)
    description = models.TextField()
    images = models.ManyToManyField('Image', blank=True)

    def __str__(self):
        return self.title


class Image(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='images')
    title = models.CharField(max_length=255)
    image_file = models.ImageField(upload_to=image_directory_path)
    IMAGE_TYPE_CHOICES = (
        ('art', 'Art'),
        ('logo', 'Logo'),
    )
    image_type = models.CharField(max_length=10, choices=IMAGE_TYPE_CHOICES, default="art")

    def __str__(self):
        return self.title


class Album(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ALBUM_TYPE_CHOICES = (
        ('single', 'Single'),
        ('album', 'Album'),
    )
    tracks = models.ManyToManyField('Track', related_name='included_in_albums', blank=True)
    album_type = models.CharField(max_length=10, choices=ALBUM_TYPE_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    credentials = models.ManyToManyField('Credentials', blank=True)
    critical_receptions = models.TextField(null=True, blank=True)
    record_label = models.CharField(max_length=255, null=True, blank=True)
    liner_notes = models.TextField(null=True, blank=True)
    comments = models.ManyToManyField('Comment', related_name='albums', blank=True)
    release_date = models.DateTimeField()
    update_date = models.DateTimeField()
    images = models.ManyToManyField(Image, blank=True)

    def __str__(self):
        return self.title


class Credentials(models.Model):
    producers = models.ManyToManyField(User, related_name='produced_credentials', blank=True)
    writers = models.ManyToManyField(User, related_name='written_credentials', blank=True)
    composers = models.ManyToManyField(User, related_name='composed_credentials', blank=True)
    lyrics = models.ManyToManyField(User, related_name='lyrics_credentials', blank=True)


class Track(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    lyrics = models.TextField(null=True, blank=True)
    tags = models.ManyToManyField(Tag)
    musicians = models.ManyToManyField(User, related_name='musician_tracks', blank=True)
    band = models.ManyToManyField(Band, blank=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='album_tracks', null=True, blank=True)
    music_file = models.FileField(upload_to=music_directory_path)
    images = models.ManyToManyField(Image, blank=True)
    liner_notes = models.TextField(null=True, blank=True)
    comments = models.ManyToManyField('Comment', related_name='tracks', blank=True)
    release_date = models.DateTimeField()
    update_date = models.DateTimeField()

    def __str__(self):
        return self.title


class TrackLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    track = models.ForeignKey(Track, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'track')

    def __str__(self):
        return f'{self.user.username} likes {self.track.title}'


class Clip(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clips')
    track = models.ForeignKey(Track, related_name='clips', on_delete=models.CASCADE)
    clip_url = models.CharField(validators=[URLValidator()], max_length=200, blank=True, null=True)
    clip_file = models.FileField(upload_to=clip_directory_path, blank=True, null=True)

    def clean(self):
        if not self.clip_url and not self.clip_file:
            raise ValidationError("You must provide either a YouTube URL or a clip file.")
        if self.clip_url and self.clip_file:
            raise ValidationError("You can only provide a YouTube URL or a clip file, not both.")

    def __str__(self):
        return str(self.id)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='comments_track', null=True, blank=True)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='comments_album', null=True, blank=True)
    parent_comment = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)  # Изменил имя поля
    text = models.JSONField()
    pub_date = models.DateTimeField()
    update_date = models.DateTimeField()

    def __str__(self):
        return self.text
