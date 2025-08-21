from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Tag
from users.models import BaseModel

User = get_user_model()


class Question(BaseModel):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questions")
    tags = models.ManyToManyField(Tag, related_name="questions", blank=True)
    score = models.IntegerField(default=0)
    views = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title


class Answer(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="answers")
    score = models.IntegerField(default=0)
    is_accepted = models.BooleanField(default=False)


    def __str__(self):
        return f"Answer by {self.author} on {self.question}"


class Comment(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="comments", null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, related_name="comments", null=True, blank=True)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")


    def __str__(self):
        return f"Comment by {self.author}"


class Vote(models.Model):
    UPVOTE = 1
    DOWNVOTE = -1
    VALUE_CHOICES = [
        (UPVOTE, "Upvote"),
        (DOWNVOTE, "Downvote"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE, null=True, blank=True)
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE, null=True, blank=True)
    value = models.SmallIntegerField(choices=VALUE_CHOICES)

    class Meta:
        unique_together = ("user", "question", "answer")  # Mỗi user chỉ vote 1 lần

    def __str__(self):
        target = self.question or self.answer
        return f"Vote by {self.user} on {target}"
