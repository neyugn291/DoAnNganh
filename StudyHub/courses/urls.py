from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='categories')

urlpatterns = [
    path('', include(router.urls) ),
]
