from django.contrib import admin
from django.contrib.auth.models import Group
from .models import User

GROUPS = [
    'User',
    'Musician',
    'Painter',
    'Admin',
    'Music Producer',
    'Music Writer',
    'Music Composer',
    'Music Lyricist',
]

for group_name in GROUPS:
    group, created = Group.objects.get_or_create(name=group_name)
    if created:
        print(f'Created group: {group_name}')

admin.site.register(User)
