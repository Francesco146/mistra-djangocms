from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now
from django.db.models import Max
from datetime import datetime

from .models import (
    Question,
    Test,
    TestExecution,
    Sex,
    Answer,
    GivenAnswer,
)
from .serializers import (
    QuestionSerializer,
    TestExecutionSerializer,
    TestSerializer,
    SexSerializer,
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


class SexViewSet(viewsets.ReadOnlyModelViewSet):  # solo GET
    queryset = Sex.objects.all()
    serializer_class = SexSerializer


@api_view(["POST"])
def submit_quiz(request):
    try:
        data = request.data
        quiz_id = data["quiz_id"]
        # sex_id = data.get("sex_id")  # opzionale
        age = data["age"]
        start_time = datetime.fromisoformat(data["start_time"].replace("Z", "+00:00"))
        duration = data["duration_minutes"]
        answers = data["answers"]  # es: { "1": 14, "3": 15 }

        test = Test.objects.get(id=quiz_id)
        # sex = Sex.objects.get(id=sex_id) if sex_id else None
        ip = get_client_ip(request)

        total_score = 0
        correctness_map = {}

        for question_id_str, answer_id in answers.items():
            q_id = int(question_id_str)
            question = Question.objects.get(id=q_id)
            given_answer = Answer.objects.get(id=answer_id, id_question=question)

            max_score = Answer.objects.filter(id_question=question).aggregate(Max("score"))["score__max"]
            is_correct = given_answer.score == max_score

            correctness_map[q_id] = is_correct
            total_score += float(given_answer.score)

        # CREA esecuzione
        exec = TestExecution.objects.create(
            age=age,
            # sex=sex,
            test=test,
            score=total_score,
            IP=ip,
            duration=duration,
        )

        # REGISTRA risposte
        for question_id_str, answer_id in answers.items():
            q_id = int(question_id_str)
            question = Question.objects.get(id=q_id)
            answer = Answer.objects.get(id=answer_id)

            GivenAnswer.objects.create(
                test_execution=exec,
                question=question,
                answer=answer
            )

        return Response({
            "execution_id": exec.id,
            "score": total_score,
            "results": correctness_map
        })

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


def get_client_ip(request):
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0]
    return request.META.get("REMOTE_ADDR")
