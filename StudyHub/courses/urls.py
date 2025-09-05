from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'tags', views.TagViewSet, basename='tags')
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'modules', views.ModuleViewSet, basename='modules')
router.register(r'lessons', views.LessonViewSet, basename='lessons')
router.register(r'enrollments', views.EnrollmentViewSet, basename='enrollments')
urlpatterns = [
    path('', include(router.urls) ),
    path('stats/', views.CourseStatsAPIView.as_view(), name='course-stats'),
]
