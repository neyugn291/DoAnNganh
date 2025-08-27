from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from .models import User, Profile
from .serializers import UserSerializer, ProfileSerializer

from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # hoặc [AllowAny] nếu không yêu cầu login

    @action(detail=False, methods=['get'], url_path='current', permission_classes=[permissions.IsAuthenticated])
    def current_user(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        try:
            profile = user.profile  # giả sử OneToOneField từ Profile -> User
            profile_data = ProfileSerializer(profile).data
        except Profile.DoesNotExist:
            profile_data = {}  # hoặc None

        data = {**user_data, "profile": profile_data}
        return Response(data, status=status.HTTP_200_OK)
# class ProfileViewSet(viewsets.ModelViewSet):
#     queryset = Profile.objects.all()
#     serializer_class = ProfileSerializer
#     permission_classes = [permissions.IsAuthenticated]
#
#     def get_queryset(self):
#         # Chỉ trả về profile của user đang login
#         return Profile.objects.filter(user=self.request.user)
#
#     def perform_create(self, serializer):
#         # Khi tạo profile, tự gán user là request.user
#         if Profile.objects.filter(user=self.request.user).exists():
#             raise PermissionDenied("Bạn chỉ có thể có một profile.")
#         serializer.save(user=self.request.user)
#
#     def perform_update(self, serializer):
#         # Chỉ cho phép user cập nhật profile của chính họ
#         if serializer.instance.user != self.request.user:
#             raise PermissionDenied("Bạn không thể chỉnh sửa profile này.")
#         serializer.save()


class CurrentUserProfileView(APIView):
    permission_classes = [IsAuthenticated]  # yêu cầu login

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {"detail": "Profile chưa được tạo."},
                status=status.HTTP_404_NOT_FOUND
            )

