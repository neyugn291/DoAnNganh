from rest_framework import serializers
from quizzes import models
from users.serializers import UserSummarySerializer


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

    def create(self, validated_data):
        questions_data = validated_data.pop('questions')
        quiz = models.Quiz.objects.create(**validated_data)
        for q_data in questions_data:
            choices_data = q_data.pop('choices')
            question = models.Question.objects.create(quiz=quiz, **q_data)
            for c_data in choices_data:
                models.Choice.objects.create(question=question, **c_data)
        return quiz

class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Answer
        fields = ["question", "choice"]
        ref_name = "QuizzesAnswer"


class SubmissionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)
    user = UserSummarySerializer(read_only=True)
    quiz = serializers.PrimaryKeyRelatedField(queryset=models.Quiz.objects.all())

    class Meta:
        model = models.Submission
        fields = ["id", "quiz", "user", "score", "submitted_at", "answers"]
        read_only_fields = ["user", "score", "submitted_at"]




    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        user = self.context['request'].user
        submission = models.Submission.objects.create(user=user, **validated_data)
        for answer_data in answers_data:
            submission.answers.create(**answer_data)
        submission.score = sum(a.choice.is_correct * a.question.points for a in submission.answers.all())
        submission.save()
        return submission


