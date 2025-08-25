from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404

from quizzes import models, serializers


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API cho Quiz (chỉ GET danh sách / chi tiết)
    """
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer
    permission_classes = [permissions.AllowAny]


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    API cho Submission (nộp bài, xem kết quả)
    """
    queryset = models.Submission.objects.all()
    serializer_class = serializers.SubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]


    def perform_create(self, serializer):
        # Tự động gắn user hiện tại
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def result(self, request, pk=None):
        """
        API riêng để xem kết quả của 1 submission
        """
        submission = get_object_or_404(models.Submission, pk=pk, user=request.user)
        return Response({
            "quiz": submission.quiz.title,
            "score": submission.score,
            "submitted_at": submission.submitted_at,
        })

