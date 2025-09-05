from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView

from . import dao
from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer

from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], url_path='current', permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()  # sao chép dữ liệu
        avatar = data.pop("avatar", None)

        # Bỏ các trường ManyToMany để tránh lỗi
        data.pop("groups", None)
        data.pop("user_permissions", None)

        password = data.pop("password", "")
        if isinstance(password, list):
            password = password[0]
        user = User(**data)
        user.set_password(password)
        user.save()

        if avatar:
            user.profile.avatar = avatar
            user.profile.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserDashboardAPI(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        stats = dao.user_dashboard_stats(request.user)
        return Response(stats)