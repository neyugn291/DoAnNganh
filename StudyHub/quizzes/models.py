from django.db import models
from django.contrib.auth import get_user_model

from users.models import BaseModel

User = get_user_model()


class Quiz(BaseModel):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    duration = models.PositiveIntegerField(help_text="Thời gian làm bài (phút)")
    is_practice = models.BooleanField(default=False, help_text="True nếu là chế độ ôn tập / thi thử")


    def __str__(self):
        return self.title


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    points = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quiz.title} - {self.text[:50]}"


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="choices")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.text} ({'Đúng' if self.is_correct else 'Sai'})"


class Submission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="submissions")
    score = models.FloatField(default=0)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} ({self.score})"


class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.submission.user.username} - {self.question.text[:30]} => {self.choice.text}"
