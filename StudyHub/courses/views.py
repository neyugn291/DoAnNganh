
from rest_framework import viewsets, generics, permissions
from courses import serializers, models


# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagViewSet(viewsets.ModelViewSet):
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