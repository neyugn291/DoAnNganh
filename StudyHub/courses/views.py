
from rest_framework import viewsets, generics, permissions
from courses import serializers, models, dao
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagViewSet(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = models.Tag.objects.all()
    serializer_class = serializers.TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # Khi tạo mới course → tự động gán instructor = user đang đăng nhập
    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user)


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = models.Module.objects.all()
    serializer_class = serializers.ModuleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LessonViewSet(viewsets.ModelViewSet):
    queryset = models.Lesson.objects.all()
    serializer_class = serializers.LessonSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = models.Enrollment.objects.select_related("user", "course").all()
    serializer_class = serializers.EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class CourseStatsAPIView(APIView):
    """
    API trả về tất cả dữ liệu thống kê cho frontend.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        data = {
            "by_category": list(dao.count_courses_by_category()),
            "by_tag": list(dao.count_courses_by_tag()),
            "free_vs_paid": dao.count_free_vs_paid_courses(),
            "top_courses": list(dao.top_courses_by_students()),
            "by_month": dao.count_courses_by_month(),
            "revenue_per_course": dao.revenue_per_course(),
            "enrollment_by_month": dao.enrollment_by_month(),
        }
        return Response(data)