from rest_framework import serializers

from .models import Answer, Question, Sex, Test, TestExecution


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ["id", "text", "score", "correction"]


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ["id", "name", "text", "id_category", "answers"]


class TestSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ["id", "name", "description", "min_score", "questions"]


class TestExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestExecution
        fields = "__all__"


class SexSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sex
        fields = "__all__"
