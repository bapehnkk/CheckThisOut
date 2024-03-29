# Generated by Django 4.2 on 2023-05-21 12:06

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import tracks.models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tracks', '0005_image_image_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Clip',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('clip_url', models.CharField(blank=True, max_length=200, null=True, validators=[django.core.validators.URLValidator()])),
                ('clip_file', models.FileField(blank=True, null=True, upload_to=tracks.models.clip_directory_path)),
                ('track', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clips', to='tracks.track')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='clips', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
