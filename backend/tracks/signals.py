from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from django.core.files.storage import default_storage

from .models import Image, Track

import os, re


def delete_empty_directory(directory_path):
    if os.path.exists(directory_path) and os.path.isdir(directory_path) and not os.listdir(directory_path):
        os.rmdir(directory_path)


def delete_empty_user_directory(user_directory_path):
    uuid_pattern = re.compile(r'^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$', re.IGNORECASE)
    folder_name = os.path.basename(user_directory_path)

    if uuid_pattern.match(folder_name) and os.path.exists(user_directory_path) and os.path.isdir(user_directory_path):
        if all([not os.listdir(os.path.join(user_directory_path, subdir)) for subdir in
                os.listdir(user_directory_path)]):
            os.rmdir(user_directory_path)


@receiver(post_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    if instance.image_file:
        file_path = instance.image_file.path
        default_storage.delete(file_path)
        directory_path = os.path.dirname(file_path)
        delete_empty_directory(directory_path)
        delete_empty_user_directory(os.path.dirname(directory_path))


@receiver(post_delete, sender=Track)
def delete_music_file(sender, instance, **kwargs):
    if instance.music_file:
        file_path = instance.music_file.path
        default_storage.delete(file_path)
        directory_path = os.path.dirname(file_path)
        delete_empty_directory(directory_path)
        delete_empty_user_directory(os.path.dirname(directory_path))


@receiver(pre_save, sender=Image)
def update_image_file(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).image_file
    except sender.DoesNotExist:
        return False

    new_file = instance.image_file
    if old_file and not old_file == new_file:
        file_path = old_file.path
        default_storage.delete(file_path)
        directory_path = os.path.dirname(file_path)
        delete_empty_directory(directory_path)
        delete_empty_user_directory(os.path.dirname(directory_path))


@receiver(pre_save, sender=Track)
def update_music_file(sender, instance, **kwargs):
    if not instance.pk:
        return False

    try:
        old_file = sender.objects.get(pk=instance.pk).music_file
    except sender.DoesNotExist:
        return False

    new_file = instance.music_file
    if old_file and not old_file == new_file:
        file_path = old_file.path
        default_storage.delete(file_path)
        directory_path = os.path.dirname(file_path)
        delete_empty_directory(directory_path)
        delete_empty_user_directory(os.path.dirname(directory_path))
