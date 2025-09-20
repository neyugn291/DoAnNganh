from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ForgotPasswordView

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.ProfileViewSet)
urlpatterns = [
    path('', include(router.urls)),
    path("open-app/", views.open_app, name="open_app"),
    path('stats/', views.UserDashboardAPI.as_view(), name='users-stats'),
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password')
]
