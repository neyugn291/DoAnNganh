from time import timezone

from cloudinary.models import CloudinaryField
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class User(AbstractUser):
    citizen_id = models.CharField(max_length=12, verbose_name='CCCD', unique=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    GENDER_CHOICES = [
        ('M', 'Nam'),
        ('F', 'Nữ'),
        ('O', 'Khác'),
    ]
    gender = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        null=True,
        blank=True,
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=11, unique=True)
    is_verified = models.BooleanField(default=False)
    modified_date = models.DateTimeField(auto_now=True)

    notifications_enabled = models.BooleanField(
        default=True,
        help_text="Người dùng có bật nhận thông báo không?"
    )

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'phone_number', 'citizen_id']

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        if is_new:
            Profile.objects.create(user=self)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = CloudinaryField(null=True)
    bio = models.TextField(blank=True, null=True, help_text="Mô tả ngắn")
    contact_info = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Hồ sơ của {self.user.username}"