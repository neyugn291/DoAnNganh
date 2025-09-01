from django.contrib.auth import get_user_model
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models


User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("INFO", "Thông báo"),
        ("ALERT", "Cảnh báo"),
        ("REMINDER", "Nhắc nhở"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    actor = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="actor_notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default="INFO"
    )

    url = models.CharField(max_length=512, blank=True, default="")

    target_ct = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    target_id = models.CharField(max_length=64, null=True, blank=True)
    target = GenericForeignKey("target_ct", "target_id")

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["notification_type", "created_at"]),
            models.Index(fields=["target_ct", "target_id"]),
        ]

    def mark_read(self, commit: bool = True) -> None:
        self.is_read = True
        if commit:
            self.save(update_fields=["is_read"])

    def __str__(self):
        return f"{self.title} -> {self.user.username}"

