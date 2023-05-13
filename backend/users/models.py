from django.contrib.auth.models import AbstractUser, Group, PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
from django.db import models
import re
import uuid


def media_directory_path(instance, filename, media_type):
    # Получение расширения файла
    file_extension = filename.split('.')[-1]

    # Формирование пути для сохранения файла
    path = f"{instance.user.id}/{media_type}/{instance.id}.{file_extension}"
    return path


def validate_password(password):
    if len(password) < 8:
        raise ValidationError('The password must be at least 8 characters long.')

    if not re.search(r'[a-z]', password):
        raise ValidationError('The password must contain at least one lowercase letter.')

    if not re.search(r'[A-Z]', password):
        raise ValidationError('The password must contain at least one uppercase letter.')

    if not re.search(r'\d', password):
        raise ValidationError('The password must contain at least one number.')

    if not re.search(r'[!@#$%^&*()_\-+=~`{[}\]|\\:;"\'<>,.?\/]', password):
        raise ValidationError('The password must contain at least one special character.')


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        validate_password(password)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


phone_regex = RegexValidator(
    regex=r'^\+?1?\d{9,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)


def validate_full_name(value):
    words = value.split()
    if len(words) < 2:
        raise ValidationError("Full name must contain at least two words.")

    for word in words:
        if not word.istitle():
            raise ValidationError("Each word in the full name must start with a capital letter.")


class User(AbstractUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    full_name = models.CharField(max_length=150, validators=[validate_full_name])
    phone = models.CharField(validators=[phone_regex], max_length=20, blank=True)
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    language = models.CharField(max_length=20, blank=True, choices=[
        ('en', 'English'),
        ('ru', 'Russian'),
        ('et', 'Estonian')
    ])

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
