# Generated by Django 4.2 on 2023-05-04 11:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import tracks.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('album_type', models.CharField(choices=[('single', 'Single'), ('album', 'Album')], max_length=10)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('critical_receptions', models.TextField()),
                ('record_label', models.CharField(max_length=255)),
                ('liner_notes', models.TextField()),
                ('release_date', models.DateTimeField()),
                ('update_date', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Band',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('text', models.TextField()),
                ('pub_date', models.DateTimeField()),
                ('update_date', models.DateTimeField()),
                ('album', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments_album', to='tracks.album')),
                ('parent_comment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tracks.comment')),
            ],
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('image_file', models.ImageField(upload_to=tracks.models.image_directory_path)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Track',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('music_file', models.FileField(upload_to=tracks.models.music_directory_path)),
                ('liner_notes', models.TextField()),
                ('release_date', models.DateTimeField()),
                ('update_date', models.DateTimeField()),
                ('album', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='album_tracks', to='tracks.album')),
                ('band', models.ManyToManyField(blank=True, to='tracks.band')),
                ('comments', models.ManyToManyField(blank=True, related_name='tracks', to='tracks.comment')),
                ('images', models.ManyToManyField(blank=True, to='tracks.image')),
                ('musicians', models.ManyToManyField(blank=True, related_name='musician_tracks', to=settings.AUTH_USER_MODEL)),
                ('tags', models.ManyToManyField(to='tracks.tag')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Credentials',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('composers', models.ManyToManyField(blank=True, related_name='composed_credentials', to=settings.AUTH_USER_MODEL)),
                ('lyrics', models.ManyToManyField(blank=True, related_name='lyrics_credentials', to=settings.AUTH_USER_MODEL)),
                ('producers', models.ManyToManyField(blank=True, related_name='produced_credentials', to=settings.AUTH_USER_MODEL)),
                ('writers', models.ManyToManyField(blank=True, related_name='written_credentials', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='track',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments_track', to='tracks.track'),
        ),
        migrations.AddField(
            model_name='comment',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='band',
            name='images',
            field=models.ManyToManyField(blank=True, to='tracks.image'),
        ),
        migrations.AddField(
            model_name='band',
            name='musicians',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='album',
            name='comments',
            field=models.ManyToManyField(blank=True, related_name='albums', to='tracks.comment'),
        ),
        migrations.AddField(
            model_name='album',
            name='credentials',
            field=models.ManyToManyField(blank=True, to='tracks.credentials'),
        ),
        migrations.AddField(
            model_name='album',
            name='tracks',
            field=models.ManyToManyField(blank=True, related_name='included_in_albums', to='tracks.track'),
        ),
    ]