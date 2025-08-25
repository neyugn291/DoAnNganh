from rest_framework import serializers
from discussions import models
from courses.serializers import TagSerializer
from users.serializers import UserSerializer






class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = models.Comment
        fields = ["id", "body", "author", "content_type","object_id", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class AnswerSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Answer
        fields = ["id", "body", "author", "score", "is_accepted", "question", "comments", "created_at", "updated_at"]
        read_only_fields = ["id", "score", "is_accepted", "created_at", "updated_at"]
        ref_name = "DiscussionsAnswer"


class QuestionSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = models.Question
        fields = [
            "id",
            "title",
            "body",
            "author",
            "tags",
            "score",
            "views",
            "answers",
            "comments",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "score", "views", "created_at", "updated_at"]
        ref_name = "DiscussionsQuestion"


class VoteSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.Vote
        fields = ["id", "user", "content_type", "value"]
        read_only_fields = ["id"]
