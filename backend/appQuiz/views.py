import sys
from datetime import datetime

from django.db.models import Max
from ipware import get_client_ip
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Answer,
    GivenAnswer,
    Question,
    Sex,
    Test,
    TestExecution,
)
from .serializers import (
    QuestionSerializer,
    SexSerializer,
    TestExecutionSerializer,
    TestSerializer,
)


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer


class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer


class TestExecutionViewSet(viewsets.ModelViewSet):
    queryset = TestExecution.objects.all()
    serializer_class = TestExecutionSerializer


class SexViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sex.objects.all()
    serializer_class = SexSerializer


@api_view(["POST"])
def submit_quiz(request):
    try:
        data = request.data
        quiz_id = data["quiz_id"]
        sex_id = data.get("sex_id")  # opzionale
        age = data["age"]
        duration = data["duration_minutes"]
        answers = data["answers"]  # es: { "1": 14, "3": 15 }

        test = Test.objects.get(id=quiz_id)
        sex = Sex.objects.get(id=sex_id) if sex_id else None
        ip, _ = get_client_ip(request)
        if not ip:
            return Response(
                {"error": "IP address could not be determined"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print(f"IP address: {ip}", flush=True, file=sys.stderr)

        total_score = 0
        correctness_map = {}

        for question_id_str, answer_id in answers.items():
            q_id = int(question_id_str)
            question = Question.objects.get(id=q_id)
            if str(answer_id) == "-1":
                given_answer = None
            else:
                given_answer = Answer.objects.get(id=answer_id, id_question=question)

            max_score = Answer.objects.filter(id_question=question).aggregate(
                Max("score")
            )["score__max"]
            is_correct = given_answer and given_answer.score == max_score

            correctness_map[q_id] = is_correct
            if given_answer:
                total_score += float(given_answer.score)

        # CREA esecuzione
        exec = TestExecution.objects.create(
            age=age,
            sex=sex,
            test=test,
            score=total_score,
            IP=ip,
            duration=duration,
        )

        # REGISTRA risposte
        for question_id_str, answer_id in answers.items():
            q_id = int(question_id_str)
            question = Question.objects.get(id=q_id)
            if str(answer_id) == "-1":
                answer = None
            else:
                answer = Answer.objects.get(id=answer_id)
            GivenAnswer.objects.create(
                test_execution=exec, question=question, answer=answer
            )

        return Response(
            {"execution_id": exec.id, "score": total_score, "results": correctness_map}
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
