from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from django.conf import settings
from rest_framework.views import APIView
from django.core.mail import send_mail
import jwt, datetime
import threading
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

import logging
logger = logging.getLogger(__name__)

import sendgrid
from sendgrid.helpers.mail import Mail

def send_reset_email(email, reset_link):
    """Gửi email reset password bằng SendGrid API an toàn"""
    try:
        sg = sendgrid.SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        message = Mail(
            from_email=settings.DEFAULT_FROM_EMAIL,
            to_emails=email,
            subject="Đặt lại mật khẩu",
            html_content=f"<p>Click vào link để đặt lại mật khẩu: <a href='{reset_link}'>{reset_link}</a></p>"
        )
        response = sg.send(message)
        if response.status_code != 202:
            logger.warning(f"SendGrid trả về {response.status_code} cho {email}")
    except Exception as e:
        logger.error(f"Lỗi gửi email SendGrid: {e}")

class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email không được để trống"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"detail": "Email không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

        # Tạo token JWT đặt lại mật khẩu
        payload = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }
        token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
        reset_link = f"studyhub://reset-password?token={token}"

        # Gửi email bất đồng bộ
        threading.Thread(target=send_reset_email, args=(email, reset_link), daemon=True).start()

        return Response({"detail": "Email đã được gửi"}, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    def post(self, request):
        token = request.data.get("token")
        new_password = request.data.get("new_password")

        if not token or not new_password:
            return Response({"detail": "Token và mật khẩu mới là bắt buộc"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            user = User.objects.get(id=user_id)
        except jwt.ExpiredSignatureError:
            return Response({"detail": "Token đã hết hạn"}, status=status.HTTP_400_BAD_REQUEST)
        except (jwt.InvalidTokenError, User.DoesNotExist):
            return Response({"detail": "Token không hợp lệ"}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({"detail": "Đổi mật khẩu thành công"}, status=status.HTTP_200_OK)
