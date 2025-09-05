from rest_framework import viewsets, permissions
from discussions import models, serializers, dao

from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets
from rest_framework.response import Response

import random
from django.db.models import Sum


class ContentTypeViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request):
        content_types = ContentType.objects.all().values("id", "app_label", "model")
        return Response(content_types)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.QuestionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        qs_all = models.Question.objects.all()

        if not qs_all.exists():
            return qs_all.none()

        try:
            count = int(self.request.query_params.get('count', 5))
        except ValueError:
            count = 5

        # Lấy tất cả ID
        all_ids = list(qs_all.values_list('id', flat=True))

        # Lấy random ID
        random_ids = random.sample(all_ids, min(count, len(all_ids)))

        return qs_all.filter(id__in=random_ids)



class AnswerViewSet(viewsets.ModelViewSet):
    queryset = models.Answer.objects.all().order_by("-created_at")
    serializer_class = serializers.AnswerSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = models.Comment.objects.all().order_by("-created_at")
    serializer_class = serializers.CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)



class VoteViewSet(viewsets.ModelViewSet):
    queryset = models.Vote.objects.all()
    serializer_class = serializers.VoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Khởi tạo serializer và lưu vote
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vote = serializer.save(user=request.user)

        score = dao.update_score(vote)

        return Response({**serializer.data, "score": score}, status=201)


