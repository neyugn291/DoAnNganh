from rest_framework import serializers
from .models import Notification
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer, UserSummarySerializer

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    actor = UserSummarySerializer(read_only=True)
    target_ct = serializers.StringRelatedField()  # hiển thị tên model thay vì id

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "actor",
            "title",
            "message",
            "notification_type",
            "url",
            "target_ct",
            "target_id",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["id", "created_at", "is_read"]
