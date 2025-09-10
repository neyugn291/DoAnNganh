from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Tag
from users.models import BaseModel

User = get_user_model()

class Comment(BaseModel):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")

    def __str__(self):
        return f"Comment by {self.author} on {self.content_object}"

class Question(BaseModel):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="questions")
    tags = models.ManyToManyField(Tag, related_name="questions", blank=True)
    score = models.IntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    comments = GenericRelation(Comment)
    votes = GenericRelation('Vote')

    def __str__(self):
        return self.title


class Answer(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    body = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="answers")
    score = models.IntegerField(default=0)
    comments = GenericRelation(Comment)
    votes = GenericRelation('Vote')

    def __str__(self):
        return f"Answer by {self.author} on {self.question}"

class Vote(models.Model):
    UPVOTE = 1
    DOWNVOTE = -1
    VALUE_CHOICES = [
        (UPVOTE, "Upvote"),
        (DOWNVOTE, "Downvote"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    value = models.SmallIntegerField(choices=VALUE_CHOICES)

    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ("user", "content_type", "object_id")

    def __str__(self):
        target = self.question or self.answer
        return f"Vote by {self.user} on {target}"
