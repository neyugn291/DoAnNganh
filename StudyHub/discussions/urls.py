from django.urls import path, include
from rest_framework.routers import DefaultRouter
from discussions import views

router = DefaultRouter()
router.register(r'questions', views.QuestionViewSet, basename='questions')
router.register(r'answers', views.AnswerViewSet, basename='answers')
router.register(r'comments', views.CommentViewSet, basename='comments')
router.register(r'votes', views.VoteViewSet, basename='votes')
router.register(r'content_types', views.ContentTypeViewSet, basename='content_types')

urlpatterns = [
    path("", include(router.urls)),
]
