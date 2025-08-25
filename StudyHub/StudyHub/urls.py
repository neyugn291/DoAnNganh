"""
URL configuration for StudyHub project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from courses.admin import course_admin_site
from discussions.admin import discuss_admin_site
from notifications.admin import notification_admin_site
from quizzes.admin import quizz_admin_site
from resources.admin import resource_admin_site
from users.admin import user_admin_site

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="StudyHub API",
        default_version='v1',
        description="StudyHub API",
        contact=openapi.Contact(email="2251052074nguyen@ou.edu.vn"),
        license=openapi.License(name="Duong Hoang Nguyen"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),

    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    path('api/courses/', include('courses.urls')),

    path('api/discussions/', include('discussions.urls')),

    path('api/notifications/', include('notifications.urls')),

    path('api/quizzes/', include('quizzes.urls')),

    path('api/resources/', include('resources.urls')),

    path('course-admin/', course_admin_site.urls),

    path('user-admin/', user_admin_site.urls),

    path('discuss-admin/', discuss_admin_site.urls),

    path('resource-admin/', resource_admin_site.urls),

    path('quizz-admin/', quizz_admin_site.urls),

    path('notification-admin/', notification_admin_site.urls),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
    re_path(r'^redoc/$',
            schema_view.with_ui('redoc', cache_timeout=0),
            name='schema-redoc'),
]
