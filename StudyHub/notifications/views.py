from rest_framework import viewsets, generics, permissions, decorators, response, status
from .models import Notification
from .serializers import NotificationSerializer
from StudyHub.firebase_admin import send_push_notification

class NotificationViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Notification.objects.none()

        # Chỉ cho phép user xem thông báo của chính mình
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Lưu thông báo vào DB
        notif = serializer.save(user=self.request.user)

        # Gửi FCM notification nếu user có token
        if notif.user.fcm_token and notif.user.notifications_enabled:
            try:
                send_push_notification(
                    token=notif.user.fcm_token,
                    title=notif.title,
                    body=notif.message or ""
                )
                print("Sending FCM to token:", notif.user.fcm_token)
            except Exception as e:
                print("FCM send failed:", e)

    @decorators.action(detail=True, methods=["get"])
    def get_detail(self, request, pk=None):
        notif = self.get_object()
        serializer = self.get_serializer(notif)
        return response.Response(serializer.data, status=status.HTTP_200_OK)

    @decorators.action(detail=True, methods=["patch"])
    def mark_read(self, request, pk=None):
        """Đánh dấu 1 thông báo là đã đọc"""
        notif = self.get_object()
        notif.mark_read()
        return response.Response({"status": "marked as read"}, status=status.HTTP_200_OK)

    @decorators.action(detail=False, methods=["patch"])
    def mark_all_read(self, request):
        """Đánh dấu tất cả thông báo của user là đã đọc"""
        qs = self.get_queryset().filter(is_read=False)
        updated = qs.update(is_read=True)
        return response.Response({"updated": updated}, status=status.HTTP_200_OK)

