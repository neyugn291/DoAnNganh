from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Tag
from cloudinary.models import CloudinaryField   # import CloudinaryField

from users.models import BaseModel

User = get_user_model()


class Subject(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Resource(BaseModel):
    RESOURCE_TYPES = [
        ('PDF', 'PDF Document'),
        ('SLIDE', 'Presentation Slide'),
        ('CODE', 'Code Snippet'),
        ('OTHER', 'Other'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    code_snippet = models.TextField(blank=True, null=True)
    file = CloudinaryField(
        'file',
        resource_type="auto",   #cho phép nhiều loại file (ảnh, pdf, zip, mp4,...)
        blank=True,
        null=True
    )

    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPES, default="OTHER")

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="resources")
    tags = models.ManyToManyField(Tag, blank=True, related_name="resources")

    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]
        indexes = [
            models.Index(fields=["title"]),
        ]

    def __str__(self):
        return self.title
