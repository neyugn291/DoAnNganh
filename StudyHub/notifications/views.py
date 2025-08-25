from rest_framework import viewsets, generics, permissions, decorators, response, status
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ViewSet, generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Notification.objects.none()

        # Chỉ cho phép user xem thông báo của chính mình
        return Notification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # user nhận thông báo = current user
        serializer.save(user=self.request.user)

    @decorators.action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        """Đánh dấu 1 thông báo là đã đọc"""
        notif = self.get_object()
        notif.mark_read()
        return response.Response({"status": "marked as read"}, status=status.HTTP_200_OK)

    @decorators.action(detail=False, methods=["post"])
    def mark_all_read(self, request):
        """Đánh dấu tất cả thông báo của user là đã đọc"""
        qs = self.get_queryset().filter(is_read=False)
        updated = qs.update(is_read=True)
        return response.Response({"updated": updated}, status=status.HTTP_200_OK)

