from rest_framework import serializers
from quizzes import models


class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Choice
        fields = ["id", "text", "is_correct"]


class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = models.Question
        fields = ["id", "text", "points", "choices"]
        ref_name = "QuizzesQuestion"


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = models.Quiz
        fields = ["id", "title", "description", "duration", "is_practice", "questions"]


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Answer
        fields = ["id", "question", "choice"]
        ref_name = "QuizzesAnswer"


class SubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)

    class Meta:
        model = models.Submission
        fields = ["id", "quiz", "user", "score", "submitted_at", "answers"]
        read_only_fields = ["user", "score", "submitted_at"]

    def create(self, validated_data):
        answers_data = validated_data.pop("answers")
        user = self.context["request"].user
        submission = models.Submission.objects.create(user=user, **validated_data)

        score = 0
        total_points = 0

        for answer_data in answers_data:
            question = answer_data["question"]
            choice = answer_data["choice"]

            # lưu answer
            ans = models.Answer.objects.create(
                submission=submission, question=question, choice=choice
            )

            # cộng điểm nếu đúng
            total_points += question.points
            if choice.is_correct:
                score += question.points

        # lưu điểm cuối cùng
        submission.score = score
        submission.save()
        return submission
