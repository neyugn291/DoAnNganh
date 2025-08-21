from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename='categories')
router.register(r'tags', views.TagViewSet, basename='tags')
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'modules', views.ModuleViewSet, basename='modules')
router.register(r'lessons', views.LessonViewSet, basename='lessons')

urlpatterns = [
    path('', include(router.urls) ),
]
