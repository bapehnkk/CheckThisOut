from django.contrib import admin
from .models import Tag, Band, Image, Album, Credentials, Track, Comment, Clip, TrackLike

admin.site.register(Tag)
admin.site.register(Band)
admin.site.register(Image)
admin.site.register(Album)
admin.site.register(Credentials)
admin.site.register(Track)
admin.site.register(Comment)
admin.site.register(Clip)
admin.site.register(TrackLike)
